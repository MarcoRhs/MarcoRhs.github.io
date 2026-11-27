# Marco Rohns

**AI Implementation & Solutions | Enterprise Customer Success | Technical Delivery**

Uplengen, Germany · marco.rohns12@gmail.com
linkedin.com/in/marco-rohns · marcorhs.github.io · manemap.app
Seeking permanent remote employment — full-time or suitable part-time

## Summary

Customer-facing implementation and customer success professional combining enterprise account ownership at Ryte, conversational AI delivery at e-bot7 and hands-on product work at ManeMap. Managed approximately €3 million ARR across around 90 accounts at Ryte. I translate customer needs into requirements, integration coordination and adoption plans, working with customers and Product, Engineering and Sales. At ManeMap, I develop the current Kotlin app and Supabase backend with AI-assisted implementation and QA, after managing the initial external build. Seeking permanent employment in AI implementation, solutions consulting, senior or technical customer success, or technical account management: full-time or suitable part-time, remote from Uplengen without recurring office days, with travel up to quarterly.

## Experience

### Founder — ManeMap (The Rohns UG)
08.2025 – present · Remote

Stack: Kotlin · Compose Multiplatform · Supabase (PostgreSQL, Row Level Security, Edge Functions in Deno/TypeScript, pgvector) · Gemini · RAG · RevenueCat · Claude Code

- Develop and release the current Kotlin / Compose Multiplatform app and Supabase backend since 04.2026, after managing the initial externally developed React Native version. AI tools support implementation and QA; I retain responsibility for technical decisions and releases. Live on iOS and Android since 05.2026, with monthly and annual paying subscribers.
- Architected Milo, a RAG-based AI assistant: vector search (pgvector, 768-dimension embeddings) over a curated bilingual DE/EN veterinary knowledge base, combined with horse profile, live weather and training history into daily care advice.
- Built layered health-safety controls: deterministic emergency patterns and a second model classifier identify active incidents before generation; server-side output sanitisation removes unsafe medication detail and internal labels afterwards.
- Own the evaluation strategy and release decisions. Published a scoped Milo emergency-routing regression record, including defects found, changes made and a known remaining failure; details below.
- Developed the Supabase backend: PostgreSQL data model, row-level security, serverless Edge Functions and content pipelines, with stage-level request timing instrumented across the pipeline.
- Built the public AskCV assistant with input validation, request limits, source-label checks and adversarial regression cases; published its source, threat model and dated evaluation record.

### Senior Customer Success Manager — Ryte GmbH (acquired by Semrush)
08.2022 – 09.2025 · Remote

Tools: Ryte Website User Experience & SEO platform · Jira · Confluence

- Managed approximately €3 million ARR across around 90 accounts, connecting onboarding, adoption, technical issue resolution and renewal work.
- Promoted to Senior Customer Success Manager in September 2023 based on portfolio performance.
- Retained and renewed a €10k/month enterprise account that began adversarially — the client sought early exit with legal involvement weeks after signing — turning it around to a full renewal before the contract term ended.
- Drove renewal and expansion across enterprise accounts, owning the full lifecycle from onboarding and success planning through QBRs.
- Supported enterprise accounts across DACH and international markets, working with both consumption-based and seat-based usage models to identify adoption and expansion opportunities.
- Helped build automated onboarding and used product-usage data to improve adoption across the portfolio.
- Led coordination between Product, Engineering and Sales to resolve technical blockers and feed client needs into the roadmap.
- Drove adoption of new AI-powered SEO features in client workflows and built customer success playbooks with defined KPIs.

### Customer Adoption Manager — e-bot7, AI for Customer Service (acquired by LivePerson)
02.2021 – 07.2022 · Hybrid

Tools: conversational AI platform · enterprise chatbot deployments

