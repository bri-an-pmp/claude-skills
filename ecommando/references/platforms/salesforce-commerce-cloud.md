# Salesforce Commerce Cloud (B2C/B2B) — metadata model & mapping notes

## Core model

SFCC's Product and Catalog data model is, structurally, the closest of the ten to Canto's own: **Attribute Definitions** are organized into **Attribute Groups/Sets**, assigned to **Product Classifications**, and products are assigned to **Product Categories** within a **Product Catalog** (a store is associated with one catalog; a catalog can serve multiple stores). This near 1:1 structural match with Canto's `product_types` + `product_attribute_groups` + `product_custom_attributes` + `product_categories` model usually makes SFCC one of the more straightforward mappings, once naming is reconciled.

## Canto → SFCC mapping sketch

| Canto concept | SFCC target |
|---|---|
| `product_types` | Product Classification |
| `product_attribute_groups` | Attribute Group/Set |
| `product_custom_attributes` | Attribute Definition (with type, label, input method, storefront/search/filter usage flags — SFCC attribute metadata is itself rich, mirror that richness rather than flattening to plain text) |
| `dimensions`/`options` | Variation attributes / Product Attribute Item (picklist) |
| `product_categories` | Product Category, within the target Product Catalog |
| assets | Product images, via Media Publisher (MDC) URLs referenced in SFCC's image groups/view types |

## Known quirks / things to ask about

- SFCC attribute metadata carries its own behavior flags (searchable, filterable, storefront-visible, refinable) — a straight value copy from Canto loses this; confirm with the customer's SFCC team what each mapped attribute should do on the storefront, not just what value it should hold.
- Multi-catalog setups (different catalogs per brand/region under one SFCC instance) mean a single Canto product may need to land in more than one catalog with different category assignments — check this in discovery, it changes the shape of the channel template significantly.
- If the customer is also using Salesforce Data Cloud, there's a separate Commerce-to-Data-Cloud mapping layer (Data Model Objects) that's distinct from the storefront catalog model — don't conflate the two when scoping.
