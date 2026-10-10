#!/usr/bin/env python3
"""
Master Design Automation & Quota Management Engine
Automates the generation, downloading, organizing, and Excel export of design assets.
Seamlessly falls back to CodeKraft API whenever Selenium UI quota restrictions occur.
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from .config import (
    OUTPUT_DIR,
    EXCEL_OUTPUT_PATH,
    DESIGN_PRESETS,
    DEFAULT_WEB_APP_URL,
    HEADLESS_DEFAULT,
    CODEKRAFT_API_KEY
)
from .codekraft_client import CodeKraftClient, CodeKraftApiException
from .selenium_bot import SeleniumDesignBot, QuotaLimitException
from .excel_manager import ExcelCatalogManager


class MasterDesignAutomationEngine:
    """
    Coordinates Selenium web interaction, CodeKraft API quota failover,
    asset file system structuring, and Excel spreadsheet generation.
    """

    def __init__(
        self,
        output_dir: Path = OUTPUT_DIR,
        excel_path: Path = EXCEL_OUTPUT_PATH,
        mode: str = "auto",  # 'auto', 'selenium', 'api'
        web_url: str = DEFAULT_WEB_APP_URL,
        headless: bool = HEADLESS_DEFAULT
    ):
        self.output_dir = Path(output_dir)
        self.excel_path = Path(excel_path)
        self.mode = mode
        self.web_url = web_url
        self.headless = headless

        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.api_client = CodeKraftClient()
        self.excel_manager = ExcelCatalogManager(self.excel_path)
        self.selenium_bot = None

    def run_batch(
        self,
        presets: List[Dict[str, Any]] = DESIGN_PRESETS,
        count: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes generation, downloading, and cataloging for the specified presets.
        """
        targets = presets[:count] if count else presets
        total_items = len(targets)

        print("\n" + "=" * 70)
        print("  AUTOMATED DESIGN GENERATION & QUOTA MANAGEMENT ENGINE")
        print(f"  Target Items: {total_items} | Execution Mode: {self.mode.upper()}")
        print(f"  Output Directory: {self.output_dir}")
        print(f"  Excel Destination: {self.excel_path}")
        print("=" * 70 + "\n")

        processed_records: List[Dict[str, Any]] = []

        # Start Selenium Bot if mode requires it
        if self.mode in ["auto", "selenium"]:
            try:
                self.selenium_bot = SeleniumDesignBot(
                    web_url=self.web_url,
                    headless=self.headless
                )
            except Exception as e:
                print(f"[!] Selenium initialization notice: {e}")
                print("[*] Transitioning default execution mode to direct CodeKraft API engine.")
                self.mode = "api"

        try:
            for idx, item in enumerate(targets, start=1):
                design_id = f"DSGN-{datetime.now().year}-{idx:04d}"
                cat = item.get("category", "General")
                title_prefix = item.get("title_prefix", f"Artisan {cat} Design")
                prompt = item.get("prompt", "")
                tags = item.get("tags", [])

                print(f"[{idx}/{total_items}] Processing: {title_prefix} [{cat}]")

                # Project folder for this design
                design_folder = self.output_dir / design_id
                design_folder.mkdir(parents=True, exist_ok=True)
                image_filename = f"{design_id}_artwork.png"
                image_filepath = design_folder / image_filename

                provider_used = "CodeKraft API"
                generated_successfully = False

                # -------------------------------------------------------------
                # 1. ATTEMPT SELENIUM BROWSER GENERATION (if mode is auto/selenium)
                # -------------------------------------------------------------
                if self.mode in ["auto", "selenium"] and self.selenium_bot:
                    try:
                        print("  [*] Attempting generation via Chrome Selenium Web Automation...")
                        ok, provider_label = self.selenium_bot.generate_and_download(
                            prompt=prompt,
                            output_filepath=image_filepath,
                            category=cat
                        )
                        if ok:
                            provider_used = provider_label
                            generated_successfully = True
                    except QuotaLimitException as quota_err:
                        print(f"  [!] SELENIUM QUOTA/UI NOTICE: {quota_err}")
                        if self.mode == "auto":
                            print("  [FAILOVER] SEAMLESS FAILOVER: Engaging CodeKraft API Backup Engine...")
                            provider_used = "CodeKraft API (Quota Failover)"
                        else:
                            print("  [x] Selenium-only mode active. Skipping item.")
                            continue
                    except Exception as e:
                        print(f"  [!] Selenium interaction error: {e}")
                        if self.mode == "auto":
                            print("  [FAILOVER] SEAMLESS FAILOVER: Engaging CodeKraft API Backup Engine...")
                            provider_used = "CodeKraft API (Failover)"
                        else:
                            continue

                # -------------------------------------------------------------
                # 2. CODEKRAFT API ENGINE (Primary or Fallback)
                # -------------------------------------------------------------
                if not generated_successfully:
                    print(f"  [*] Executing generation with {provider_used}...")
                    try:
                        result = self.api_client.generate_design_artwork(
                            prompt=prompt,
                            output_filepath=image_filepath,
                            category=cat
                        )
                        if result.get("success"):
                            generated_successfully = True
                            if "provider" in result:
                                provider_used = result["provider"]
                    except CodeKraftApiException as api_quota_err:
                        print(f"  [!] CodeKraft API Quota Issue: {api_quota_err}")
                        print("  [FALLBACK] Applying emergency high-res procedural synthesis...")
                        self.api_client._generate_procedural_artwork(
                            image_filepath, cat, prompt, seed=idx * 777
                        )
                        provider_used = "CodeKraft Engine (Synthesized)"
                        generated_successfully = True

                # -------------------------------------------------------------
                # 3. SYNTHESIZE FULL METADATA & ASSET RECORD
                # -------------------------------------------------------------
                metadata = self.api_client.synthesize_metadata(
                    title_prefix=title_prefix,
                    category=cat,
                    prompt=prompt,
                    tags=tags
                )

                record = {
                    "design_id": design_id,
                    "title": metadata["title"],
                    "category": metadata["category"],
                    "description": metadata["description"],
                    "tags": metadata["tags"],
                    "base_charge": metadata["base_charge"],
                    "retail_price": metadata["retail_price"],
                    "profit_margin": metadata["profit_margin"],
                    "aspect_ratio": metadata["aspect_ratio"],
                    "resolution": metadata["resolution"],
                    "prompt": prompt,
                    "image_filename": image_filename,
                    "image_path": str(image_filepath),
                    "provider": provider_used,
                    "status": "Production Ready",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }

                # Save standalone JSON metadata inside the asset folder
                with open(design_folder / "metadata.json", "w", encoding="utf-8") as f:
                    json.dump(record, f, indent=2)

                # Save raw prompt file
                with open(design_folder / "prompt.txt", "w", encoding="utf-8") as f:
                    f.write(prompt)

                processed_records.append(record)
                print(f"  [OK] Complete: {record['title'][:55]}...")
                print(f"      Image Asset: {image_filepath.name} ({metadata['resolution']})")
                print(f"      Retail Price: ${record['retail_price']:.2f} | Net Profit: ${record['profit_margin']:.2f}\n")

                time.sleep(1)

        finally:
            if self.selenium_bot:
                self.selenium_bot.close()

        # ---------------------------------------------------------------------
        # 4. EXPORT MASTER EXCEL CATALOG WORKBOOK
        # ---------------------------------------------------------------------
        print("[*] Compiling Master Design Catalog Excel Spreadsheet...")
        self.excel_manager.write_catalog(processed_records)

        # Save batch summary manifest
        manifest_path = self.output_dir / "batch_manifest.json"
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump({
                "generated_at": datetime.now().isoformat(),
                "total_designs": len(processed_records),
                "excel_catalog": str(self.excel_path),
                "designs": processed_records
            }, f, indent=2)

        print("\n" + "=" * 70)
        print("  WORKFLOW BATCH EXECUTION COMPLETE!")
        print(f"  Total Designs Created & Cataloged: {len(processed_records)}")
        print(f"  Master Excel File: {self.excel_path}")
        print(f"  Organized Assets Root: {self.output_dir}")
        print("=" * 70 + "\n")

        return processed_records


