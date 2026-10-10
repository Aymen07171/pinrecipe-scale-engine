"""
Chrome Selenium Web Automation Bot
Interacts with web applications, injects prompts, detects quota limits, and downloads designs.
"""

import os
import sys
import time
import base64
from pathlib import Path
from typing import Optional, Dict, Any, Tuple

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

from .config import DEFAULT_WEB_APP_URL, HEADLESS_DEFAULT, SELENIUM_TIMEOUT


class QuotaLimitException(Exception):
    """Raised when the web application or browser UI encounters quota limits."""
    pass


class SeleniumDesignBot:
    """
    Automates web app interactions to input design prompts,
    monitor generation, detect quota limits, and download design assets.
    """

    def __init__(
        self,
        web_url: str = DEFAULT_WEB_APP_URL,
        headless: bool = HEADLESS_DEFAULT,
        profile_dir: Optional[str] = None
    ):
        self.web_url = web_url
        self.headless = headless
        self.profile_dir = profile_dir
        self.driver: Optional[webdriver.Chrome] = None

    def start_browser(self):
        """Initializes and starts the Chrome browser instance."""
        if self.driver is not None:
            return

        options = Options()
        if self.headless:
            options.add_argument("--headless=new")
        
        options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        
        # User profile if provided
        if self.profile_dir and os.path.exists(self.profile_dir):
            options.add_argument(f"--user-data-dir={self.profile_dir}")

        # Set user agent
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        )

        try:
            self.driver = webdriver.Chrome(options=options)
            self.driver.set_page_load_timeout(30)
            print(f"[OK] Chrome Selenium instance started (Headless: {self.headless})")
        except Exception as e:
            print(f"[!] Could not launch Chrome via standard Selenium: {e}")
            raise

    def close(self):
        """Closes the browser instance."""
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None

    def __enter__(self):
        self.start_browser()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def generate_and_download(
        self,
        prompt: str,
        output_filepath: Path,
        category: str = "Japanese Dark Fantasy",
        timeout: int = SELENIUM_TIMEOUT
    ) -> Tuple[bool, str]:
        """
        Navigates to the web app, inputs the prompt, checks for quota limits,
        and saves the generated design to output_filepath.
        
        Returns: (success: bool, provider_or_reason: str)
        Raises: QuotaLimitException if a quota or rate limit is detected in UI.
        """
        output_filepath.parent.mkdir(parents=True, exist_ok=True)
        if not self.driver:
            self.start_browser()

        driver = self.driver
        print(f"[*] Navigating to {self.web_url}...")

        try:
            driver.get(self.web_url)
            time.sleep(2)
        except Exception as e:
            print(f"[!] Navigation error to {self.web_url}: {e}")
            # If web app is unreachable or down, fail over immediately to API
            raise QuotaLimitException(f"Web interface unreachable: {e}")

        # 1. Check for Quota or Error Messages in Initial DOM
        page_source = driver.page_source.lower()
        self._check_for_quota_errors(page_source)

        wait = WebDriverWait(driver, timeout)

        # 2. Locate prompt input field
        prompt_selectors = [
            'textarea[name="prompt"]',
            'textarea[placeholder*="prompt" i]',
            'textarea',
            'input[name="prompt"]',
            'input[type="text"]'
        ]
        
        input_elem = None
        for sel in prompt_selectors:
            try:
                input_elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, sel)))
                if input_elem.is_displayed():
                    break
            except Exception:
                continue

        if not input_elem:
            raise QuotaLimitException("Prompt input field not found on target page.")

        # 3. Input Prompt
        try:
            input_elem.clear()
            input_elem.send_keys(prompt)
            print(f"  [+] Injected prompt: '{prompt[:45]}...'")
            time.sleep(1)
        except Exception as e:
            raise QuotaLimitException(f"Failed to enter prompt into UI: {e}")

        # 4. Click Submit / Generate Button
        btn_selectors = [
            'button[type="submit"]',
            'button[id*="generate" i]',
            'button.generate-btn',
            '//button[contains(translate(text(), "GENERATE", "generate"), "generate")]',
            '//button[contains(translate(text(), "SYNTHESIZE", "synthesize"), "synthesize")]',
            '//button[contains(translate(text(), "SUBMIT", "submit"), "submit")]'
        ]

        clicked = False
        for btn_sel in btn_selectors:
            try:
                if btn_sel.startswith('//'):
                    btn = driver.find_element(By.XPATH, btn_sel)
                else:
                    btn = driver.find_element(By.CSS_SELECTOR, btn_sel)
                
                if btn.is_displayed() and btn.is_enabled():
                    btn.click()
                    clicked = True
                    print("  [+] Clicked Generate button.")
                    break
            except Exception:
                continue

        if not clicked:
            # Fallback to pressing ENTER
            input_elem.send_keys(Keys.ENTER)

        # 5. Monitor for Completion or Quota Errors
        time.sleep(3)
        poll_interval = 2
        elapsed = 0
        max_wait = timeout

        while elapsed < max_wait:
            current_source = driver.page_source.lower()
            self._check_for_quota_errors(current_source)

            # Check for generated image elements
            img_candidates = driver.find_elements(By.CSS_SELECTOR, 'img[src^="data:image"], img[src*="generated"], img[src*="projects"], img.result-image, .artwork-preview img')
            for img in img_candidates:
                src = img.get_attribute("src")
                if src and len(src) > 50 and not src.endswith("logo.png") and not src.endswith("icon.svg"):
                    # Success: extract and save image
                    self._save_image_from_src(src, output_filepath)
                    print(f"  [OK] Successfully downloaded design via Selenium: {output_filepath.name}")
                    return True, "Chrome Selenium Web UI"

            time.sleep(poll_interval)
            elapsed += poll_interval

        # If timeout reached without finding image, check quota one last time
        self._check_for_quota_errors(driver.page_source.lower())
        raise QuotaLimitException("Generation timed out without returning an image asset.")

    def _check_for_quota_errors(self, page_source: str):
        """Inspects DOM for rate limit, quota exhaustion, or error indicators."""
        quota_signals = [
            "quota exceeded",
            "rate limit",
            "resource_exhausted",
            "too many requests",
            "429",
            "credits exhausted",
            "daily limit reached",
            "please try again later",
            "insufficient credits",
            "dunning"
        ]
        for signal in quota_signals:
            if signal in page_source:
                print(f"  [!] Detected Quota Restriction in Web UI: '{signal}'")
                raise QuotaLimitException(f"Web UI Quota Restriction Detected: {signal}")

    def _save_image_from_src(self, src: str, output_path: Path):
        """Saves image from base64 data URL or HTTP URL."""
        if src.startswith("data:image"):
            header, encoded = src.split(",", 1)
            img_data = base64.b64decode(encoded)
            with open(output_path, "wb") as f:
                f.write(img_data)
        elif src.startswith("http://") or src.startswith("https://"):
            import urllib.request
            urllib.request.urlretrieve(src, output_path)
        else:
            # Local path
            local_src = Path(src.lstrip("/"))
            if local_src.exists():
                import shutil
                shutil.copy2(local_src, output_path)
            else:
                raise ValueError(f"Unsupported image src format: {src[:30]}...")
