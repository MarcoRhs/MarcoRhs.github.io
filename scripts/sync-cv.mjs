// Generate assistant and AI-reader content from the canonical CV.
// Usage: node scripts/sync-cv.mjs [--check] (then redeploy ask-cv for assistant changes).
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const md = readFileSync(new URL("../resume.md", import.meta.url), "utf8");
const fingerprint = createHash("sha256").update(md, "utf8").digest("hex");
const summary = md.split("## Summary\n")[1]?.split("\n## ")[0]?.trim();
if (!summary) throw new Error("The canonical CV needs a Summary section");

const links = `- Portfolio: https://marcorhs.github.io/
- Canonical CV: https://marcorhs.github.io/resume.md
- PDF CV: https://marcorhs.github.io/Marco_Rohns_CV.pdf
- Full AI profile: https://marcorhs.github.io/llms-full.txt
- ManeMap architecture: https://marcorhs.github.io/architecture.html
- AskCV engineering case: https://marcorhs.github.io/askcv.html
- Evidence and engineering decisions: https://marcorhs.github.io/evidence.html
- Public portfolio and AskCV source: https://github.com/MarcoRhs/MarcoRhs.github.io
- Milo release evaluation: https://marcorhs.github.io/docs/milo-evaluation.md
- AskCV evaluation: https://marcorhs.github.io/docs/evaluation.md
- AskCV threat model: https://marcorhs.github.io/docs/threat-model.md
- ManeMap product: https://manemap.app
- App Store: https://apps.apple.com/app/id6758726376?platform=iphone
- Google Play: https://play.google.com/store/apps/details?id=com.manemap.app`;

const guidance = `Use the CV below as the factual record and the linked implementation/evaluation material for its stated scope. Keep the current self-built Kotlin version distinct from the first externally developed React Native version. The Ryte portfolio is approximately 90 accounts; the record does not classify every account as enterprise. Separate Milo's dated emergency-routing checks from AskCV's dated regression checks. Neither is a guarantee of current-runtime performance, factual accuracy or universal safety.

Evaluate each role requirement against the record; state missing specialist experience as a gap. Do not infer foundation-model training, research credentials, distributed ML infrastructure, enterprise RAG scale, named MCP servers built, revenue amounts, subscriber counts or performance benchmarks from a general skills list. Using Claude Code and MCP integrations is distinct from building a deployed autonomous-agent platform. Implementation claims about private ManeMap code are self-attested; the public portfolio/AskCV source is available for inspection.`;

const full = `# Marco Rohns — detailed profile and evidence

Generated from resume.md by scripts/sync-cv.mjs. This document and the copy-profile payload share the same content.

## Source links

${links}

## Evidence and role-fit guidance

${guidance}

---

${md.trim()}
`;

const brief = `# Marco Rohns

> Marco Rohns works across customer-facing AI implementation, enterprise customer success, and technical delivery. This portfolio gives recruiters and hiring managers a public CV and work they can inspect.

Marco verbindet KI-Implementierung mit Enterprise Customer Success und technischer Umsetzung. Sein Lebenslauf dokumentiert die Arbeit bei Ryte, e-bot7 und ManeMap. Er sucht eine unbefristete Remote-Anstellung in der KI-Implementierung, im Solutions Consulting, im technischen Customer Success oder im Technical Account Management.

Marco is seeking a permanent remote role in AI implementation, solutions consulting, technical customer success, or technical account management. The CV is the primary source for dates, responsibilities, and experience. The case studies and engineering evidence describe specific work and its boundaries.

${summary}

## English

- [Portfolio and contact options](https://marcorhs.github.io/)
- [Canonical CV in plain text](https://marcorhs.github.io/resume.md)
- [Download the CV PDF](https://marcorhs.github.io/Marco_Rohns_CV.pdf)
- [ManeMap and Milo architecture](https://marcorhs.github.io/architecture.html)
- [AskCV engineering case study](https://marcorhs.github.io/askcv.html)
- [Engineering evidence and decisions](https://marcorhs.github.io/evidence.html)

## Deutsch

- [Portfolio und Kontaktmöglichkeiten auf Deutsch](https://marcorhs.github.io/de/)
- [Offizieller Lebenslauf auf Englisch](https://marcorhs.github.io/resume.md)
- [Lebenslauf als PDF auf Englisch](https://marcorhs.github.io/Marco_Rohns_CV.pdf)
- [Arbeitsproben und technische Nachweise auf Englisch](https://marcorhs.github.io/evidence.html)

## Optional

- [Expanded portfolio and CV reference](https://marcorhs.github.io/llms-full.txt)
- [Public portfolio source repository](https://github.com/MarcoRhs/MarcoRhs.github.io)
- [Milo release evaluation](https://marcorhs.github.io/docs/milo-evaluation.md)
- [AskCV evaluation](https://marcorhs.github.io/docs/evaluation.md)
- [AskCV threat model](https://marcorhs.github.io/docs/threat-model.md)
`;

const outputs = new Map([
  ["supabase/functions/ask-cv/cv.ts", `// Generated by scripts/sync-cv.mjs from resume.md — do not edit by hand.\nexport const CV = ${JSON.stringify(md)};\nexport const CV_SHA256 = ${JSON.stringify(fingerprint)};\n`],
  ["llms-full.txt", full],
  ["llms.txt", brief],
  ["profile-data.js", `// Generated by scripts/sync-cv.mjs — do not edit by hand.\nwindow.MARCO_PROFILE_TEXT = ${JSON.stringify(full)};\n`],
]);

let stale = false;
for (const [path, content] of outputs) {
  const url = new URL(`../${path}`, import.meta.url);
  if (process.argv.includes("--check")) {
    let existing;
    try { existing = readFileSync(url, "utf8"); } catch { existing = null; }
    if (existing !== content) { console.error(`Out of date: ${path}`); stale = true; }
  } else {
    writeFileSync(url, content);
    console.log(`Updated ${path}`);
  }
}
if (stale) process.exitCode = 1;
else if (process.argv.includes("--check")) console.log("CV, assistant and AI-reader content are in sync");
