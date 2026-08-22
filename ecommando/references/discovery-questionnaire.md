# Discovery / scoping questionnaire

Adapted from Canto's own published integration-guideline questions, extended with the platform-specific gotchas that turn into support tickets later. Not every question applies to every deal — use judgment, but don't skip the ones marked **critical** without a good reason.

## Integration shape

1. **[critical]** Which third-party system(s) are being connected? (Name the platform(s) and, if relevant, which specific edition/hosting — e.g. Adobe Commerce SaaS vs. on-prem Magento, SFCC B2C vs. B2B.)
2. **[critical]** What direction does data flow? Canto → platform only, platform → Canto (enrichment/read-back), or bidirectional? Bidirectional is meaningfully more complex — confirm this isn't assumed by default.
3. Backend/system-to-system (batch or event-driven) or front-end/user-driven (e.g., a picker a merchandiser uses manually)? This determines OAuth mode (Client Credentials vs. Authorization Code) — see `references/canto-pim-api.md`.
4. What specific requests/operations are needed against Canto's API? (Read metadata, write metadata, upload assets, retrieve folder/album structure, etc.)

## Identity & structure

5. **[critical]** What's the unique identifier that links a Canto asset/product to a record in the target platform (SKU, article number, GTIN, etc.)? Does it already exist as a Canto attribute, or does it need to be added?
6. **[critical]** Is the asset-to-product relationship 1:1 or 1:n (e.g., one image used across multiple SKUs/part numbers)? If 1:n, how is that represented today (e.g., comma-separated part numbers on the asset)?
7. Does the customer need per-product-type or per-category attribute variation (this is essentially always true for Amazon; sometimes true for others), or is one flat schema sufficient?

## Volume & cadence

8. Roughly how many products/SKUs and how many assets are in scope for initial load?
9. What's the expected ongoing update volume and frequency (daily catalog changes? seasonal bulk pushes? near-real-time)?
10. Is a scheduled sync required, and if so, push (Canto/webhook-initiated) or pull (target-system-initiated on a schedule)? See the webhook durability note in `references/canto-pim-api.md` — webhooks alone are not a safe sync-of-record without a reconciliation pass.

## Assets specifically

11. Do assets need to be linked (Media Publisher/MDC URL) or copied into the target system? Linking avoids duplicate storage and always reflects the latest version, but ties the storefront's asset availability to Canto/MDC uptime — does the target platform support linking, or does it require an upload?
12. Are special renditions, crops, or formats needed (e.g., Amazon's strict main-image background/resolution requirements)? Are these already configured in Media Publisher, or do they need to be set up?
13. Approximately how many assets will be linked/synced, and at what request rate — check this against the target platform's own rate limits as well as Canto's 5 req/sec PIM limit.

## Region, compliance, multi-X

14. Which Canto tenant region (`.com`, `.global`, `.de`, `au.`, `ca.`)?
15. Multi-region, multi-language, or multi-currency storefronts in scope? (Relevant for SFCC multi-catalog, PrestaShop multi-language fields, Shopify Markets, Amazon multi-marketplace.)
16. Any regulated/compliance-sensitive categories (hazmat, batteries, age-restricted, food/pharma claims)? These usually carry extra mandatory attributes on the platform side.

## What's already there

17. Are there other systems in the chain — ERP, another PIM, a MAP/marketing-automation tool — that Canto needs to coordinate with, or that currently own some of this data?
18. Has the customer built (or attempted) this integration before? What broke, or what's the current manual process being replaced?

## Output

Summarize into: integration goal (1-2 sentences), in-scope platform(s) and direction, the identifier/linking strategy, sync cadence and mechanism, asset delivery approach, open questions/risks, and a first-pass Canto capability match (which of `product_channel_templates`, `webhooks`, Media Publisher, CSV `imports`, bulk endpoints cover which requirement — see `references/canto-pim-api.md`). Flag anything the customer wants that isn't currently covered by Canto's standard integrations rather than implying it's supported.
