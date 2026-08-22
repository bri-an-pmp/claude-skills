# Shopify — metadata model & mapping notes

## Field split: Product vs. Variant

Shopify separates product-level and variant-level data — this is the single most common source of mapping confusion:

- **Product-level**: Handle (unique URL slug/identifier), Title, Body/Description (HTML), Vendor, Product Type (free-text, used for storefront grouping/nav, not a strict taxonomy), Tags (comma-separated, free-text).
- **Variant-level**: SKU, Price, Compare-at-price, Option1/Option2/Option3 (name + value, up to 3 option axes e.g. Color/Size/Material), Inventory Quantity, Weight, Image (falls back to product image if none set at variant level), Barcode.

## Images

`Image Src` is a URL. Shopify will fetch and host the image itself — this is where a Media Publisher (MDC) link is ideal: point Shopify's image field at a stable MDC rendition URL rather than uploading a static copy, so updates in Canto propagate without a re-push. Confirm with the customer whether they want Shopify to "own" a copy (safer against Canto downtime, but goes stale) or reference Canto/MDC live (always current, but couples storefront uptime to Canto/MDC availability).

## Metafields

Anything that doesn't fit Shopify's native schema goes into **metafields** — arbitrary namespace+key custom fields, definable at the product, variant, or other resource level. This is the natural landing spot for most Canto `product_custom_attributes` that don't map to a native Shopify field. Metafields can also exist at the **variant** level specifically (not just product), which matters if a Canto custom attribute is genuinely variant-specific (e.g., a per-color hex code) rather than product-wide.

## Canto → Shopify mapping sketch

| Canto concept | Shopify target |
|---|---|
| `products.name` / core fields | Title, Body (description) |
| `product_custom_attributes` (product-level) | Metafields (product) or native fields (Vendor, Product Type, Tags) where they map cleanly |
| `dimensions` + `options` | Option1/2/3 name+value |
| `variants` | Shopify variants (SKU, price, inventory) |
| `product_custom_attributes` (variant-level, if modeled that way) | Metafields (variant) |
| assets attached to product/variant | Image Src pointing at Media Publisher (MDC) rendition URLs |
| `product_categories` | Shopify collections (manual or automated) — not a 1:1 API field, usually a separate assignment step |

## Known quirks / things to ask about

- Shopify has no hard "required fields" enforcement beyond Title on the storefront-facing side, but bulk import/API creation commonly fails silently or partially without Handle, Title, and at least one variant with SKU + Price — confirm the customer's error-handling expectations for partial-failure rows.
- Multi-currency / multi-market storefronts (Shopify Markets) may need locale- or market-specific pricing and content that a single Canto product record doesn't naturally carry — flag this in discovery if the customer sells in multiple regions/currencies.
- SKU uniqueness is enforced within a shop; if the customer's Canto `products` unique identifier isn't already SKU-shaped, decide early what the linking key will be (see `references/canto-pim-api.md` use case #3).
