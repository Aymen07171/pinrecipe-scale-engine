#!/usr/bin/env python3
"""
Pinterest Bulk Post Bot - Native Selenium with Chrome Automation Script
Configured for Semplice Italian Kitchen (22 Live WordPress Italian Recipe Pins).
Also supports 1-click CSV upload at https://www.pinterest.com/settings/bulk-create-pins
"""

import time
import os
import sys
import json
import urllib.request
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_DIR = Path(__file__).resolve().parent
REPORT_PATH = BASE_DIR / "output" / "pinterest_publish_summary_report.json"
CACHE_IMG_DIR = BASE_DIR / "output" / "pin_images_cache"
CACHE_IMG_DIR.mkdir(parents=True, exist_ok=True)

CHROME_PROFILE_DIR = os.environ.get("CHROME_PROFILE_DIR", r"")
HEADLESS = False
DELAY_BETWEEN_PINS = 3
LOGIN_WAIT_SECONDS = 90


def load_italian_recipe_pins(only_new_10: bool = False):
    if not REPORT_PATH.exists():
        print(f"[!] Summary report not found at {REPORT_PATH}. Run: node scripts/pinterest_publisher_and_csv_export.mjs")
        return []
    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        report = json.load(f)
    pins = report.get("pins", [])
    if only_new_10:
        pins = [p for p in pins if p.get("priority", 0) >= 13]
    return pins


def ensure_local_image(pin):
    media_url = pin.get("mediaUrl", "")
    pin_id = pin.get("id", f"pin-{pin.get('index', 1)}")
    local_file = CACHE_IMG_DIR / f"{pin_id}.jpg"
    if not local_file.exists() and media_url.startswith("http"):
        req = urllib.request.Request(media_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            local_file.write_bytes(resp.read())
    return str(local_file.resolve())


def init_chrome_driver():
    options = Options()
    if HEADLESS:
        options.add_argument("--headless=new")
    if CHROME_PROFILE_DIR and os.path.exists(CHROME_PROFILE_DIR):
        options.add_argument(f"--user-data-dir={CHROME_PROFILE_DIR}")
        print(f"[*] Using Chrome User Profile: {CHROME_PROFILE_DIR}")

    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--start-maximized")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)


def publish_pin(driver, pin_data):
    title = pin_data.get("title", "")[:100]
    description = pin_data.get("description", "")[:500]
    link = pin_data.get("link", "")
    board = pin_data.get("board", "Italian Recipes")

    print(f"\n[+] Processing Pin #{pin_data.get('priority')}: {title[:60]}...")
    driver.get("https://www.pinterest.com/pin-builder/")

    wait = WebDriverWait(driver, 30)
    time.sleep(3)

    if "login" in driver.current_url.lower():
        print(f"[!] Please log into Pinterest in the opened Chrome window (waiting up to {LOGIN_WAIT_SECONDS}s)...")
        for _ in range(LOGIN_WAIT_SECONDS):
            time.sleep(1)
            if "pin-builder" in driver.current_url.lower():
                break

    # 1. Upload local image file
    local_img_path = ensure_local_image(pin_data)
    if os.path.exists(local_img_path):
        file_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="file"]')))
        file_input.send_keys(local_img_path)
        print(f"  [*] Image uploaded: {os.path.basename(local_img_path)}")
        time.sleep(2)

    # 2. Set Title (<= 100 chars)
    try:
        title_box = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, '#pin-draft-title, textarea[data-test-id="pin-title-input"], input[placeholder*="title" i]')
            )
        )
        title_box.clear()
        title_box.send_keys(title)
        print("  [*] Title set.")
    except Exception as e:
        print(f"  [!] Could not set title: {e}")

    # 3. Set Description (<= 500 chars)
    try:
        desc_box = driver.find_element(
            By.CSS_SELECTOR,
            'div[data-test-id="editor-description-container"] div[contenteditable="true"], #pin-draft-description',
        )
        desc_box.send_keys(description)
        print("  [*] Description set.")
    except Exception as e:
        print(f"  [!] Could not set description: {e}")

    # 4. Set Destination Link
    if link:
        try:
            link_box = driver.find_element(By.CSS_SELECTOR, '#pin-draft-link, input[placeholder*="link" i]')
            link_box.clear()
            link_box.send_keys(link)
            print(f"  [*] Destination link set: {link}")
        except Exception as e:
            print(f"  [!] Could not set destination link: {e}")

    # 5. Select Board & Click Publish
    try:
        board_btn = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test-id="board-dropdown-select-button"]'))
        )
        board_btn.click()
        time.sleep(1)

        pub_btn = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test-id="board-dropdown-save-button"]'))
        )
        pub_btn.click()
        print(f"  [✓] Published to Pinterest Board '{board}'!")
        time.sleep(4)
        return True
    except Exception as e:
        print(f"  [✗] Failed to publish: {e}")
        return False


def main():
    only_new_10 = "--new-10" in sys.argv
    pins = load_italian_recipe_pins(only_new_10=only_new_10)
    print("=" * 72)
    print("  Pinterest Bulk Post Bot — Semplice Italian Kitchen (Selenium Engine)")
    print(f"  Total Validated Italian Recipe Pins in Queue: {len(pins)}")
    print("=" * 72)

    if not pins:
        return

    driver = init_chrome_driver()
    try:
        success = 0
        for i, pin in enumerate(pins):
            print(f"\n--- [{i + 1}/{len(pins)}] ---")
            if publish_pin(driver, pin):
                success += 1
            time.sleep(DELAY_BETWEEN_PINS)
        print(f"\n[✓] Automation completed: {success}/{len(pins)} recipe pins published to Pinterest.")
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
