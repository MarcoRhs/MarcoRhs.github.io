# Milo safety-gate evaluation — v117 release record

**Release:** `ask-milo` v117  
**Deployed:** 21 August 2026  
**Scope:** deterministic emergency routing before normal model generation  
**Evidence type:** self-published summary of the release QA record; it contains no user data, credentials, private infrastructure details, or medical instructions.

## What was tested

The test harness loads the real emergency-keyword lists and routing order from the release source. It compares the prior deployed release (v116) with v117, so a changed keyword list or reordered routing cascade cannot silently pass an unchanged test suite.

The live smoke checks call the deployed endpoint with no persisted conversation thread. Each probe verifies three things: whether the emergency gate fires, whether it selects the expected response category, and whether the response contains a medication name.

## Recorded release result

| Check | Result |
|---|---:|
| Offline deterministic gate cases | 103 total; 1 pre-existing German inflection case remained failing |
| Unintended safety regressions | 0 |
| New cases correctly routed to the gate | 27 |
| Intended false-positive reductions | 5 |
| Live deployed smoke probes | 12 / 12 passed |

The remaining offline failure was documented and left out of this release because it pre-dated the Spanish-routing scope. It was recorded for a follow-up fix rather than hidden or counted as a pass.

## What changed because of testing

The evaluation found and fixed real pre-release issues:

- Spanish acute-relapse wording could bypass the deterministic gate.
- A Spanish bleeding conjugation and feminine trapped-horse wording could miss routing.
- Spanish category routing could fall back to a generic response.
- Substring matching could falsely classify ordinary terms as a trapped-horse emergency.
- A foaling emergency with bleeding could receive the wrong first-aid category because bleeding was evaluated first.

The release added the required Spanish routing coverage, switched risky substring matches to boundary matching, and evaluates foaling before bleeding. The release record also documents the known limitations left for follow-up.

## Live-smoke coverage

The 12 deployed probes covered Spanish emergency, Spanish educational, German emergency, German educational, English educational, category selection, an intended false-positive reduction, and medication-name leakage. All 12 matched their expected gate state and category, and none contained a medication name.

## What this evidence does and does not prove

This is evidence that the v117 deterministic emergency gate was tested against defined scenarios, found defects, and passed its recorded release checks. It does **not** prove universal safety, clinical correctness, retrieval quality, or every aspect of Milo's generated answer. The project treats emergency guidance as a safety boundary: when signals are uncertain, the product directs the user to veterinary care.

The public AskCV evaluation is separate and covers a different system. See [AskCV evaluation](evaluation.md) and the [ManeMap architecture](../architecture.html) for their distinct scopes.
