# Proposed ManeMap retrieval evaluation

Status: design only, 5 November 2026. No retrieval-quality experiment or numerical result has been conducted or claimed here.

## Purpose

Evaluate whether the retrieval stage returns relevant knowledge for representative questions, separately from evaluating the generated answer. The existing v117 emergency-routing record measures neither retrieval relevance nor answer faithfulness.

## Before running

1. Choose an approved, versioned knowledge-base snapshot and record its identifier, embedding model, index configuration, language and retrieval settings. Avoid real user questions and personal or proprietary text in any public dataset.
2. Create a small synthetic set covering German and Spanish, typical and ambiguous queries, no-answer queries, and cases where a plausible result is irrelevant. Include emergency questions only if a qualified reviewer can assess them safely; routing and medical correctness require separate protocols.
3. Have a knowledgeable reviewer label relevant document or chunk identifiers per query, including queries with no appropriate answer. Record who labelled what, the rubric, disagreements and the snapshot. Split examples used to tune retrieval from examples used for the final check.
4. Record the number of queries and execution date. Run retrieval only; log returned identifiers, rank, latency and errors without publishing private content. Avoid live customer traffic or production load without an explicit operational plan.

## Report

Report per-language and overall recall at the configured k for answerable queries, explain the denominator and label uncertainty, and separately report no-answer behaviour and failures. Include individual anonymized failure examples when safe. Compare changes against the same held-out set and configuration; do not claim clinical correctness, answer faithfulness, safety, or population-wide quality from these checks. Publish the method and aggregate results only after review for confidentiality, cost and safety.