- Took enterprise customer-service teams live on AI chatbots, owning onboarding and rollout against adoption and satisfaction KPIs.
- Configured conversation flows, NLU training data, fallback and escalation rules. Coordinated REST API integrations and live-agent handover with engineers and customer stakeholders.
- At Vienna Airport, coordinated live flight-data integration and Zendesk handover, including API requirements, payload constraints, rate limits and conversation context. Onboarded the dedicated bot manager to own content and flow updates after launch.
- Analysed adoption metrics and usage patterns to find friction points and feed product improvements.
- Worked with Product, Sales and Engineering across global teams; customised embedded chat interfaces (CSS).

### Consultant — eXperts consulting center, Munich
03.2020 – 01.2021

- Recruited and placed IT and engineering specialists and executives; ran the full sales cycle from prospecting to close.

### Project Manager — Move-Ment.net, Spain & Germany
09.2011 – 02.2020 · project-based from 2018

- Planned and delivered client and event projects across cross-functional teams; applied lean methods to streamline workflows.

## Technical architecture & decisions

- **Milo architecture:** risk routing, 768-dimension vector retrieval, horse/context assembly, Gemini generation and server-side output controls. Stage timings support diagnosis.
- **Stack decisions:** consolidated data, authentication, functions and retrieval in Supabase; replaced the externally managed React Native version with one shared Kotlin codebase.
- **Milo evidence:** the self-published v117 record (21 August 2026) reports 103 deterministic-routing cases including one known failure, zero unintended regressions and 12/12 live smoke probes passed. This historical scope does not establish clinical correctness, retrieval quality or later-release safety. [Milo record](https://marcorhs.github.io/docs/milo-evaluation.md).
- **AskCV evidence:** uses the full CV in the prompt, without vector retrieval or tools. The 2 October 2026 record reports 31/31 pattern-based regression checks and separate live probes. Valid source labels do not establish factual accuracy. [AskCV record](https://marcorhs.github.io/docs/evaluation.md).
- **Ownership:** product direction, architecture, data model, safety logic, evaluation and releases; Claude Code and MCP integrations support implementation and QA.
- **Inspect:** [ManeMap architecture](https://marcorhs.github.io/architecture.html) · [AskCV engineering](https://marcorhs.github.io/askcv.html) · [public source](https://github.com/MarcoRhs/MarcoRhs.github.io) · [threat model](https://marcorhs.github.io/docs/threat-model.md). ManeMap's private implementation is self-attested.

## Skills

- **Delivery:** AI adoption and rollouts, enterprise customer success, stakeholder management, project management, Jira, Confluence, monday.com
- **AI & LLM:** RAG architecture, vector search (pgvector), embeddings, prompt engineering, LLM safety gating, LLM evaluation and regression testing, prompt-injection defence, Gemini, Claude / Anthropic API, OpenAI API, AI agents, Claude Code for AI-assisted development, MCP tool integrations
- **Engineering:** Kotlin, Compose Multiplatform, Supabase, PostgreSQL, Row Level Security, Edge Functions (Deno / TypeScript), REST APIs, RevenueCat, App Store and Google Play releases
- **Automation:** business process automation, Make.com, Zapier, API integrations

## Certifications & Education

- AI Agent Bootcamp — AI Academy (2025)
- Foundations of AI — AI Academy (2024)
- Generative AI Overview for Project Managers — Project Management Institute (2024)
- Artificial Intelligence for Project Managers — LinkedIn Learning, PMI-approved course (2024)
- Introduction to Microsoft 365 Copilot — Microsoft (2023)
- Generative AI Learning Path — Google Cloud Skills Boost (2023)
- Career Essentials in Generative AI — Microsoft & LinkedIn (2023)
- Digital Marketing & E-commerce Certificate — Coursera / Google (2023)
- ThePowerMBA — online business program (2020 – 2022)
- Business Administration certificates — Harvard Business Publishing (2021 – 2022)
- Project Management — IHK Akademie (2019)

## Languages

German (native) · Spanish (native) · English (fluent)
