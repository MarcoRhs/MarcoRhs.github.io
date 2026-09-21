/**
 * ask-cv — public "Ask my CV" endpoint for https://marcorhs.github.io
 *
 * Request:  POST { "question": string, "history"?: string[] }   (history = earlier questions only)
 * Response: 200 { "text": string } | 4xx/5xx { "error": ErrorCode }
 *
 * Guarantees:
 * - The model sees only the CV, the rules and the visitor's questions. It has no tools and no data access.
 * - Cost is capped: IP_LIMIT questions per visitor and GLOBAL_LIMIT in total per UTC day.
 * - IP addresses are never stored — only a salted SHA-256 hash, kept for at most 3 days.
 * - Questions and answers are logged for 90 days without any visitor identifier.
 *
 * Deploy with verify_jwt = false (see supabase/config.toml). Secrets: see README.
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { buildUserTurn, SYSTEM_PROMPT } from "./prompt.ts";

const IP_LIMIT = 15;
const GLOBAL_LIMIT = 1000; // runaway-cost backstop, set well above organic traffic
const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY = 4;
const MAX_BODY_BYTES = 8_000;
const GEMINI_TIMEOUT_MS = 20_000;
const DEFAULT_ORIGIN = "https://marcorhs.github.io";

type ErrorCode =
  | "method_not_allowed" | "origin_not_allowed" | "bad_request" | "too_long" | "rate_limited"
  | "not_configured" | "unavailable" | "upstream_error" | "refused" | "empty";
type Payload = { text: string } | { error: ErrorCode };

const env = (name: string) => Deno.env.get(name)?.trim() ?? "";
const GEMINI_API_KEY = env("GEMINI_API_KEY");
const GEMINI_MODEL = env("GEMINI_MODEL");
const IP_SALT = env("IP_SALT");
const MODEL_IS_VALID = /^[a-z0-9][a-z0-9.\-]*$/.test(GEMINI_MODEL);
const CONFIGURED = Boolean(GEMINI_API_KEY && IP_SALT && MODEL_IS_VALID);
const parsedOrigins = env("ALLOWED_ORIGINS").split(",").map((o) => o.trim()).filter(Boolean);
const ALLOWED_ORIGINS = parsedOrigins.length > 0 ? parsedOrigins : [DEFAULT_ORIGIN];

const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function reply(body: Payload, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/**
 * Client IP from the one header the client cannot set: cf-connecting-ip, added by Cloudflare in front of
 * Supabase. Headers such as x-forwarded-for are deliberately ignored — clients can supply them. If the header
 * is ever missing, every request shares one bucket: the limit gets stricter, never bypassable.
 */
function clientIp(req: Request): string {
  const ip = req.headers.get("cf-connecting-ip")?.trim();
  if (ip) return ip;
  console.warn("ask-cv: cf-connecting-ip missing; using shared bucket");
  return "shared";
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

type Question = { question: string; history: string[] };

function parseBody(raw: string): Question | ErrorCode {
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return "bad_request"; }
  if (typeof body !== "object" || body === null) return "bad_request";
  const { question, history } = body as Record<string, unknown>;
  if (typeof question !== "string" || !question.trim()) return "bad_request";
  const q = question.trim();
  if (q.length > MAX_QUESTION_CHARS) return "too_long";
  const h = Array.isArray(history)
    ? history.filter((x): x is string => typeof x === "string")
        .map((x) => x.trim().slice(0, MAX_QUESTION_CHARS)).filter(Boolean).slice(-MAX_HISTORY)
    : [];
  return { question: q, history: h };
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

async function askGemini(q: Question): Promise<Payload> {
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserTurn(q.question, q.history) }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 700, thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
  } catch (e) {
    console.error("ask-cv: gemini request failed:", e instanceof Error ? e.name : "unknown");
    return { error: "upstream_error" };
  }
  if (!res.ok) {
    // Status only: error bodies can echo the request, which would put visitor questions into logs.
    console.error("ask-cv: gemini status", res.status);
    return { error: "upstream_error" };
  }
  let data: GeminiResponse;
  try { data = (await res.json()) as GeminiResponse; } catch {
    console.error("ask-cv: gemini returned non-JSON body");
    return { error: "upstream_error" };
  }
  if (data.promptFeedback?.blockReason) return { error: "refused" };
  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts ?? []).map((part) => part.text ?? "").join("").trim();
  if (text) return { text };
  console.warn("ask-cv: empty answer, finishReason:", candidate?.finishReason);
  return { error: candidate?.finishReason === "SAFETY" ? "refused" : "empty" };
}

async function handle(req: Request, origin: string | null): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return reply({ error: "method_not_allowed" }, 405, origin);
  // Browser-only guard. Non-browser clients send no Origin; the rate limit is the real control.
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return reply({ error: "origin_not_allowed" }, 403, origin);
  if (!CONFIGURED) {
    console.error("ask-cv: missing or invalid secret(s)");
    return reply({ error: "not_configured" }, 500, origin);
  }

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return reply({ error: "too_long" }, 413, origin);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ error: "too_long" }, 413, origin);

  const parsed = parseBody(raw);
  if (typeof parsed === "string") return reply({ error: parsed }, parsed === "too_long" ? 413 : 400, origin);

  const ipHash = await sha256Hex(`${IP_SALT}:${clientIp(req)}`);
  const { data: verdict, error: rateError } = await db.rpc("ask_cv_hit", {
    p_ip_hash: ipHash, p_ip_limit: IP_LIMIT, p_global_limit: GLOBAL_LIMIT,
  });
  if (rateError) {
    console.error("ask-cv: rate limit rpc failed:", rateError.message);
    return reply({ error: "unavailable" }, 503, origin);
  }
  if (verdict === "global_limit") console.warn("ask-cv: GLOBAL LIMIT REACHED — assistant paused until UTC midnight");
  if (verdict !== "ok") return reply({ error: "rate_limited" }, 429, origin);

  const result = await askGemini(parsed);
  if ("error" in result) {
    if (result.error !== "refused") {
      EdgeRuntime.waitUntil(db.rpc("ask_cv_refund", { p_ip_hash: ipHash }).then(({ error }) => {
        if (error) console.error("ask-cv: refund failed:", error.message);
      }));
    }
    return reply(result, result.error === "refused" ? 422 : 502, origin);
  }

  EdgeRuntime.waitUntil(
    db.from("ask_cv_log").insert({ question: parsed.question, answer: result.text }).then(({ error }) => {
      if (error) console.error("ask-cv: log insert failed:", error.message);
    }),
  );
  return reply(result, 200, origin);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  try {
    return await handle(req, origin);
  } catch (e) {
    console.error("ask-cv: unhandled error:", e instanceof Error ? e.name : "unknown");
    return reply({ error: "unavailable" }, 503, origin);
  }
});
