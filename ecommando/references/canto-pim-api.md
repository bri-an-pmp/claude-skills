# Canto Product Hub (PIM) API — reference

Source: public SwaggerHub listing (`canto1.portal.swaggerhub.com/producthub/docs/canto-pim-v-v1`, OAS 3.0, last modified 2026-01-12) plus Canto's public help center article "Guideline for integrating Canto with a third-party system." The Swagger page renders its request/response schemas client-side and only the resource/endpoint list was extractable publicly — **treat exact JSON field names as unconfirmed** until checked against a live tenant or Canto developer support. Everything else below (endpoints, auth model, rate limits, webhook events, error codes) is documented fact from the source.

## Base URL

```
https://{tenantSubdomain}.{region}/api/v1/pim/
```

Region options: `canto.com`, `canto.global`, `canto.de`, `au.canto.com`, `ca.canto.com`. Always confirm which region a given tenant is on — do not default to `.com`.

## Authentication

OAuth2, two modes:
- **Authorization Code** — retrieved via the OAuth page with username/password; requires manual/user interaction. Use for user-controlled or front-end integrations (e.g., an asset picker embedded in another app).
- **Client Credentials** — fully automatable, no manual step. Use for backend/server-to-server integrations (scheduled syncs, webhook processors).

Access tokens are valid 30 days. API keys (ID + secret) are provisioned by Canto support, tied to the account's OAuth server (which matches the account's domain — a `.com` tenant uses the `.com` OAuth server, etc.). Do not put client credentials in client-side JavaScript.

## Rate limits

Each endpoint has its own rate limit. The PIM API overall limit is **5 requests/second**. Exceeding it returns HTTP 429; the caller must back off and retry after a wait period. Build retry-with-backoff into any integration rather than a hard failure on first 429.

## HTTP status conventions

- `200 / 201 / 204` — success (read/create/update/delete)
- `400` — payload didn't match the expected schema, or required params missing
- `401 / 403` — auth failed
- `404` — route/resource not found
- `409` — conflict, e.g. duplicate product identifier
- `429` — rate limited (see above)
- `500 / 502 / 503 / 504` — server/infrastructure errors

## Resources and endpoints

| Resource | Endpoints | What it's for |
|---|---|---|
| `products` | GET/POST `/products`, GET/PUT/PATCH/DELETE `/products/{id}`, POST/DELETE `/products/{product_id}/assets`, DELETE `/products/{product_id}/assets/{id}` | Core product record; attach/detach Canto assets directly to a product |
| `variants` | GET/POST `/products/{product_id}/variants`, GET/PUT/PATCH/DELETE `/products/{product_id}/variants/{id}`, POST/DELETE asset endpoints under variant | Product variants (SKU-level), with their own asset attachments — mirrors how Shopify/BigCommerce/Shopware/PrestaShop all put SKU+price+image at the variant, not product, level |
| `dimensions` + `options` | GET/POST `/dimensions`, GET/PUT/PATCH `/dimensions/{id}`; POST/PUT/PATCH `/dimensions/{dimension_id}/options` | Variant axes (e.g. Color, Size) and their possible values — the Canto equivalent of Shopify "Options," BigCommerce/PrestaShop "Combinations," Shopware "Properties" |
| `product_types` | GET/POST `/product_types`, GET/PUT/PATCH `/product_types/{id}` | Classification of products (drives which attributes/schema apply) — closest analog to Magento's Attribute Sets or Amazon's product-type schemas |
| `product_categories` | GET `/product_categories`, GET `/product_categories/{id}` | Taxonomy (read-only via this API — category structure is managed elsewhere in Canto) |
| `product_custom_attributes` | GET/POST `/product_custom_attributes`, GET/PUT/PATCH `/product_custom_attributes/{id}` | Extensible custom fields on products |
| `product_attribute_groups` | GET `/product_attribute_groups`, GET `/product_attribute_groups/{id}` | Grouping/organization of custom attributes (read-only via this API) |
| `product_channel_templates` | GET/POST `/product_channel_templates`, GET/PUT/DELETE `/product_channel_templates/{id}`, POST `/product_channel_templates/{id}/export`, plus nested `/products` sub-resource to attach/detach individual products | **The key integration object.** Defines structure/config for importing and exporting product data to a specific channel (e.g. a Shopify or Amazon export). Includes a `custom_attribute_mapping` schema — this is where Canto attributes get mapped to a target channel's fields |
| `product_catalogs` | GET/POST `/product_catalogs`, GET/PUT/PATCH/DELETE `/product_catalogs/{id}`, plus nested `/products` sub-resource | Groupings of products for publishing/organization, separate from channel templates |
| `bulk_products_channel_templates` / `bulk_products_catalogs` | POST `/bulk/products/channel_templates`, POST `/bulk/products/product_catalogs` | Bulk add/remove products to/from a channel template or catalog in one call — use this instead of looping single-product calls when onboarding a large catalog |
| `imports` / `import_settings` | POST `/import_settings`, POST `/imports` | CSV import pipeline: `import_settings` configures header-to-attribute mapping and how variations/categories/types are assigned; `imports` does the actual multipart CSV upload. Useful for initial catalog load or migrations from spreadsheets |
| `product_share_links` | GET/POST `/product_share_links`, GET/DELETE `/product_share_links/{id}` | Shareable, optionally-expiring links to product records outside the PIM system (e.g. for partner/retailer review) |
| `webhooks` / `webhook_events` | GET/POST `/webhooks`, GET/PUT/PATCH/DELETE `/webhooks/{id}`; GET `/webhooks/{webhook_id}/events`, DELETE .../events/purge | Event-driven notifications, see below |
| `filter` | POST `/product_attributes/filter` | Filter/retrieve product attributes by exact match, partial text match, multi-value match, negative match, product type, or channel template — useful for building sync/audit reports |