def main():
    parser = argparse.ArgumentParser(description="Automate Design Generation, Quota Failover, and Excel Cataloging.")
    parser.add_argument("--mode", choices=["auto", "selenium", "api"], default="auto",
                        help="Execution mode: auto (Selenium with API failover), selenium, or api direct.")
    parser.add_argument("--count", type=int, default=None,
                        help="Number of designs to generate from presets.")
    parser.add_argument("--category", type=str, default=None,
                        help="Filter presets by category name.")
    parser.add_argument("--web-url", type=str, default=DEFAULT_WEB_APP_URL,
                        help="Web application URL for Selenium automation.")
    parser.add_argument("--headless", action="store_true", default=HEADLESS_DEFAULT,
                        help="Run Chrome Selenium in headless mode.")
    parser.add_argument("--output-dir", type=str, default=str(OUTPUT_DIR),
                        help="Target output directory for designs.")
    parser.add_argument("--excel", type=str, default=str(EXCEL_OUTPUT_PATH),
                        help="Target path for the compiled Excel file.")

    args = parser.parse_args()

    presets = DESIGN_PRESETS
    if args.category:
        presets = [p for p in DESIGN_PRESETS if args.category.lower() in p["category"].lower()]
        if not presets:
            print(f"[!] No presets found matching category: {args.category}. Using all presets.")
            presets = DESIGN_PRESETS

    engine = MasterDesignAutomationEngine(
        output_dir=Path(args.output_dir),
        excel_path=Path(args.excel),
        mode=args.mode,
        web_url=args.web_url,
        headless=args.headless
    )

    engine.run_batch(presets=presets, count=args.count)


if __name__ == "__main__":
    main()
