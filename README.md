# Claude Skills

A collection of reusable AI skills for digital asset management, e-commerce integrations, agile product management, brand governance, customer-answer verification, and authoritative Spanish-language review.

## Available skills

| Skill | Description | Download |
| --- | --- | --- |
| [Ecommando](./ecommando/SKILL.md) | Solutions engineering assistant for Canto Product Hub and Media Delivery Cloud integrations. Supports discovery, product metadata and attribute mapping, channel templates, API implementation, troubleshooting, and commerce platforms including Shopify, Amazon, Adobe Commerce, BigCommerce, Salesforce Commerce Cloud, and WooCommerce. | [ecommando.skill](./ecommando.skill) |
| [Canto Brand](./canto-brand/SKILL.md) | Canto brand governance guide for creating and reviewing customer-facing or internal content. Covers brand voice, messaging pillars, approved colors, typography, logo usage, visual composition, accessibility, and standard company descriptions. | [canto-brand.skill](./canto-brand.skill) |
| [Back to the Feature](./back-to-the-feature/SKILL.md) | Agile product management assistant that converts customer pain points, product gaps, and enhancement ideas into actionable feature requests with user stories, problem statements, proposed solutions, acceptance criteria, and prioritization signals. | [back-to-the-feature.skill](./back-to-the-feature.skill) |
| [RAE Spanish](./rae-spanish/SKILL.md) | Spanish-language quality assurance specialist that validates spelling, grammar, terminology, usage, and translations against guidance from the Real Academia Española and other authoritative Spanish-language institutions. | Browse skill folder |
| [Twilio A2P 10DLC](./twilio-a2p-10dlc/SKILL.md) | Expert on US A2P 10DLC registration for Twilio: Trust Hub profiles, Brand registration with The Campaign Registry (TCR), Campaign registration, and the exact business/campaign information to collect, with an HTTP-level walkthrough of every API call in the flow. | Browse skill folder |
| [Verifier Canto](./verifier-canto/SKILL.md) | Fact-checks a Canto product answer against Confluence, Slack #product_questions, Help Center, legal pages, and the Trust Center. Returns a confirmed / unverified / contradicted verdict with source references — no padding. | Browse skill folder |

## Installation

1. Download the relevant `.skill` package from the table above.
2. Import the package into an AI application that supports skill files.
3. Describe a task related to the skill, or invoke the skill directly when supported.

Each packaged skill is also available as an expanded folder so its instructions and supporting reference materials can be reviewed before installation.

## Skill contents

- `ecommando/`: Skill instructions, integration discovery questionnaire, troubleshooting guide, Canto PIM API reference, and platform-specific commerce integration references.
- `canto-brand/`: Canto messaging, brand voice, visual identity, accessibility, logo, typography, and content guidelines.
- `back-to-the-feature/`: Agile feature request structure, user story format, acceptance criteria, and prioritization guidance.
- `rae-spanish/`: Authoritative Spanish-language review instructions and reference material.
- `twilio-a2p-10dlc/`: A2P 10DLC skill instructions, business/campaign field references, Trust Hub → Brand → Campaign API flow (Node + curl), and troubleshooting/error-code reference.
- `verifier-canto/`: Canto answer verifier instructions, source priority (Confluence IH, Slack, Help Center, legal pages, Trust Center), verdict logic, and output format.

## Working in this repo

`main` is the installable catalog. It is the only long-lived branch. Do not keep standing branches per skill.

Open a short-lived branch, pull-request into `main`, then delete the branch:

| Work | Branch |
| --- | --- |
| New skill | `skill/<name>` |
| Update one skill | `skill/<name>-<change>` |
| Source or fact fixes | `fix/<skill>-<what>` |
| README / catalog only | `docs/readme` |
| Throwaway experiment | `wip/<topic>` |
