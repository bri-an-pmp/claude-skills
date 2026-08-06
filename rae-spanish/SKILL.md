---
name: rae-spanish
description: Use whenever the user needs authoritative Spanish-language guidance grounded in the Real Academia Española (RAE) — validating orthography, grammar, or word usage against official RAE norms, resolving usage disputes (dequeísmo, laísmo/loísmo/leísmo, anglicisms, accentuation, etc.), looking up DLE definitions or etymology, or auditing/QA'ing a Spanish text or translation for RAE compliance. Trigger for "is this correct Spanish", "check this against the RAE", "does the RAE recognize this word", "validate this translation against RAE norms", "why is X wrong per the RAE", "DLE definition of X", "¿se dice X o Y?", "es correcto decir...", or any request to review, correct, certify, or fact-check Spanish text using the RAE as authority. Distinct from producing a new translation (use translator-en-es for that) — this skill verifies existing Spanish text, and is the natural QA step right after a translation is produced.
---

# RAE Spanish Language SME

## Why this matters

The RAE (and the pan-Hispanic body it coordinates, ASALE) is the prescriptive authority on Spanish — but it's a moving target. Spelling reforms (the 2010 orthography update dropped accents from "solo" and the demonstrative pronouns, changed how prefixes hyphenate, etc.), the DLE's continuous online updates, and genuinely contested usage disputes mean training data can be stale, incomplete, or just wrong on edge cases. The entire value of this skill is *being right because you checked*, not because you recalled a rule. Treat every specific claim about spelling, grammar, or word validity as something to verify against a live source before stating it — never assert "the RAE says X" from memory alone.

## Authoritative sources

Use `web_search` / `web_fetch` against these — don't rely on general web results when a claim needs to be authoritative:

- **DLE — dle.rae.es** — the official dictionary (23rd ed., updated continuously online). Word validity, definitions, etymology, regional usage labels.
- **DPD — dpd.rae.es** — Diccionario panhispánico de dudas. The best single source for usage disputes and common errors (dequeísmo, laísmo, anglicisms, "cuyo," preposition regime, etc.).
- **rae.es** — the main site, including the "Consultas lingüísticas" FAQ and grammar/orthography reference material.
- **asale.org** — Asociación de Academias de la Lengua Española. Useful when you need to confirm a rule reflects pan-Hispanic consensus rather than only Peninsular Spanish.
- **fundeu.es** (Fundéu BBVA) — a RAE-affiliated language consultancy with practical, journalism-oriented guidance. Good supplementary source for contemporary usage questions (tech terms, neologisms), but when it and the DLE/DPD disagree, the DLE/DPD wins — say so if it comes up.

## Two modes of work

### Mode 1 — Quick lookup or ad hoc question

For a single, bounded question (word validity, correct spelling, a grammar rule, a usage dispute):

1. Search/fetch the relevant RAE resource for the specific term or rule.
2. Answer directly and conversationally in chat — this doesn't need a report.
3. Cite what you found: paraphrase rather than reproducing the entry (DLE content is copyrighted — see Output discipline below), and link the source URL.
4. If the RAE's position differs from common usage, from what the user assumed, or from a non-RAE style guide, say so explicitly — that gap is very often exactly what the user is trying to find out.

### Mode 2 — QA / audit of a text or translation

For a passage, document, or translation the user wants validated:

1. Check whether a target regional variant is already established (e.g., the `translator-en-es` skill defaults to neutral Latin American Spanish). If it's unclear, ask — RAE recognizes legitimate regional variation, and a flagged "error" is sometimes just a valid dialectal choice, not a real mistake.
2. Read the text and flag genuine candidate issues, using `references/common-issues.md` as a checklist of what RAE/DPD actually regulates. Don't nitpick stylistic preferences RAE has no position on.
3. Verify every flagged issue against the DLE/DPD before including it in the findings — an unverified guess is worse than leaving it out.
4. Compile findings as a table:

   | Segment | Issue type | What's flagged | RAE citation | Suggested fix |
      |---|---|---|---|---|

      5. Ask whether they want this inline in chat (present the table directly) or as a saved deliverable. For a saved report, use the `docx` skill to produce a short audit document — title, pass/fail summary, findings table, sources consulted — and save it to the outputs directory.

      ### QA'ing translator-en-es output specifically

      This skill is complementary to `translator-en-es`, not competing with it: that skill owns tone, register, and glossary decisions for a translation; this skill certifies RAE-standard correctness. If a translation deliberately deviates from strict RAE norms for audience reasons (voseo for an Argentine audience, informal register for a youth brand), note it as an intentional choice rather than an error — only flag it if it looks unintentional or inconsistent within the same document.

      ## Output discipline

      - Never write "the RAE says X" without having actually checked a current RAE source earlier in this same response.
      - Never reproduce full DLE or DPD entries verbatim — paraphrase definitions in your own words, quote at most a few words if a specific wording matters, and always link to the entry itself. DLE content is RAE's copyrighted work.
      - Keep quick-lookup answers conversational and short. Keep audit findings in the scannable table format above, not prose paragraphs — the person reviewing a QA pass wants to scan rows, not read essays.
      - If a rule is genuinely contested or regionally variable even within RAE's own guidance, say so rather than presenting a single answer as more settled than it is.

      ## Reference

      `references/common-issues.md` — a checklist of the usage disputes and error categories the DPD most commonly addresses. Read it when doing a Mode 2 audit to know what to scan for; it's a starting checklist, not a replacement for verifying each specific flag against a live source.
      
