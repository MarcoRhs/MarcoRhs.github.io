# Ask my CV — Marco Rohns

Live: **https://marcorhs.github.io**

A personal CV page with a CV-grounded Q&A assistant. Visitors ask about my work; the assistant is instructed to answer from my CV, names the CV section it used, and says "not in CV" when the information is missing. Source labels are checked for format and known section names; they are not proof that every statement is true.

## Architecture

```
Browser (GitHub Pages, static HTML/CSS/JS)
   │  POST { question, history[] }        history = earlier questions only, capped at 600 characters total
   ▼
Supabase Edge Function  ask-cv  (Deno / TypeScript)
   ├─ validate: method, body size, shape, browser origin
   ├─ rate limit → Postgres RPC ask_cv_hit (salted IP hash; per-visitor + global daily cap)
   ├─ Gemini generateContent (system instruction = rules + CV; no tools)
   ├─ reject incomplete answers and invalid source labels
   ├─ on upstream failure → ask_cv_refund (outages don't burn the budget)
   └─ log question + answer (no visitor identifier, 90-day retention)
```

## Design decisions

- **Grounding over cleverness.** The model receives the CV and the rules, nothing else: no tools, no retrieval, no data access. A prompt injection can still produce a misleading answer, so the suite probes this and the server rejects answers without a valid source line.
- **No forged model turns.** The client sends only earlier *questions*, never earlier answers. Earlier questions are untrusted and capped at 600 characters in total.
- **The rate limit is the access control.** The origin check only stops other websites' browsers; non-browser clients send no Origin. The limit is keyed on `cf-connecting-ip`, which clients cannot set. If it's ever absent, all requests share one bucket — stricter, never bypassable.
- **Bounded cost, atomic limits.** 15 questions per visitor and 1,000 in total per UTC day. An advisory lock serialises the check-and-increment, denied requests aren't counted, and failed answers are refunded.
- **Privacy by default.** IPs are never stored — only a salted SHA-256 hash, deleted after 3 days by a scheduled job (pg_cron), independent of traffic. Questions and answers are deleted after 90 days. Upstream error bodies are not logged. Fonts are self-hosted; a strict Content Security Policy allows no third-party requests except the API.
- **Least privilege in Postgres.** Tables use RLS with no policies and are revoked from `public`, `anon` and `authenticated`. Both functions are `security definer` with `search_path = ''` and fully qualified names, executable only by `service_role`.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `style.css`, `app.js` | The page. Static, no build step. |
| `resume.md` | The CV as Markdown — single source of truth, also readable by AI agents. |
| `Marco_Rohns_CV.pdf` | Printable CV. |
| `scripts/build-cv.py` | Regenerates the public PDF from `resume.md` using ReportLab. |
| `supabase/functions/ask-cv/` | `index.ts` (handler), `request.ts` (input checks), `prompt.ts` (rules and source labels), `cv.ts` (generated). |
| `supabase/migration_ask_cv.sql` | Tables, rate-limit/refund/prune functions, grants, daily retention cron. |
| `supabase/config.toml` | `verify_jwt = false` for `ask-cv` — the static page sends no token. |
| `scripts/sync-cv.mjs` | Regenerates `cv.ts` from `resume.md`. |
| `scripts/eval/` | Regression eval: `cases.json` (cases), `check.mjs` (deterministic checks), `run.mjs` (model and live runner). |
| `docs/threat-model.md` | Trust boundaries, abuse cases, controls, and remaining risks. |
| `docs/evaluation.md` | Tested behavior, latency, and limits of the evidence. |

## Evaluation

`scripts/eval/` holds 30 questions covering CV facts, missing information, role fit, prompt injection, forged history, German and Spanish, and recruiter questions. Offline mode uses the current local prompt and a specified Gemini model without touching the public rate limit or production log. The live mode probes the deployed function, including its input and output checks, and uses the public daily allowance. The model is stochastic: regex checks are a regression screen, not a factual accuracy guarantee. Review answer text in the saved report, especially for new CV facts or prompt changes.

Run after a CV or prompt change:

```
node scripts/eval/check.mjs
GEMINI_API_KEY=... node scripts/eval/run.mjs --mode=offline --model=gemini-2.5-flash
GEMINI_API_KEY=... node scripts/eval/run.mjs --mode=offline --ids=onsite,fake_employer,reveal_prompt --repeat=3
node scripts/eval/run.mjs --mode=live --ids=anthropic_csm,full_time,reveal_prompt
```

Reports are written to `scripts/eval/results/` (git-ignored).

## Deploy

1. Apply `supabase/migration_ask_cv.sql` to the target project (idempotent).
2. Set function secrets:
   - `GEMINI_API_KEY` — Google AI Studio key
   - `GEMINI_MODEL` — e.g. `gemini-2.5-flash`
   - `IP_SALT` — random secret, e.g. `openssl rand -hex 32`
   - `ALLOWED_ORIGINS` — optional, comma-separated; defaults to `https://marcorhs.github.io`
3. Enable `pg_cron` (Database > Extensions) so the daily retention job is scheduled by the migration. Without it, the migration still applies and warns; retention then won't run until pg_cron is enabled.
4. `supabase functions deploy ask-cv` (picks up `verify_jwt = false` from `config.toml`).
5. After editing `resume.md`: `node scripts/sync-cv.mjs`, rebuild the PDF with `python3 scripts/build-cv.py` (ReportLab required), then redeploy the function and publish the static site.

Fonts: Bricolage Grotesque and IBM Plex Sans, SIL Open Font License (see `fonts/`).
