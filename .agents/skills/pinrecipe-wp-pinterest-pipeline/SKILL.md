---
name: pinrecipe-wp-pinterest-pipeline
description: >-
  Complete end-to-end Recipe Article Generation, WordPress Auto-Publishing, Printable PDF
  Card Creation, and Pinterest Bulk Excel (.xlsx) & CSV Export skill. Use this skill
  whenever the user provides a recipe idea, topic list, or culinary niche and wants you
  to automatically generate the complete recipe articles, upload dish photography to
  WordPress, publish the articles to foodsprepared.wasmer.app, update the carousel
  homepage, and export Pinterest-formatted Excel (.xlsx) and CSV files. Trigger with
  /pinrecipe-wp-pinterest-pipeline or /italian-recipe-seo-research.
---

# PinRecipe End-to-End WordPress & Pinterest Automation Skill (`/pinrecipe-wp-pinterest-pipeline`)

When the user provides **an article idea (or list of ideas) and a niche/category**, execute the following **6-Stage End-to-End Pipeline** automatically without requiring manual intervention for intermediate steps.

---

## Stage 1: Recipe Payload Synthesis from Idea & Niche

For each recipe idea provided by the user, construct a complete structured recipe object (following the schema in `scripts/new_10_seo_italian_recipes_data.mjs`):
- **Core Metadata**: `priority`, `id` (`rec-it-prio-<N>`), `topic`, `title` (catchy SEO H1), `slug`, `italianCategory` (mapped to the user's niche or one of the 6 core categories: `Budget-Friendly Italian`, `Quick Italian Dinners`, `Pasta, Risotto & Gnocchi`, `Regional Italian Recipes`, `Soups, Beans & Vegetables`, `Protein-Rich Italian Meals`), `prepTime`, `cookTime`, `totalTime`, `servings`, `calories`, `macros` (`protein`, `carbs`, `fat`, `fiber`), `metaDescription`, and `focusKeyword`.
- **Editorial Sections (Nourish-Your-Glow Clean Format)**:
  1. `introParagraphs`: 3 warm, engaging paragraphs explaining the dish's regional heritage, culinary science (e.g., starch-water emulsion, off-heat cheese melting), and weeknight accessibility.
  2. `whyLove`: 4 bullet points with `<strong>` lead-ins highlighting speed, cost, or foolproof technique.
  3. `ingredientNotes`: 4–5 bullet points detailing key ingredients and supermarket-friendly substitutions.
  4. `ingredients`: Gram-accurate metric + US imperial measurements (`amount`, `item`, `notes`).
  5. `instructions`: 4–5 chronological steps (`step`, `title`, `text`, `timerMinutes`).
  6. `chefTips`: 3 pro kitchen tips.
  7. `faqs`: 2–3 troubleshooting Q&As answering common home-cook pain points.
  8. `storageTips` & `variations`: Practical make-ahead, reheating, and flavor swap tips.
- **Pinterest Metadata (`pinterestPin`)**:
  - `title` ($\le 100$ characters)
  - `description` ($\le 500$ characters, including 3–4 relevant hashtags)
  - `board` & `section`

---

## Stage 2: High-Resolution Dish Photography & Printable A4 PDF Recipe Cards

1. **Dish Photography**:
   - Save or generate a high-resolution JPEG (`1200x900`) for each recipe in `src/assets/images/`.
   - Upload the image via Pass 1 of `/wp-json/autosync/v1/import` (`featured_image: "data:image/jpeg;base64,..."`) to obtain its permanent WordPress Media Library URL (`https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-*.jpeg`).
2. **Printable 1-Page A4 PDF Recipe Card**:
   - Generate the styled A4 PDF (`buildRecipePdfBuffer(recipe, wpPermalink)`) and save it to `output/pdfs/<slug>.pdf`.
   - Upload the PDF via `uploadPdfToPublicHost` (Catbox / GitHub Pages `output/pdfs/<slug>.pdf`) so visitors have a 1-click **📥 Download Recipe PDF** button.

---

## Stage 3: Clean WordPress Article HTML & AutoSync Publication

1. **Clean Editorial Theme (`buildSimpleNourishStyleArticleHtml`)**:
   - Top cream bar (`#FFF8F2`) with category badge, total time, **📋 Jump to Recipe** (`#227755` emerald pill), and **📥 Download Recipe PDF** (`#D96B43` terracotta pill).
   - 3 warm intro paragraphs $\rightarrow$ Photo 1 $\rightarrow$ *Why You'll Love It* $\rightarrow$ *Ingredient Notes & Details* $\rightarrow$ Photo 2 $\rightarrow$ *Step-by-Step Instructions* $\rightarrow$ Photo 3 $\rightarrow$ *FAQ* $\rightarrow$ *Storage Tips* $\rightarrow$ *Variations*.
   - Bottom `#recipe` card with circular hero photo, `#227755` emerald header, 5-star badge, Download PDF & Pin Recipe buttons, Prep/Cook/Total/Servings/Calories strip, interactive checkbox ingredients, numbered instructions, chef tips, and nutrition bar.
   - **CRITICAL RULE**: When calling `POST https://foodsprepared.wasmer.app/wp-json/autosync/v1/import`, pass the rendered HTML in `content` and **DO NOT** pass a separate `recipe` object in the JSON body (passing `recipe` causes the WordPress plugin to print raw JSON-LD code text at the bottom of the post).
2. **Credentials**:
   - Read `WP_SITE_URL` (`https://foodsprepared.wasmer.app`) and `WP_AUTOSYNC_SECRET` from `.env` (never hardcode secrets in tracked files).
3. **Update Live Carousel Homepage (`/home/`) & Hub (`/italian-recipes/`)**:
   - Append the newly published articles to `output/published_wordpress_12_articles.json` and run:
     ```bash
     node scripts/publish_carousel_homepage_wp.mjs
     ```

---

## Stage 4: Pinterest Validation, API Publishing & Excel (`.xlsx`) / CSV Export

Run the Pinterest Publisher & Excel/CSV Exporter:

```bash
cd "C:\Users\jacka\Downloads\pinrecipe-scale-engine (1)"
node scripts/pinterest_publisher_and_csv_export.mjs
```

This automatically:
1. **Validates Media URLs**: Checks every recipe's WordPress Media Library image URL via HTTP `HEAD`/`GET` to confirm `HTTP 200 OK` and `Content-Type: image/jpeg`.
2. **Enforces Character Limits & Sanitizes**:
   - `Title` $\le 100$ characters (word-boundary truncation).
   - `Description` $\le 500$ characters (word-boundary truncation).
   - Sanitizes against CSV injection (`=`, `+`, `-`, `@`) and escapes quotes/commas per RFC 4180.
3. **Attempts Pinterest API v5 Publishing** (if `PINTEREST_ACCESS_TOKEN` is set in `.env`) with 3x exponential backoff retry, or falls back to bulk file generation.
4. **Generates Both Excel (`.xlsx`) and CSV (`.csv`) Files Matching the Exact 8-Column Pinterest Template**:
   - **Exact 8 Columns**: `Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords`
   - **Excel Workbooks (`.xlsx`)**:
     - `output/pinterest_bulk_upload_template.xlsx` (All published recipes)
     - `output/pinterest_new_10_seo_recipes_template.xlsx` (Latest batch of recipes)
     - `output/pinterest_bulk_audit_extended.xlsx` (12-column audit workbook with `Alt text`, `Section`, `Truncated text`, `Validation errors`)
   - **UTF-8 CSV Files (`.csv`)**:
     - `output/pinterest_bulk_upload_template.csv`
     - `output/pinterest_new_10_seo_recipes_template.csv`
     - `output/pinterest_bulk_audit_extended.csv`
   - **Selenium Bot Ready**: Updates `output/pinterest_publish_summary_report.json` which feeds `pinterest_selenium_bot.py`.

---

## Stage 5: GitHub & GitHub Pages Deployment

After publishing the articles and generating the Pinterest Excel/CSV files, rebuild and deploy the updated web app and static files:

```powershell
cd "C:\Users\jacka\Downloads\pinrecipe-scale-engine (1)"
npm run build
Copy-Item -Path output -Destination dist\output -Recurse -Force
New-Item -Path dist\.nojekyll -ItemType File -Force | Out-Null
git add .agents output scripts src
git commit -m "feat: Publish new recipe articles and Pinterest Excel/CSV exports"
git push origin main
git -C dist add -A
git -C dist commit -m "Deploy updated recipes and Pinterest Excel/CSV exports to GitHub Pages"
git -C dist push -f https://github.com/Aymen07171/pinrecipe-scale-engine.git gh-pages
```
