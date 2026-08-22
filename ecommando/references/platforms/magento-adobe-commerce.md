# Adobe Commerce / Magento — metadata model & mapping notes

## Core model: Attribute Sets

Magento's only truly *required* field on a product entity is **SKU**. Everything else the storefront needs (Name, Price, Description, images, etc.) is technically optional at the platform level but effectively required by any real catalog — enforced instead through **Attribute Sets**, which determine which attributes appear on a given product type's edit form and which are usable as configurable-product variation axes.

This is a close structural match to Canto: Magento Attribute Set ≈ Canto `product_type` (governs which attributes apply), Magento Attribute ≈ Canto `product_custom_attribute`, Magento configurable-product variation axis ≈ Canto `dimension`.

## Key fields

- Name, Price, Visibility (catalog/search/both/none), SKU, Attribute Set assignment
- Meta Title / Meta Description (150–160 char guidance for meta description) for SEO
- Base image relative path + image label/alt text
- Configurable products: parent product + child simple products, linked via configurable attributes (the variation axes)

## Canto → Magento/Adobe Commerce mapping sketch

| Canto concept | Magento/Adobe Commerce target |
|---|---|
| `product_types` | Attribute Set |
| `product_custom_attributes` | Custom product attributes (create via Admin or `addAttribute` API with entity type, attribute code, properties) |
| `dimensions`/`options` | Configurable product variation attributes |
| `products`/`variants` | Parent (configurable) product / child (simple) products |
| assets | Base image + gallery images, via Media Publisher (MDC) URLs or synced copies depending on customer's CDN strategy |
| `product_categories` | Magento category tree (separate assignment, supports multiple categories per product) |

## Known quirks / things to ask about

- New custom attributes must be added to the relevant Attribute Set(s) before they're visible/usable on product forms — a common go-live gap is a Canto custom attribute existing but never attached to the Attribute Set the customer's SKUs use.
- Magento distinguishes **global**, **website**, and **store view** attribute scopes — relevant for multi-site/multi-locale Adobe Commerce instances, and something a single flat Canto attribute may not natively express. Ask about this if the customer runs multiple websites/store views from one instance.
- Adobe Commerce (SaaS) has its own newer data-export/extensibility model distinct from on-prem/PaaS Magento — confirm which flavor the customer runs, since API mechanics differ.
