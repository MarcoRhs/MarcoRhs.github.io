# Ask my CV — threat model

The public page accepts a question and up to four earlier questions. The server sends those strings, the fixed rules, and a static CV to Gemini. The model has no tools, secrets, database access, or ability to change the CV. Supabase stores the question and answer for 90 days. Visitor IPs are stored only as salted hashes for rate limiting and removed after three days by a scheduled database job.

## Trust boundaries

| Input or component | Risk | Control |
|---|---|---|
| Visitor question and history | Fake CV updates, forged roles, instruction overrides, or long context that crowds out rules | Inputs labeled untrusted; prior answers never replayed; current question capped at 600 characters; history capped at four questions and 600 characters total. |
| Gemini output | Invented claims, missing citation, partial answer | No tools; CV-only rule; temperature 0.2; reject non-`STOP` completions and source lines without known CV section labels. Model content still needs human review for high-stakes uses. |
| Public endpoint | Automated traffic, cost abuse | Per-IP and global daily counters in the database; failed requests refunded. Limits are not identity or anti-bot guarantees. Distributed clients can exhaust the global allowance. |
| Network and browser | Cross-site browser calls, exposed secrets | Strict browser origin check and page Content Security Policy; Gemini key and database service role stay server-side. Non-browser clients can omit Origin, so the rate limit is the main control. |
| Database and logs | Personal data leakage or prolonged retention | No raw IP storage; row-level security and narrow grants; scheduled deletion for IP hashes and conversation logs. Visitors should avoid entering sensitive data. |
| Shared Supabase project | Other project workloads share administration and infrastructure | This function has no tool access; project-level permissions and secrets remain a shared operational boundary. A dedicated project would improve isolation. |

## What the source line proves

The server checks that a completed answer ends with a `Source:` line naming existing CV sections. It does **not** verify that the preceding sentences are supported by those sections. The 30-case regression suite probes common hallucinations and injection attempts, but passing it does not establish universal safety. Recruiters should verify important details with Marco and the downloadable CV.

## Review cadence

After any change to `resume.md`, `prompt.ts`, or the model configuration: regenerate the bot CV and PDF; run deterministic checks and the offline model suite; inspect failed and sensitive answer text; then test a small live sample after deployment. Keep public claims consistent across the page, CV, and assistant.
