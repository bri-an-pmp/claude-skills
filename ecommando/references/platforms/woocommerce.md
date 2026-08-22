# WooCommerce — metadata model & mapping notes

## Core fields

Name, Type (simple/variable/grouped/external), Regular Price, SKU, Categories. Built on WordPress, so under the hood everything ultimately rides on WordPress custom fields/post meta — this makes WooCommerce very extensible but also means "required" is a soft, store-configuration-dependent concept rather than a hard platform rule.

## REST API and metadata

WooCommerce's REST API (fully integrated with the WP REST API since 2.6+) represents custom/extended data as a `meta_data` array of `{id, key, value}` objects on the product resource, and separately on variation resources (metadata on variations has been supported since REST API v0.7.0+). Store-specific schema extensions are typically done via the `woocommerce_rest_product_schema` filter on the store's own backend — meaning two WooCommerce stores can have meaningfully different product schemas even on the same WooCommerce version, more so than most of the other platforms here. Always confirm the specific store's schema rather than assuming a standard shape.

## Canto → WooCommerce mapping sketch

| Canto concept | WooCommerce target |
|---|---|
| `products` core fields | Name, Type, Regular/Sale Price |
| `product_custom_attributes` | `meta_data` key/value entries (product or variation level) |
| `dimensions`/`options` | WooCommerce Attributes (used to generate Variations) |
| `variants` | Variations (for variable products), each with its own SKU/price/stock |
| `product_categories` | WooCommerce Categories (and Tags, if used for a secondary taxonomy) |
| assets | Featured image + gallery, via Media Publisher (MDC) URLs |

## Known quirks / things to ask about

- Because schema extensions are store-specific (via a WordPress filter, not a platform-wide standard), always ask to see the actual product REST API response from the customer's store before finalizing a mapping — don't assume a generic WooCommerce shape.
- Plugin ecosystem matters: many WooCommerce stores rely on third-party plugins (e.g. for advanced custom fields, product bundles) that add their own metadata conventions outside WooCommerce core — ask what's installed before scoping.
