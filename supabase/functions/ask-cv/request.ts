export type Question = { question: string; history: string[] };
export type ParseError = "bad_request" | "too_long";

const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY = 4;
const MAX_HISTORY_CHARS = 600;

/** Earlier questions help with pronouns, but must never outweigh the current question or the CV. */
export function normalizeHistory(history: unknown): string[] {
  const result: string[] = [];
  let remaining = MAX_HISTORY_CHARS;
  const recent = Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];
  for (const value of recent.reverse()) {
    if (typeof value !== "string" || remaining === 0) continue;
    const item = value.trim().slice(0, remaining);
    if (item) { result.unshift(item); remaining -= item.length; }
  }
  return result;
}

export function parseBody(raw: string): Question | ParseError {
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return "bad_request"; }
  if (typeof body !== "object" || body === null) return "bad_request";
  const { question, history } = body as Record<string, unknown>;
  if (typeof question !== "string" || !question.trim()) return "bad_request";
  const q = question.trim();
  if (q.length > MAX_QUESTION_CHARS) return "too_long";
  return { question: q, history: normalizeHistory(history) };
}
