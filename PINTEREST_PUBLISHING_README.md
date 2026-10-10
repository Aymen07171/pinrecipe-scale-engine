# Pinterest Recipe Pin Publisher & Bulk CSV Fallback Guide

This guide explains how to configure and run the **Pinterest Automatic Publisher & Bulk CSV Fallback Engine** for [`foodsprepared.wasmer.app`](https://foodsprepared.wasmer.app/).

---

## 1. Overview & Architecture

The publishing engine (`scripts/pinterest_publisher_and_csv_export.mjs` and the Express API routes in `server.ts`) implements a resilient **two-tier workflow**:

1. **Pre-Flight Validation & Sanitization**:
   - **Media Verification**: Performs live HTTP `HEAD`/`GET` checks on every recipe's `Media URL` to verify it returns `HTTP 200 OK` and a valid `image/*` or `video/*` `Content-Type`.
   - **Character Limit Enforcement**:
     - `Title`: Enforces **$\le 100$ characters** (truncates cleanly at word boundaries with `…` if exceeded).
     - `Description`: Enforces **$\le 500$ characters** (truncates cleanly at word boundaries with `…` if exceeded).
   - **CSV Injection & API Sanitization**: Strips control characters (`\r`, `\n`, `\t`), neutralizes spreadsheet formula prefixes (`=`, `+`, `-`, `@` per CWE-1236), and escapes quotes/commas per RFC 4180.

2. **Tier 1 — Automatic Publishing via Pinterest API v5**:
   - Authenticates via OAuth 2.0 Bearer token (`PINTEREST_ACCESS_TOKEN`) or automatically exchanges `PINTEREST_REFRESH_TOKEN` (`POST https://api.pinterest.com/v5/oauth/token`) when expired.
   - Resolves or creates the target Pinterest Board and optional Board Section.
   - Publishes each recipe to `POST https://api.pinterest.com/v5/pins` with `title`, `description`, `link` (live recipe URL), `alt_text`, `board_id`, `board_section_id`, and `media_source: { source_type: 'image_url', url }`.
   - Retries transient errors (`HTTP 429` rate limit, `5xx` server errors, or network timeouts) up to **3 times with exponential backoff** (`1s` $\rightarrow$ `2s` $\rightarrow$ `4s`).

3. **Tier 2 — Bulk CSV Fallback (Always Generated)**:
   - Whenever OAuth credentials are not configured—or if any pin fails to publish via the API—the engine generates two UTF-8 CSV files ready for immediate upload or audit:
     - **[`output/pinterest_bulk_upload_template.csv`](./output/pinterest_bulk_upload_template.csv)**: Matches your exact 8-column Pinterest bulk upload template (`Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords`).
     - **[`output/pinterest_bulk_audit_extended.csv`](./output/pinterest_bulk_audit_extended.csv)**: Extended 12-column audit CSV (`Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords,Alt text,Section,Truncated text,Validation errors`) showing any truncated characters and validation messages.

---

## 2. How to Configure Pinterest API Credentials

### Step 1: Create a Pinterest Developer App
1. Go to the [Pinterest Developers Portal](https://developers.pinterest.com/apps/) and log in with your **Pinterest Business** account.
2. Click **Connect app** and request the following OAuth scopes:
   - `boards:read`
   - `boards:write`
   - `pins:read`
   - `pins:write`
3. Copy your **App ID** and **App Secret**, and generate an OAuth **Access Token** (and optional **Refresh Token**).

### Step 2: Add Credentials to `.env` (or Enter in the UI)
Add the following variables to your `.env` file in the project root:

```env
# Pinterest API v5 OAuth 2.0 Credentials
PINTEREST_ACCESS_TOKEN="pina_YOUR_OAUTH_ACCESS_TOKEN"
PINTEREST_REFRESH_TOKEN="pinr_YOUR_OAUTH_REFRESH_TOKEN"
PINTEREST_APP_ID="YOUR_APP_ID"
PINTEREST_APP_SECRET="YOUR_APP_SECRET"

# Optional: Default Board ID if you want all pins routed to a single board ID
PINTEREST_BOARD_ID=""
```

> **Note:** You can also paste these credentials directly into the **Pinterest Auto-Publisher & CSV Engine** tab inside the web dashboard without restarting the server.

---

## 3. Where to Upload Images for Pinterest

Pinterest requires every `Media URL` (both for the REST API v5 and the Bulk CSV Uploader) to be a **publicly accessible, direct HTTPS link** to an image (`.jpg`, `.jpeg`, `.png`) or video (`.mp4`, `.mov`, `.m4v`).

### Recommended Image Hosting Workflow
1. **WordPress Media Library (Configured by Default)**:
   - All 12 Italian recipe thumbnails are already uploaded and hosted on your live WordPress site under:
     `https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-<id>.jpeg`
   - When adding new recipes in WordPress, upload your vertical pin graphic (recommended **2:3 aspect ratio**, e.g., `1000 × 1500 px`) to **Media $\rightarrow$ Add New** in WordPress Admin (`https://foodsprepared.wasmer.app/wp-admin/upload.php`).
   - Copy the **File URL** from the WordPress Media Library and use it as the `Media URL`.
2. **Thumbnail Column Rule**:
   - For **image pins** (`.jpeg` / `.png`), leave the `Thumbnail` column **empty** (`""`).
   - Only populate the `Thumbnail` column with a `.jpg`/`.png` URL when `Media URL` points to a **video** file (`.mp4`).

---

## 4. How to Run the Publisher & Bulk Export

### Option A: Run via Command Line (CLI)
From the project root directory, run:

```bash
node scripts/pinterest_publisher_and_csv_export.mjs
```

This command will:
1. Load the 12 published WordPress recipes from `output/published_wordpress_12_articles.json`.
2. Verify all 12 image URLs via live HTTP `HEAD` requests (`HTTP 200 OK`, `image/jpeg`).
3. Enforce the $\le 100$ char title limit and $\le 500$ char description limit.
4. Attempt automatic Pinterest API v5 publishing if `PINTEREST_ACCESS_TOKEN` or `PINTEREST_REFRESH_TOKEN` is set.
5. Write the output files to `output/`:
   - `output/pinterest_bulk_upload_template.csv` (8-column template for Pinterest upload)
   - `output/pinterest_bulk_audit_extended.csv` (12-column audit report with `Alt text`, `Section`, `Truncated text`, and `Validation errors`)
   - `output/pinterest_publish_summary_report.json` (structured JSON summary)
   - `output/pinterest_publish_log.txt` (timestamped execution log)

### Option B: Run via the Web Application Dashboard
1. Start the full-stack server:
   ```bash
   npm run dev
   ```
2. Open the dashboard in your browser and navigate to **Pinterest Scheduler** in the left sidebar.
3. Click **Run Auto-Publish / Generate CSV** to execute live validation, API publishing, and CSV generation.
4. Use the download buttons at the top right to download:
   - **Download Pinterest CSV (8-Col Template)** (`/api/pinterest/download-csv`)
   - **Audit CSV (Truncated & Errors)** (`/api/pinterest/download-audit-csv`)
   - **Execution Log** (`/api/pinterest/download-log`)

---

## 5. How to Import the CSV into Pinterest (Bulk Create Pins)

If you are using the CSV fallback (`output/pinterest_bulk_upload_template.csv`), follow these steps to bulk-schedule up to 200 recipe pins at once in Pinterest:

1. Log in to your **Pinterest Business** account at [pinterest.com](https://www.pinterest.com/).
2. Click the **Menu** icon (top-left) or your profile chevron (top-right) and go to **Settings**.
3. In the left sidebar menu, select **Bulk create Pins** (or visit `https://www.pinterest.com/settings/bulk-create-pins`).
4. Click **Upload CSV** and select:
   ```text
   output/pinterest_bulk_upload_template.csv
   ```
5. Pinterest will validate the 8 columns (`Title`, `Media URL`, `Pinterest board`, `Thumbnail`, `Description`, `Link`, `Publish date`, `Keywords`), create any missing boards automatically, and schedule/publish all 12 Italian recipe pins with their destination links pointing to `https://foodsprepared.wasmer.app/<recipe-slug>/`.
