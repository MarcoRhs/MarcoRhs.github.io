# Ask my CV — Marco Rohns

Live: **https://marcorhs.github.io**

A personal CV page with a grounded Q&A assistant. Visitors ask about my work; the assistant answers only from my CV, names the CV section each answer comes from, and says "not in CV" instead of guessing.

## Architecture

```
Browser (GitHub Pages, static HTML/CSS/JS)
   │  POST { question, history[] }        history = earlier questions only
   ▼
Supabase Edge Function  ask-cv  (Deno / TypeScript)
   ├─ validate: method, body size, shape, browser origin
   ├─ rate limit → Postgres RPC ask_cv_hit (salted IP hash; per-visitor + global daily cap)
   ├─ Gemini generateContent (system instruction = rules + CV; no tools)
   ├─ on upstream failure → ask_cv_refund (outages don't burn the budget)
   └─ log question + answer (no visitor identifier, 90-day retention)
```

## Design decisions

- **Grounding over cleverness.** The model receives the CV and the rules, nothing else: no tools, no retrieval, no data access. Worst case for prompt injection is an off-brand answer to the person who asked.
- **No forged model turns.** The client sends only earlier *questions*, never earlier answers, so history cannot inject fake assistant messages.
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
| `supabase/functions/ask-cv/` | `index.ts` (handler), `prompt.ts` (rules), `cv.ts` (generated). |
| `supabase/migration_ask_cv.sql` | Tables, rate-limit/refund/prune functions, grants, daily retention cron. |
| `supabase/config.toml` | `verify_jwt = false` for `ask-cv` — the static page sends no token. |
| `scripts/sync-cv.mjs` | Regenerates `cv.ts` from `resume.md`. |
| `scripts/eval/` | Regression eval: `questions.json` (cases and checks), `run.mts` (runner). |

## Evaluation

`scripts/eval/` holds a 59-question regression suite (65 calls with repeats) that runs the exact production prompt against Gemini — offline, so it never touches the live rate limit or the production log. Categories: grounded facts, frontier-lab depth, inference traps, role-fit questions, adversarial prompts (injection, prompt extraction, forged history), German and Spanish, and consistency across repeats.

Hard gates: zero invented facts or forbidden content, every manipulation attempt declined. Run after any change to `resume.md` or the prompt:

```
GEMINI_API_KEY=... GEMINI_MODEL=gemini-3.6-flash npx -y tsx scripts/eval/run.mts
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
5. After editing `resume.md`: `node scripts/sync-cv.mjs`, then redeploy.

Fonts: Bricolage Grotesque and IBM Plex Sans, SIL Open Font License (see `fonts/`).
