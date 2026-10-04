---
name: twilio-rebuttals
description: Generate persona-based panel questions and tight five-sentence rebuttals for Twilio solutions-engineering demos, interviews, and customer meetings, delivered as a Word document. Use this skill whenever the user wants to prepare for objections, Q&A, tough questions, panel questions, "what will they ask me", rebuttals, or practice answers for a Twilio demo or presales interview, especially when they mention personas (CTO, COO, VP Engineering, Director of CX, sales director), a mock customer, A2P 10DLC, HIPAA, webhooks, or a Twilio deck, even if they don't say "rebuttal".
---

# Twilio Rebuttals

Turn a Twilio demo (deck, speaker notes, emails, account brief, interview prompt) into a bank of likely questions per panelist, each with a five-sentence answer, delivered as a .docx.

## Workflow

1. **Gather the materials.** Read everything the user shared or referenced: deck and speaker notes, pre-read email, account brief, interview prompt, and what is live vs. simulated in the demo. Note the customer, personas, demo channels, and known gaps (e.g., SMS blocked by A2P review, sandbox senders, tunnels). If materials live in connected tools (Canva, Drive, Docs), read them there.
2. **Define personas.** For each panelist capture name, mock role, lens (what they care about), and stated asks. If the user mentions a panelist's real-life role (e.g., a Twilio sales director), add questions that role would naturally ask (deal progression, next steps, who is in the room).
3. **Draft questions** (default 20 per persona unless the user specifies). Cover a spread:
   - Business/executive: ROI, cost, timeline, risk, scale, decisions, measurement.
   - Technical: integration, webhook validation and failure, 201 vs. delivered, idempotent callbacks, credentials, throughput, HIPAA/BAA and PHI, consent/opt-out, testing, monitoring, production deltas, verification of AI-assisted code.
   - Experience/operations: customer journey, channel choice, language, accessibility, staff workload, training, pilot design.
   - Evaluator meta-questions: why Twilio, what would you change, what did you learn.
   Every gap the demo openly admits should appear as at least one question.
4. **Write each answer in exactly five sentences**, following `references/answer-framework.md`.
5. **Check accuracy.** Never invent prices, SLAs, approval times, or customer results. Use figures already sourced in the user's materials; otherwise commit to confirming ("the account executive will bring exact pricing"). Search current Twilio docs when compliance or product details may have changed.
6. **Build the .docx.** Write the content to JSON using the schema in `references/example-aspen-dental.json`, then run:
   ```bash
   node scripts/build_docx.js content.json /mnt/user-data/outputs/<Name>_Rebuttals.docx
   ```
   Read the public docx skill first if available. Render to PDF and look at a page before presenting.
7. **Deliver** with present_files and a two-line summary. Offer to quiz the user one question at a time.

## Output rules
- One section per persona; numbered questions as Heading 2 so they appear in the table of contents.
- Exactly five sentences per answer; verify with a quick script.
- Plain, confident language; a brief acknowledgment, no filler.
- Keep fictional personas and scenario figures clearly labeled as fictional.

## References
- `references/answer-framework.md`: the five-beat answer structure, an example, and accuracy guardrails.
- `references/example-aspen-dental.json`: a complete 60-question example (Aspen Dental, three personas) showing tone, coverage, and the JSON schema the build script expects.

