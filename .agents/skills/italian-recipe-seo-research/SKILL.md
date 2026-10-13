---
name: italian-recipe-seo-research
description: >-
  AI-Powered Italian Recipe SEO Research, Article Generation, WordPress Auto-Publishing,
  Printable PDF Card Creation, and Pinterest Bulk Excel (.xlsx) & CSV Export Engine. Use
  this skill whenever the user provides a recipe idea and niche, or asks to research,
  generate, publish, and export Pinterest Excel/CSV files for recipe articles on
  foodsprepared.wasmer.app. Trigger with /italian-recipe-seo-research or
  /pinrecipe-wp-pinterest-pipeline.
---

# Italian Recipe SEO Research, WordPress Publisher & Pinterest Excel/CSV Skill

Use this skill whenever the user provides **an article idea and niche** (or asks for new Italian recipe articles) and wants you to handle the entire pipeline:
1. **Research & Expand Ideas into Full Recipe Payloads** (`scripts/new_10_seo_italian_recipes_data.mjs`)
2. **Generate/Upload Dish Photography & Printable A4 PDF Cards** (`output/pdfs/<slug>.pdf`)
3. **Publish Clean Nourish-Your-Glow Style Articles to WordPress** (`scripts/publish_10_seo_excel_articles_wp.mjs` $\rightarrow$ `https://foodsprepared.wasmer.app/<slug>/`)
4. **Update the Live Carousel Homepage (`/home/`) & Category Hub (`/italian-recipes/`)** (`scripts/publish_carousel_homepage_wp.mjs`)
5. **Validate Images & Generate Pinterest-Formatted Excel (`.xlsx`) & CSV (`.csv`) Files** (`scripts/pinterest_publisher_and_csv_export.mjs` & `scripts/export_pinterest_excel.mjs`)

---

## 1. WordPress Category Framework (`https://foodsprepared.wasmer.app`)

Map every recipe article to its corresponding category (or create a new category if the user provides a new niche):
1. **Budget-Friendly Italian (`budget-friendly-italian`)**
2. **Quick Italian Dinners (`quick-italian-dinners`)**
3. **Pasta, Risotto & Gnocchi (`pasta-risotto-gnocchi`)**
4. **Regional Italian Recipes (`regional-italian-recipes`)**
5. **Soups, Beans & Vegetables (`soups-beans-vegetables`)**
6. **Protein-Rich Italian Meals (`protein-rich-italian-meals`)**

---

## 2. End-to-End Execution Runbook (From Idea + Niche $\rightarrow$ Live WP + Pinterest Excel/CSV)

### Step 1: Add the Recipe Payloads & Dish Photos
- Add the new recipe objects to `scripts/new_10_seo_italian_recipes_data.mjs` (or create a batch script modeled on `scripts/publish_10_seo_excel_articles_wp.mjs`).
- Place each recipe's high-resolution JPEG (`1200x900`) in `src/assets/images/`.

### Step 2: Publish Articles, Images & Printable PDFs to WordPress
Run the WordPress AutoSync publisher:
```powershell
cd "c:\Users\jacka\Downloads\pinrecipe-scale-engine (1)"
node scripts/publish_10_seo_excel_articles_wp.mjs
```
- **What it does**:
  - Generates a 1-page printable A4 PDF recipe card (`output/pdfs/<slug>.pdf`) and hosts it publicly.
  - Uploads the featured image to WordPress Media Library (`https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-*.jpeg`).
  - Publishes the clean Nourish-Your-Glow editorial HTML article (with 3 step photos, Jump to Recipe & Download PDF buttons, and the bottom `#recipe` card—omitting the raw `recipe` object from the AutoSync payload so raw JSON-LD text is never printed).

### Step 3: Update the WordPress Carousel Homepage (`/home/`) & Hub (`/italian-recipes/`)
```powershell
node scripts/publish_carousel_homepage_wp.mjs
```

### Step 4: Generate Pinterest Excel (`.xlsx`) & CSV (`.csv`) Bulk Upload Files
```powershell
node scripts/pinterest_publisher_and_csv_export.mjs
```
- **What it produces in `output/`**:
  - `output/pinterest_bulk_upload_template.xlsx` & `.csv` — Strict 8-column Pinterest format (`Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords`) with `Title` $\le 100$ chars, `Description` $\le 500$ chars, and verified HTTP `200 OK` WordPress image URLs.
  - `output/pinterest_new_10_seo_recipes_template.xlsx` & `.csv` — Dedicated Excel & CSV files for the latest batch of articles.
  - `output/pinterest_bulk_audit_extended.xlsx` & `.csv` — Extended 12-column audit table (`Alt text`, `Section`, `Truncated text`, `Validation errors`).
