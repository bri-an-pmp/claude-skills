# BigCommerce — metadata model & mapping notes

## Core fields (Catalog API v3, `/v3/catalog/products`)

Name, Type (physical/digital), Weight, Price are the practical minimums for a usable product via the Catalog API. `categories` is an array of existing category IDs; omitting it creates an uncategorized product rather than an error, so this is a silent-failure risk worth calling out — a mapping that "succeeds" but leaves products uncategorized on the storefront.

## Custom Fields

BigCommerce's extensibility mechanism is **Custom Fields**: simple name/value pairs, both required, each name+value pair unique within a product, capped at 200 custom fields per product. This is the landing spot for Canto `product_custom_attributes` without a native BigCommerce equivalent. Because custom fields are flat name/value (no typing, no grouping), complex Canto attribute groups may need flattening — decide the naming convention up front (e.g., `groupname_attributename`) so mappings stay legible.

## Canto → BigCommerce mapping sketch

| Canto concept | BigCommerce target |
|---|---|
| `products` core fields | Name, Type, Weight |
| `product_custom_attributes` | Custom Fields (flattened name/value) |
| `dimensions`/`options` | BigCommerce product Options/Variants |
| `product_categories` | `categories` array (category IDs) — must be pre-created in BigCommerce and mapped, not just passed as names |
| assets | Product images via BigCommerce's image API, sourced from Media Publisher (MDC) URLs |

## Known quirks / things to ask about

- Category IDs, not names, are required by the API — any mapping needs a lookup/creation step from Canto category names to BigCommerce category IDs, not a direct string pass-through.
- The 200-custom-field cap per product is rarely hit but worth checking against catalogs with very rich attribute sets before committing to a "map everything to custom fields" approach.
