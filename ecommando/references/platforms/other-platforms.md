# Other platforms — SAP Commerce Cloud (Hybris), Shopware, PrestaShop, Wix

Lighter-weight notes for platforms that come up less often than the six covered in their own files. If a deal or ticket centers on one of these, do a fresh web search for current specifics before finalizing a mapping — these get less day-to-day traffic in most Canto SE work, so the details are more likely to have shifted since this was written.

## SAP Commerce Cloud (Hybris)

Product identified by `Code` within a `Catalog Version` (staged vs. online). Classification system (via SAP's Product Content Management, often GS1/ETIM-aligned in manufacturing/industrial implementations) governs custom attributes, closely paralleling Canto's `product_types` + `product_custom_attributes`. Media references point to managed media items. Enterprise SAP shops often already run a separate PIM (SAP's own or a third party) in front of Hybris — clarify in discovery whether Canto is meant to be the system of record for product data or purely the asset/DAM layer feeding an existing PIM, since that changes the integration shape substantially (asset-only feed vs. full metadata sync).

## Shopware

Product Number, Name, Price, Tax rate, Stock are core. Variant/option modeling uses **Properties** (option groups), directly analogous to Canto `dimensions`/`options`. Shopware 6's API is REST/GraphQL-based with a flexible custom-field system (Custom Field Sets) similar in spirit to WooCommerce meta or BigCommerce Custom Fields — flat key/value, grouped into named sets.

## PrestaShop

Reference (SKU-equivalent), Name, Price, Category are core. Variant modeling is via **Combinations** (attribute/value pairs), analogous to Canto `dimensions`/`options`. PrestaShop is more common in EU-based catalogs than the US — worth checking locale/multi-language requirements early, since PrestaShop's multi-language product fields (name, description, etc. per language) don't have a direct single-value Canto equivalent unless the customer's Canto attributes are already modeled per-locale.

## Wix Stores

Simpler schema than the others: Name, SKU, Price, Product Options, Media are the core fields, with fewer mandatory fields overall and a smaller customization surface than platforms built for larger catalogs. Good candidate for a lighter-weight mapping and channel template; usually not worth over-engineering the mapping design for a Wix target the way you would for Amazon or SFCC.
