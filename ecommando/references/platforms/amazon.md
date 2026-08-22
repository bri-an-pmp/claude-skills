# Amazon Seller Central — metadata model & mapping notes

This is the hardest platform of the ten to map cleanly, because mandatory attributes vary **by product type** (browse node), not just by marketplace. Don't present a single fixed field list to a customer as "the Amazon requirements" — it's per-category.

## Core concepts

- **Identifiers**: ASIN (Amazon-assigned) and/or a manufacturer-supplied GTIN/UPC/EAN, tied to a Brand.
- **Product Type**: determines which JSON Schema of attributes applies. Amazon's **Product Type Definitions API** returns the JSON Schema (required + optional attributes, allowed values, constraints) for a given product type and marketplace — this is the authoritative, current source, not a static doc, because Amazon revises required attributes over time (200+ new mandatory attributes were added across product types in a recent revision cycle).
- **Common fields across most product types**: Title, Bullet Points (feature bullets), Description, Brand, Main Image + additional images, Item dimensions/weight, Category-specific attributes (varies).

## API / feed mechanics — this changed recently, don't rely on old docs

As of mid-2025, Amazon's Selling Partner API (SP-API) **retired legacy XML and flat-file listing feeds** (including pricing, inventory, relationships, and images). Current path: **Listings Items API** and/or the **JSON_LISTINGS_FEED** format, both structured around the Product Type Definitions API's schemas. Field names and structure in the new JSON-based approach differ from the old XML/flat-file naming — if a customer or a Canto teammate references an old flat-file column name, map it forward to the JSON schema field, don't assume it still applies.

## Canto → Amazon mapping approach

Because requirements are per-product-type, the practical approach is:

1. Establish the customer's Amazon **product type(s)** in scope (often maps reasonably well to Canto `product_types`, though not automatically 1:1 — Canto's types are usually coarser).
2. Pull (or have the customer pull) the current required-attribute schema for each in-scope product type via the Product Type Definitions API.
3. For each required attribute, identify the Canto source: native field, `product_custom_attributes`, a `dimension`/`option`, or "not currently captured" (gap to flag).
4. Encode the result as a Canto `product_channel_template` per product type (or per product-type group if several share a schema) rather than one template for "Amazon" generally.

| Canto concept | Amazon target |
|---|---|
| unique identifier (SKU/article number) | Seller SKU, linked to ASIN |
| `product_custom_attributes` (Brand, GTIN, etc.) | Required identity attributes |
| `dimensions`/`options` | Variation attributes (e.g. Color/Size) within a "parent-child" listing relationship |
| assets | Main + additional images, via Media Publisher (MDC) rendition URLs meeting Amazon's image requirements (pure white background for main image, minimum pixel dimensions, etc. — verify current specs, Amazon enforces these programmatically) |
| `product_categories` | Browse node / product type assignment |

## Canto's own Amazon integration — current limits

Per canto.com (verify currency before quoting to a customer): the Canto-Amazon integration is explicitly **North America only** today, and is described as "future-ready" for additional capability in upcoming releases, with AI Bulk Update Assistant for prompt-driven multi-attribute updates. If a customer needs EU/other-marketplace Amazon sync now, that's a gap to flag in discovery, not something to promise.

## Known quirks / things to ask about

- Image requirements are strict and enforced (background, resolution, no watermarks/promotional text on main image) — confirm Media Publisher renditions are configured to meet these before go-live, not after the first rejected listing.
- Variation relationships (parent/child listings) need a "parentage" concept that Canto's `dimensions`/`options` can represent, but the customer's attribute-group setup needs to actually be structured that way — check, don't assume.
- Compliance/safety attributes (batteries, hazmat, age restrictions) are category-specific and easy to miss in initial scoping — ask explicitly if the catalog includes any regulated categories.