## Webhooks

Resources and events supported:
- `product`: `created`, `updated`, `deleted`
- `variant`: `created`, `updated`, `deleted`
- `import`: `started`, `completed`, `failed`

Payload delivered as a POST to a configured URL in JSON/XML/text. Validate authenticity via the `X-Webhook-Signature` header (SHA256 HMAC of the payload, signed with the webhook's secret). **Canto does not persist webhook deliveries** — if a delivery is missed (receiver down, network blip), it's gone. Any integration treating webhooks as the sync-of-truth needs a periodic reconciliation pull (Canto's own guidance recommends daily) rather than relying on webhooks alone.

## Integration patterns Canto documents

From Canto's public integration guideline, the recurring use cases and what's needed for each:

1. **Retrieve/display Canto assets in a third-party system** (CMS, e-commerce) — needs an asset picker (build on Canto's open-source "Universal Connector" sample app, or build your own against the API), search/filter via the API, and Media Publisher (MDC) links for delivering different renditions without downloading.
2. **Display Canto folder/album structure in a third-party system** (CMS, PIM) — retrieve full or partial folder structure and navigate it via the API.
3. **Assign Canto assets to products** (PIM use case) — requires a unique identifier shared between Canto and the product system (e.g. article/SKU number stored as a custom attribute in Canto), and a decision on 1:1 vs 1:n asset-to-product relationships (if 1:n, e.g. multiple part numbers on one asset, they're typically stored comma-separated on the asset's metadata).
4. **Distribute product images in a webshop** — search/retrieve via a unique attribute (item number), optionally with additional metadata for image ordering/type (front/side/top, etc.).
5. **Distribute documents (e.g. safety data sheets)** — search/retrieval by metadata filter criteria, with a similar unique-identifier linkage.

Canto explicitly does not provide developer resources to build a customer's custom integration — only advisory support on how to use the API. Any integration must be built by the customer/partner/SE, which is exactly the gap this skill exists to help fill.

## Existing standard integrations (per canto.com, current as of this writing)

- **Shopify** — one-click push of product attributes + assets from Canto Product Hub to Shopify; kept in sync via the same channel-template mechanism, delivered through Media Publisher (CDN).
- **Amazon** — connects Product Hub to Amazon Seller Central; pushes product changes; explicitly **North America only** at present, with more capability described as "future-ready" / coming in later releases. AI Bulk Update Assistant lets users update multiple attributes via plain-language prompts instead of exports/spreadsheets.

**Everything else in `references/platforms/` — Adobe Commerce/Magento, BigCommerce, Salesforce Commerce Cloud, WooCommerce, SAP Commerce/Hybris, Shopware, PrestaShop, Wix — is not a native, out-of-the-box Canto connector today.** Those files describe how to *build* the integration on the PIM API (`product_channel_templates` + `custom_attribute_mapping`), not a toggle-it-on feature. This is a scope-setting fact, not a footnote: say it early in any conversation about one of those platforms, since it changes timeline, effort, and whether the customer needs a services/partner conversation rather than a pure configuration exercise. Before quoting platform coverage or limitations to a customer, do a quick check of canto.com/integrations for anything newer — these pages are actively maintained and change (Amazon's page itself was last modified within the past few months as of this writing), and Canto may add native connectors over time.
