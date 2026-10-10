# Automated Design Generation, Quota Failover, and Excel Cataloging Engine

An end-to-end Python automation framework integrating **Chrome Selenium** web automation, **CodeKraft API** (with automatic quota failover & high-res synthesis), structured multi-directory asset storage, and rich **Excel (`.xlsx`) catalog generation**.

---

## 1. System Architecture

```mermaid
flowchart TD
    A[Start Batch Job] --> B[Load Design Presets & Parameters]
    B --> C{Execution Mode}
    
    C -->|Auto / Selenium| D[Launch Chrome Selenium Driver]
    D --> E[Input Prompt to Web App UI]
    E --> F{Quota Restriction / 429 Detected?}
    
    F -->|Yes: Quota Exceeded| G[Catch QuotaLimitException]
    G --> H[Seamless Failover to CodeKraft API]
    
    F -->|No: Success| I[Download Canvas / Image Asset via Selenium]
    
    C -->|API Direct| H
    
    H --> J{CodeKraft API Quota Status}
    J -->|Valid Key & Credits| K[Generate via CodeKraft / Gemini Image Model]
    J -->|Quota Limit / Error| L[High-Res Procedural Synthesis Engine]
    
    I --> M[Standardize Asset (9:16, 2400x4800 px)]
    K --> M
    L --> M
    
    M --> N[Save in Structured Directory:\noutput_designs/DSGN-YYYY-XXXX/]
    N --> O[Generate Metadata & 13 SEO Tags]
    O --> P[Calculate Pricing:\nBase Charge $10.50 | Retail $29.99 | Profit $19.49]
    P --> Q[Compile Master_Catalog & Category_Summary in Excel]
    Q --> R[Export Design_Assets_Catalog.xlsx & batch_manifest.json]
```

---

## 2. Deliverables & Directory Structure

```
pinrecipe-scale-engine (1)/
├── automation/
│   ├── config.py                 # Core presets, pricing models, constants, and paths
│   ├── selenium_bot.py           # Chrome Selenium manager, UI interaction, DOM quota detector
│   ├── codekraft_client.py       # CodeKraft/Gemini API client, quota handler & synthesis
│   ├── excel_manager.py          # OpenPyXL master catalog & summary sheet compiler
│   └── design_engine.py          # Orchestration engine tying UI, API, storage, and Excel
├── run_design_automation.py       # Convenient root CLI execution script
├── output_designs/               # Organized asset storage
│   ├── Design_Assets_Catalog.xlsx # Master Excel workbook
│   ├── batch_manifest.json       # JSON execution manifest
│   ├── DSGN-2026-0001/           # Isolated design folder
│   │   ├── DSGN-2026-0001_artwork.png  (2400x4800, 300 DPI, 9:16)
│   │   ├── metadata.json
│   │   └── prompt.txt
│   ├── DSGN-2026-0002/
│   ├── DSGN-2026-0003/
│   ├── DSGN-2026-0004/
│   └── DSGN-2026-0005/
```

---

## 3. Quota Management & CodeKraft API Seamless Switching

### How Quota Detection Works
1. **Selenium DOM Inspection:** `SeleniumDesignBot` monitors the web interface for standard rate-limit signals, HTTP 429 indicators, `quota exceeded` toasts, and disabled submit buttons.
2. **QuotaLimitException:** When detected, the bot raises `QuotaLimitException` immediately without crashing.
3. **Automatic Failover:** In `--mode auto`, `MasterDesignAutomationEngine` catches the exception and immediately invokes `CodeKraftClient.generate_design_artwork()`.
4. **CodeKraft Quota Safeguard:** If CodeKraft / Gemini API also encounters quota limits (`HTTP 429`, resource exhaustion), it falls back to the high-resolution procedural synthesis engine (Pillow) with matching category color palettes, maintaining unblocked batch runs.

---

## 4. Excel Workbook (`Design_Assets_Catalog.xlsx`) Layout

### Sheet 1: `Master_Catalog`
- **Design ID:** `DSGN-2026-XXXX`
- **Status:** Production Ready
- **Product Title:** Category-optimized commercial title (<135 chars)
- **Category:** Japanese Dark Fantasy, Gothic Stained Glass, Cyberpunk Streetwear, etc.
- **Provider:** Selenium / CodeKraft API / Fallback
- **Aspect Ratio:** 9:16
- **Resolution:** 2400x4800 px (300 DPI)
- **Base Charge ($):** Formatted as `$10.50`
- **Retail Price ($):** Formatted as `$29.99`
- **Projected Profit ($):** Dynamic Excel formula `=I{row}-H{row}` formatted as `$19.49`
- **Tags (13 Etsy SEO tags):** Comma-separated, verified character constraints
- **Description:** Complete product copy with specifications & care instructions
- **Prompt:** Full generation prompt
- **Asset Filename:** Clickable reference to the local `.png` file
- **Local File Path:** Absolute filesystem path
- **Timestamp:** YYYY-MM-DD HH:MM:SS

### Sheet 2: `Category_Summary`
- Aggregates units, total charges, total retail revenue, and projected margins per category.
- Bottom summary row contains dynamic Excel `=SUM(...)` and `=AVERAGE(...)` formulas.

---

## 5. How to Run the Automation

### Prerequisites
Run with Python 3.10+ (Dependencies: `selenium`, `openpyxl`, `pillow`, `requests`):
```bash
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" -m pip install selenium openpyxl pillow requests
```

### Basic Commands

#### 1. Automatic Hybrid Mode (Selenium with CodeKraft API Failover)
```bash
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" run_design_automation.py --mode auto --count 5
```

#### 2. CodeKraft API Direct Mode
```bash
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" run_design_automation.py --mode api --count 5
```

#### 3. Category Filtered Run
```bash
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" run_design_automation.py --category "Cyberpunk" --count 1
```

#### 4. Headless vs. Visible Browser
```bash
# Run headless (default):
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" run_design_automation.py --headless

# Run with visible Chrome window for visual debugging:
& "C:\Users\jacka\AppData\Local\Python\bin\python3.exe" run_design_automation.py --headless=false
```

---

## 6. Extending Categories & Presets
To add new design types or categories, edit [`automation/config.py`](automation/config.py):
```python
DESIGN_PRESETS.append({
    "category": "Retro Synthwave",
    "title_prefix": "Neon Sunset Grid Highway",
    "prompt": "Full-bleed 9:16 vertical phone case artwork. Retro 80s wireframe grid road leading toward a glowing chrome magenta sun...",
    "tags": ["synthwave case", "retro 80s cover", "outrun artwork", "neon grid case", ...]
})
```
The engine will automatically generate assets, calculate margins, and append them into the master Excel catalog.
