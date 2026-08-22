# Troubleshooting / QA reference

Always ask for the actual error response, HTTP status, or webhook payload before diagnosing — "it's not syncing" has a dozen possible causes and the specific signal usually narrows it to one or two immediately.

## Auth failures (401/403)

- Token expired — Canto access tokens are valid 30 days; confirm the integration refreshes proactively rather than waiting for a 401.
- Wrong OAuth server for the tenant's domain (`.com` tenant needs the `.com` OAuth server, etc. — see `references/canto-pim-api.md`).
- Client Credentials vs. Authorization Code mismatch — a backend job using an Authorization Code flow token will fail once the manual session context is gone; backend/automated integrations should use Client Credentials.

## Rate limiting (429)

- PIM API is 5 requests/second overall, with per-endpoint limits on top. Bulk operations (`bulk_products_channel_templates`, `bulk_products_catalogs`) exist specifically to avoid looping single-item calls that trip this — if an integration is doing product-by-product calls for a large catalog, that's very likely the root cause, and the fix is to batch, not just add a longer retry delay.
- Confirm the integration has retry-with-backoff, not a hard failure on first 429.

## Conflicts (409)

- Usually a duplicate identifier — most often the unique linking attribute (SKU/article number) already exists on another product. Check whether the integration is doing create-if-not-exists correctly, or blindly POSTing without checking for an existing record first.

## Webhook issues

- **Payload never arrives**: check the webhook is registered for the right resource+event combination (`product`/`variant`/`import` × `created`/`updated`/`deleted`/`completed`/`failed`), and that the receiving endpoint is reachable from Canto's infrastructure (not just from internal networks).
- **Payload arrives but signature validation fails**: confirm the `X-Webhook-Signature` (SHA256 HMAC) is being validated against the correct webhook secret — a common bug is validating against the wrong webhook's secret when a tenant has multiple webhooks configured.
- **Data looks stale despite webhooks being "on"**: Canto does not persist/retry missed webhook deliveries. If the receiver was ever down, those events are gone permanently. This is not a bug to fix — it's a reason to also run a periodic reconciliation pull (daily is Canto's own suggested cadence) rather than trusting webhooks as the sole sync mechanism.

## Attributes mapped but not showing correctly on the storefront

- First isolate whether the value is present in the Canto record, present in the `product_channel_template` export/payload, or present on the platform but not rendering — these are three different bugs (mapping config, export execution, platform-side display config) with different owners.
- Check for type/format mismatches: a Canto free-text attribute mapped to a platform field that expects an enum or a specific format (date, boolean, controlled vocabulary) will often "succeed" at the API level but render blank or wrong on the storefront.
- For Amazon specifically: confirm the attribute is actually part of the required/optional schema for that listing's **product type** — an attribute correctly sent but not part of that product type's schema is commonly silently dropped or flagged, not loudly rejected.

## Images not resolving / broken on the target platform

- If using linked Media Publisher (MDC) URLs rather than uploaded copies: confirm the rendition parameters in the URL are valid and the asset is published/approved (not still in draft/pending-approval state in Canto).
- If the target platform fetches and re-hosts the image (e.g. Shopify does): a slow or timing-out MDC response during the platform's fetch window can cause a silent image-import failure — check platform-side import logs, not just Canto's side.
- For Amazon: verify the image meets that product type's specific requirements (background, minimum resolution, no text/watermark on main image) — these are enforced and will reject/flag the listing, distinct from a generic "broken image" issue.

## Symptom pattern: works for most products, fails for a specific subset

This is one of the most common real-world shapes this complaint takes, and it almost always rules out account-level causes (auth, rate limiting, global webhook failure) — those would break everything, not just some products. Instead, go straight to what's different about the failing subset: do they share a **product type/category** (very likely on Amazon, where the required/optional schema is per product type — see `references/platforms/amazon.md`), a specific **`product_channel_template`** (maybe they're attached to a different or newer template whose mapping is incomplete), or a recent **onboarding/change date** (mapping may have been correct at the time and drifted as the platform's schema changed since)? Ask for identifiers from both the broken set and a working set so you can diff them, rather than investigating the broken ones in isolation.

## General diagnostic order

1. Confirm the value exists correctly in the Canto product/variant record.
2. Confirm the `product_channel_template` mapping includes that field and maps it correctly.
3. Confirm the export/sync actually ran (check `import`/webhook event history) and returned success.
4. Confirm the target platform received and correctly stored/rendered the value.

Working this list top-down (source → mapping → transport → destination) avoids the common trap of debugging the platform side first when the issue actually originates in the Canto-side mapping.
