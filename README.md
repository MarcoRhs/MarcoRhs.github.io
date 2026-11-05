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
- **Request limits, atomic counters.** 15 questions per visitor and 1,000 in total per UTC day. An advisory lock serialises the check-and-increment, denied requests aren't counted, and failed answers are refunded. These admission counters are not a strict monetary cap.
- **Privacy by default.** The application database stores a salted IP hash, not the raw IP. A scheduled pg_cron job prunes rate rows and question/answer logs under the documented retention policy; deployed scheduling must be verified. Upstream error bodies are not logged. Fonts use the native system stack; a strict Content Security Policy allows no third-party requests except the API.
- **Least privilege in Postgres.** Tables use RLS with no policies and are revoked from `public`, `anon` and `authenticated`. Both functions are `security definer` with `search_path = ''` and fully qualified names, executable only by `service_role`.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `style.css`, `app.js`, `profile-view.js` | Static homepage and reading-mode interactions. |
| `architecture.html`, `askcv.html` | Separate ManeMap and AskCV engineering cases. |
| `evidence.html` | Human-readable evidence index and engineering decisions, with dated scope limits. |
| `.github/workflows/portfolio-checks.yml` | Deterministic checks on push/PR; optional manual offline model run. |
| `scripts/release/check-corpus.mjs` | Compares deployed assistant corpus fingerprint to the published CV bytes. |
| `scripts/check-profile-view.mjs` | Deterministic reading-mode, navigation and copy checks. |
| `resume.md` | The CV as Markdown — single source of truth, also readable by AI agents. |
| `Marco_Rohns_CV.pdf` | Printable CV. |
| `scripts/build-cv.py` | Regenerates the public PDF from `resume.md` using ReportLab. |
| `supabase/functions/ask-cv/` | `index.ts` (handler), `request.ts` (input checks), `prompt.ts` (rules and source labels), `cv.ts` (generated). |
| `supabase/migration_ask_cv.sql` | Tables, rate-limit/refund/prune functions, grants, daily retention cron. |
| `supabase/config.toml` | `verify_jwt = false` for `ask-cv` — the static page sends no token. |
| `scripts/sync-cv.mjs` | Generates `cv.ts`, `llms.txt`, `llms-full.txt` and `profile-data.js` from `resume.md`; `--check` detects drift. |
| `scripts/eval/` | Regression eval: `cases.json` (cases), `check.mjs` (deterministic checks), `run.mjs` (model and live runner). |
| `docs/threat-model.md` | Trust boundaries, abuse cases, controls, and remaining risks. |
| `docs/evaluation.md` | Tested behavior, latency, and limits of the evidence. |

## Evaluation

`scripts/eval/` currently holds 35 case definitions (the published 2 October record remains the historical 31-case result). These cover CV facts, missing information, role fit, prompt injection, forged history, German and Spanish, and recruiter questions. Offline mode uses the current local prompt and a specified Gemini model without touching the public rate limit or production log. The live mode probes the deployed function, including its input and output checks, and uses the public daily allowance. The model is stochastic: regex checks are a regression screen, not a factual accuracy guarantee. Review answer text in the saved report, especially for new CV facts or prompt changes.

Run after a CV or prompt change:

```
node scripts/eval/check.mjs
node scripts/check-profile-view.mjs
node scripts/sync-cv.mjs --check
GEMINI_API_KEY=... node scripts/eval/run.mjs --mode=offline --model=gemini-2.5-flash
GEMINI_API_KEY=... node scripts/eval/run.mjs --mode=offline --ids=working_model,fake_employer,reveal_prompt --repeat=3
node scripts/eval/boundary.mjs
node scripts/eval/run.mjs --mode=live --ids=anthropic_csm,full_time,reveal_prompt
```

Reports are written to `scripts/eval/results/` (git-ignored).

The workflow runs only after it has been published to GitHub. A manual model run requires a repository `GEMINI_API_KEY` secret and may incur provider charges. Its JSON report is uploaded as a workflow artifact even on a failed run; results are not automatically published on the website. Tests are owner-selected, and source-label/regex checks do not establish factual accuracy. Artifacts have GitHub's configured retention and access settings; inspect results before sharing.

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
6. After both releases, run `node scripts/release/check-corpus.mjs`. It fetches the published CV and the assistant's public metadata, compares SHA-256, and exits nonzero on a mismatch, missing metadata, HTTP error or network failure. This confirms matching corpus bytes only; it does not verify the prompt, model, function behavior, or deployed site's other content. A previously deployed function will fail until it is updated. Coordinate the rollout and verify both deployments; this post-release check detects drift but does not itself block deployment.

Fonts: the site uses the native system font stack for headings and body copy. Earlier self-hosted font files remain in `fonts/` for reference but are not requested by the page.


## Current revision

The 4 November source revision adds the user-confirmed approximate Ryte portfolio scale, current-version ownership, linked and scoped evaluation evidence, and synchronized AI-reader content. Static checks do not establish current model behavior. Deploy the updated `ask-cv` source to activate the new CV corpus; publish the static files together, including `profile-view.js` and generated `profile-data.js`. Historical evaluation records must not be relabeled as checks of this revision.
