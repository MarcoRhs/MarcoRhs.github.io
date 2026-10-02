# Ask my CV — evaluation record

Tested on 2 October 2026. A separate Claude review of the live page and source informed the attack cases and documentation corrections; the local Codex review implemented the tests and fixes.

| Test | Result | Observed latency |
|---|---:|---:|
| Offline, current prompt and CV, Gemini 2.5 Flash, 30 cases | 30/30 checks passed | median 0.85 s; p95 1.69 s |
| Offline, 5 high-risk cases repeated 3 times before final prompt clarification | 15/15 checks passed | median 0.77 s; p95 2.44 s |
| Offline, forged-history case repeated after final prompt clarification | 5/5 checks passed | median 0.75 s; p95 0.88 s |
| Live deployed Edge Function, 3 smoke cases | 3/3 checks passed | median 2.64 s; p95 2.77 s |
| Live input-boundary probes | 4/4 checks passed | invalid JSON, long question, oversized UTF-8 body, foreign Origin |
| Final function version 12, normal live question | 1/1 check passed | 1.57 s |
| Offline after answer-format fix, including the reported tech-stack question | 31/31 checks passed | median 0.86 s; p95 1.40 s |

The final 30-case run covered factual CV questions, unsupported claims, role fit, employer and credential forgery, forged conversation history, prompt extraction, off-topic roleplay, German and Spanish questions, and a follow-up. The live sample checked weekly on-site availability, Anthropic CSM role fit, and forged history on function version 11. Version 12 fixed UTF-8 request-size measurement and passed the boundary probes and a normal live question. Test calls were removed from the per-IP daily counter after verification; the public rate limit remains 15 per IP per UTC day.

Two failures found during testing drove changes: a multi-part role-fit answer cited six valid CV sections while the server had imposed a five-section cap; a weekly Frankfurt attendance answer treated the conflict with Marco's two-visits-per-month limit as unspecified. A repeated forged-history response also omitted the `not in CV` label while correctly rejecting the fake claim. The prompt and checks were changed, and the cases passed again.

These are regression checks, not a guarantee of factual correctness or security. They use pattern matching plus manual inspection of sensitive answers. The offline run used Gemini 2.5 Flash; the production model name is set in a server-side secret and was not available to the reviewer, so the live sample matters. Static page files total roughly 104 KB before font selection; the PDF is roughly 44 KB. Live question latency includes the public function and model request and will vary with network and provider load.

The answer-format check was added after a visitor saw literal `**` markers and a collapsed technology list. The page now renders short bullet lists and bold labels safely, even if the model emits Markdown despite the plain-text instruction.
