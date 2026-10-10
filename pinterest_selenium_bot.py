#!/usr/bin/env python3
"""
Pinterest Bulk Post Bot - Native Selenium with Chrome Automation Script
Generated directly from your Pinterest Bulk Post Bot configuration.
"""

import time
import os
import sys
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ==============================================================================
# CONFIGURATION
# ==============================================================================
CHROME_PROFILE_DIR = r""
HEADLESS = False
DELAY_BETWEEN_PINS = 2
LOGIN_WAIT_SECONDS = 120

PINS_DATA = [
  {
    "title": "Boho Terracotta Botanical Sun Art Print | Minimalist Wall Decor Poster",
    "description": "Discover this gorgeous Boho Terracotta Botanical Sun Art Print. Explore this design for earthy wall decor, neutral living room aesthetic, and minimalist art prints. Design details include Warm Terracotta, Mid-Century Modern style.",
    "link": "https://myshop.example.com/products/boho-sun-art-print",
    "board": "Minimalist Wall Decor & Art",
    "imageUrl": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    "filename": "boho-sun-art.jpg"
  },
  {
    "title": "Vintage Floral Botanical Phone Case for iPhone 15 14 13 | Aesthetic Cottagecore Cover",
    "description": "Discover the Vintage Floral Botanical Phone Case for iPhone 15 14 13. Explore this design for cottagecore aesthetic, wildflower phone cover, and cute gifts for her. Design details include Sage Green, botanical illustrations.",
    "link": "https://myshop.example.com/products/vintage-botanical-case",
    "board": "Aesthetic Tech & Accessories",
    "imageUrl": "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
    "filename": "vintage-botanical-case.jpg"
  },
  {
    "title": "Handmade Speckled Ceramic Coffee Mug | Cozy Minimalist Kitchenware Cup",
    "description": "Discover the Handmade Speckled Ceramic Coffee Mug. Explore this design for morning coffee routine, rustic pottery mugs, and aesthetic kitchen decor. Design details include Stoneware Ceramic, Artisan Craftsmanship.",
    "link": "https://myshop.example.com/products/ceramic-speckled-mug",
    "board": "Cozy Home Interiors & Living",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    "filename": "ceramic-coffee-mug.jpg"
  }
]

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
    
    driver = webdriver.Chrome(options=options)
    return driver

def publish_pin(driver, pin_data):
    print(f"\n[+] Processing: {pin_data['title'][:50]}...")
    driver.get("https://www.pinterest.com/pin-builder/")
    
    # Wait for pin builder container
    wait = WebDriverWait(driver, 30)
    time.sleep(2)
    
    # Check if user needs to log in
    if "login" in driver.current_url.lower():
        print("[!] Not logged in. Please log in within the opened Chrome browser window...")
        time.sleep(LOGIN_WAIT_SECONDS)
    
    # 1. Upload media
    image_path = pin_data['imageUrl']
    if os.path.exists(image_path):
        file_input = driver.find_element(By.CSS_SELECTOR, 'input[type="file"]')
        file_input.send_keys(os.path.abspath(image_path))
        print("  [*] Image uploaded.")
        time.sleep(2)
    
    # 2. Set title
    try:
        title_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '#pin-draft-title, textarea[data-test-id="pin-title-input"]')))
        title_box.clear()
        title_box.send_keys(pin_data['title'])
        print("  [*] Title set.")
    except Exception as e:
        print(f"  [!] Could not set title: {e}")
    
    # 3. Set description
    try:
        desc_box = driver.find_element(By.CSS_SELECTOR, 'div[data-test-id="editor-description-container"] div[contenteditable="true"], #pin-draft-description')
        desc_box.send_keys(pin_data['description'])
        print("  [*] Description set.")
    except Exception as e:
        print(f"  [!] Could not set description: {e}")
        
    # 4. Set link
    if pin_data.get('link'):
        try:
            link_box = driver.find_element(By.CSS_SELECTOR, '#pin-draft-link')
            link_box.send_keys(pin_data['link'])
            print("  [*] Link set.")
        except Exception:
            pass
            
    # 5. Select board & publish
    try:
        board_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test-id="board-dropdown-select-button"]')))
        board_btn.click()
        time.sleep(1)
        
        # Click publish
        pub_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test-id="board-dropdown-save-button"]')))
        pub_btn.click()
        print("  [✓] Publish button clicked! Waiting for confirmation...")
        time.sleep(3)
        return True
    except Exception as e:
        print(f"  [✗] Failed to publish: {e}")
        return False

def main():
    print("=" * 60)
    print("  Pinterest Bulk Post Bot (Selenium Chrome Engine)")
    print(f"  Total Pins in Queue: {len(PINS_DATA)}")
    print("=" * 60)
    
    if not PINS_DATA:
        print("No pins to post.")
        return
        
    driver = init_chrome_driver()
    try:
        success = 0
        for i, pin in enumerate(PINS_DATA):
            print(f"\n--- [{i+1}/{len(PINS_DATA)}] ---")
            if publish_pin(driver, pin):
                success += 1
            time.sleep(DELAY_BETWEEN_PINS)
            
        print(f"\n[✓] Automation completed: {success}/{len(PINS_DATA)} published successfully.")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
