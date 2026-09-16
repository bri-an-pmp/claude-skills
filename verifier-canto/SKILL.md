---
name: verifier-canto
description: >
  Verify a Canto product answer against internal sources before it goes to a customer.
  Use this skill whenever a Canto employee wants a second pass on an AI-generated response,
  Ada answer, RFx draft, security questionnaire reply, or any customer-facing answer they are
  unsure about. Trigger on: /verify, /verifier, "verify this", "check this answer",
  "is this accurate", "second pass on this", "can you check this", or any time a user pastes
  a Q+A pair and asks for it to be reviewed. Also trigger when the user flags uncertainty
  with phrases like "not sure if this is right" or "want to double-check" alongside a drafted
  answer. This skill should also trigger when the user asks whether an Ada/ADA response is
  correct or trustworthy.
---

# Canto Answer Verifier

A fact-checking skill for Canto employees. Takes a question and a drafted answer, searches
all available Canto sources in parallel, and returns a thumbs-up or thumbs-down verdict
with source references. No padding, no summaries — just verdict + links.

---

## Input

Accept any of the following:
- **Question + Answer**: The original customer question and the drafted response to verify
- **Claim only**: A standalone statement the user wants fact-checked (infer the implied question if needed)
- **Inline flag**: User appends or prepends `/verify` or `/verifier` to a drafted answer

If the answer contains multiple distinct factual claims, identify and verify each one
separately. Return a verdict block per claim.

---

## Process

Search all sources in parallel. Do not wait for one before starting the next.

### Source priority order (for resolving conflicts)

1. **Confluence IH space**
   - cloudId: `0bef3c6f-8a40-4eae-a082-f87e3da341bd` | space key: `IH`
   - Search by keyword first; if topic is known, fetch the relevant page directly
   - Key pages by topic:
     | Topic | Page ID |
     |---|---|
     | AIVS / AI Visual Search | `2674067738` |
     | AI Security Practices | `3510992898` |
     | Security & AI | `3452239874` |
     | AILA / Assisted Metadata | `3261464577` |
     | SSO Config | `2674165832` |
     | Compliance / Security | `2563998579`, `2564096847` |
     | Brand Studio FAQ | `2883584032` |
     | Brand Studio Product Page | `2884665462` |
     | Sub-Processors | `2563965711` |
     | HubSpot Integration | `2694381618` |
     | MDC / Media Delivery Cloud | `2674035559` |
     | Product Hub Import | `3899818023` |
     | Product Hub MCP FAQ | `3941335070` |
     | AI Bulk Update Assistant | `3737190434` |
     | Shopify Integration | `3729981492` |

2. **Slack #product_questions**
   - Channel ID: `C02AKEF8FHD`
   - Search for the specific claim or topic
   - Prioritize threads from the last 6 months
   - Weight responses from known SMEs: Brian Athey, Taylor Summers, Cleo Quiambao,
     Tanya Arora, Will Ponton, Stephan Kühnel, Amrithash Krishnachandran, Patricia Latvala

3. **Canto Help Center** — `support.canto.com`
   - Web search or direct fetch for relevant Help Center articles

4. **Canto public/legal pages**
   - AMER ToS: `canto.com/americas/`
   - AI Policy: `canto.com/legal/cantoai/`
   - Privacy Policy: `canto.com/privacy-policy/`

5. **Canto Trust Center** — `trust.canto.com`
   - Check for security controls, compliance certifications, and sub-processor information
   - Useful for security questionnaire and vendor assessment claims

---

## Verdict Logic

| Verdict | When to use |
|---|---|
| ✅ CONFIRMED | At least one source directly supports the claim; no sources contradict it |
| ⚠️ UNVERIFIED | No sources found that confirm or contradict — claim may be accurate but cannot be sourced |
| ❌ CONTRADICTED | At least one source directly contradicts the claim |

**Edge cases:**
- If a source mostly confirms a claim but adds a meaningful caveat, return ✅ CONFIRMED and
  include the caveat in the reference line
- If Slack contradicts Confluence (or vice versa), surface both — do not silently pick one;
  note the discrepancy and recommend SME confirmation
- Trust more recent sources over older ones when they conflict
- If no sources are found at all, return ⚠️ UNVERIFIED with no additional commentary

---

## Output Format

No preamble. No padding. Start directly with the verdict.

[emoji] [CONFIRMED / UNVERIFIED / CONTRADICTED]

Source Name — Date — one-line summary of what it says about the claim
Source Name — Date — one-line summary of what it says about the claim
Correction: [Only if CONTRADICTED — one to two sentence corrected answer]

If the answer had multiple claims, stack verdict blocks with a one-line claim label above each:

Claim: "[short version of the claim]"
✅ CONFIRMED

source — confirms X

Claim: "[short version of the second claim]"
❌ CONTRADICTED

source — states Y instead
Correction: [corrected version of the second claim]

---

## Examples

**Single claim, confirmed:**

✅ CONFIRMED

AI at Canto — Security Practices, Feb 2026 — Canto does not train foundational AI models using customer data
#product_questions — Taylor Summers, Jul 9 2026 — AIVS uses public datasets only; client data never used to train or update the model

**Single claim, contradicted:**

❌ CONTRADICTED

AI Library Assistant: Assisted Metadata — May 2026 — AILA is only available in the New Library UI Edit Metadata modal, not in Workspaces
Correction: AILA is not available in Workspaces. Assets must be in the main library before AILA suggestions appear.

**Unverified:**

⚠️ UNVERIFIED

No sources found that confirm or contradict this claim.

---

## Hard Rules

- Never return a verdict without at least one linked source (if truly nothing found, return ⚠️ UNVERIFIED)
- Do not include research summaries, analysis paragraphs, or context beyond the verdict block
- Do not rewrite or improve the original answer unless it is CONTRADICTED — then include a correction only
- Do not add a preamble like "I searched the following sources..." — go straight to verdict
