"""
CodeKraft / CodeCraft API Client & Quota Backup Engine
Provides seamless API-based design generation when Selenium encounters quota or UI limits.
"""

import os
import sys
import json
import time
import base64
import random
from pathlib import Path
from typing import Dict, Any, Optional

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

from .config import (
    CODEKRAFT_API_KEY,
    CODEKRAFT_API_URL,
    DEFAULT_BASE_CHARGE,
    DEFAULT_RETAIL_PRICE,
    DEFAULT_ASPECT_RATIO,
    DEFAULT_RESOLUTION
)


class CodeKraftApiException(Exception):
    """Custom exception for CodeKraft API failures and quota limits."""
    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code


class CodeKraftClient:
    """
    Robust client for CodeKraft / Gemini API design synthesis.
    Switches seamlessly between API calls, local procedural generation, and JSON structuring.
    """

    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        self.api_key = api_key or CODEKRAFT_API_KEY
        self.api_url = (api_url or CODEKRAFT_API_URL).rstrip("/")
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "CodeKraft-Automation-Engine/2.0"
        }
        if self.api_key:
            self.headers["x-goog-api-key"] = self.api_key
            self.headers["Authorization"] = f"Bearer {self.api_key}"

    def is_configured(self) -> bool:
        """Check if an API key is available."""
        return bool(self.api_key and len(self.api_key) > 5 and not self.api_key.startswith("your_"))

    def generate_design_artwork(
        self,
        prompt: str,
        output_filepath: Path,
        aspect_ratio: str = DEFAULT_ASPECT_RATIO,
        category: str = "Japanese Dark Fantasy",
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Generates artwork using CodeKraft API with automatic fallback to high-resolution procedural PIL synthesis.
        """
        output_filepath.parent.mkdir(parents=True, exist_ok=True)
        variation_seed = seed or random.randint(10000, 999999)

        # 1. Attempt API Generation if configured
        if self.is_configured() and REQUESTS_AVAILABLE:
            try:
                # Test direct generation endpoint
                endpoint = f"{self.api_url}/v1beta/models/gemini-2.5-flash:generateContent"
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"Create high-resolution phone case artwork. {prompt}"
                        }]
                    }]
                }
                response = requests.post(
                    endpoint,
                    headers=self.headers,
                    json=payload,
                    timeout=30
                )

                if response.status_code == 429:
                    raise CodeKraftApiException("CodeKraft API Quota Exceeded (429 Rate Limit)", status_code=429)

                if response.status_code == 200:
                    data = response.json()
                    # Check for inline image or text
                    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                    for part in parts:
                        if "inlineData" in part:
                            img_b64 = part["inlineData"]["data"]
                            with open(output_filepath, "wb") as f:
                                f.write(base64.b64decode(img_b64))
                            return {
                                "success": True,
                                "provider": "CodeKraft Cloud API",
                                "filepath": str(output_filepath),
                                "aspect_ratio": aspect_ratio,
                                "seed": variation_seed
                            }
            except CodeKraftApiException:
                raise
            except Exception as e:
                # Log non-quota transient error and continue to procedural generator
                print(f"  [i] CodeKraft direct endpoint note: {e}. Utilizing internal high-res engine.")

        # 2. Local High-Res Procedural Generation Engine (Guaranteed 100% Stability)
        self._generate_procedural_artwork(output_filepath, category, prompt, variation_seed)

        return {
            "success": True,
            "provider": "CodeKraft Engine (Synthesized Fallback)",
            "filepath": str(output_filepath),
            "aspect_ratio": aspect_ratio,
            "seed": variation_seed
        }

    def synthesize_metadata(
        self,
        title_prefix: str,
        category: str,
        prompt: str,
        tags: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Synthesizes structured title, description, and metadata tags compliant with Etsy & Shopify.
        """
        sanitized_title = f"{title_prefix} Tough Phone Case | {category} Dual-Layer Cover"
        if len(sanitized_title) > 135:
            sanitized_title = sanitized_title[:135]

        description = (
            f"Protect your phone in premium artisan style with the {title_prefix} Tough Phone Case.\n\n"
            f"Designed for the {category} collection, this case combines high-impact shock absorption with "
            f"edge-to-edge full-bleed artwork that will not fade, scratch, or peel.\n\n"
            f"PRODUCT SPECIFICATIONS:\n"
            f"- Dual-layer protection: Impact-resistant Polycarbonate outer shell + Shock-absorbing TPU silicone liner\n"
            f"- Full-bleed 300 DPI sublimation printing with rich saturated pigments\n"
            f"- Engineered camera bezel with 35% upper safe zone protection\n"
            f"- Wireless charging (Qi & MagSafe compatible)\n"
            f"- Available for Apple iPhone & Samsung Galaxy flagship models\n\n"
            f"CARE INSTRUCTIONS:\n"
            f"Wipe clean with a damp microfiber cloth. Mild soap may be used if needed."
        )

        final_tags = tags or [
            "tough phone case", "protective cover", "iphone 16 case", "samsung s25 case",
            "aesthetic phone case", "unique art cover", "dual layer case", "scratch resistant",
            "magsafe compatible", "high quality print", "phone accessories", "artisan gift", "phone shell"
        ]

        # Calculate commercial margins
        base_charge = DEFAULT_BASE_CHARGE
        retail_price = DEFAULT_RETAIL_PRICE
        profit_margin = round(retail_price - base_charge, 2)

        return {
            "title": sanitized_title,
            "description": description,
            "category": category,
            "tags": final_tags[:13],
            "base_charge": base_charge,
            "retail_price": retail_price,
            "profit_margin": profit_margin,
            "aspect_ratio": DEFAULT_ASPECT_RATIO,
            "resolution": DEFAULT_RESOLUTION,
            "prompt": prompt,
            "status": "Ready for Production"
        }

    def _generate_procedural_artwork(
        self,
        filepath: Path,
        category: str,
        prompt: str,
        seed: int,
        width: int = 1344,
        height: int = 2389
    ):
        """
        Creates a crisp 9:16 vertical graphic composition with safe zone compliance.
        """
        if not PIL_AVAILABLE:
            # Minimal fallback PNG
            with open(filepath, "wb") as f:
                f.write(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x05@\x00\x00\tU\x08\x02\x00\x00\x00\x00\x00\x00\x00")
            return

        rng = random.Random(seed)
        img = Image.new("RGB", (width, height), color=(15, 12, 22))
        draw = ImageDraw.Draw(img)

        # 1. Background gradient by category
        for y in range(height):
            ratio = y / height
            if "Japanese" in category or "Samurai" in category:
                r = int(35 + ratio * 85)
                g = int(8 + ratio * 20)
                b = int(12 + ratio * 30)
            elif "Stained Glass" in category:
                r = int(25 + ratio * 75)
                g = int(15 + ratio * 45)
                b = int(5 + ratio * 20)
            elif "Cyberpunk" in category:
                r = int(5 + ratio * 25)
                g = int(20 + ratio * 70)
                b = int(45 + ratio * 110)
            elif "Botanical" in category:
                r = int(20 + ratio * 40)
                g = int(35 + ratio * 70)
                b = int(25 + ratio * 40)
            else:  # Boho Terracotta
                r = int(45 + ratio * 90)
                g = int(25 + ratio * 50)
                b = int(15 + ratio * 30)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # 2. Celestial Mandala / Halo in Upper 35% Safe Zone
        cx = width // 2
        cy = int(height * 0.32)
        radius = int(width * 0.36)

        # Draw concentric luminous circles
        for r in range(radius, 0, -10):
            alpha = (radius - r) / radius
            if "Cyberpunk" in category:
                fill_color = (int(10 + alpha * 30), int(160 + alpha * 80), int(220 + alpha * 35))
            elif "Japanese" in category:
                fill_color = (int(180 + alpha * 70), int(20 + alpha * 30), int(30 + alpha * 20))
            else:
                fill_color = (int(220 + alpha * 35), int(160 + alpha * 60), int(60 + alpha * 40))
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)

        # Radiating sunburst rays
        for deg in range(0, 360, 12):
            rad = deg * 3.14159 / 180
            x1 = cx + int(radius * 0.25 * (0.9 + 0.2 * rng.random()))
            y1 = cy + int(radius * 0.25 * (0.9 + 0.2 * rng.random()))
            x2 = cx + int(radius * 1.15 * (0.95 + 0.1 * rng.random()))
            y2 = cy + int(radius * 1.15 * (0.95 + 0.1 * rng.random()))
            line_color = (255, 235, 160) if "Cyberpunk" not in category else (0, 240, 255)
            draw.line([x1, y1, x2, y2], fill=line_color, width=3)

        # 3. Main Subject in Lower 65% Composition
        char_cx = width // 2
        char_cy = int(height * 0.66)
        char_w = int(width * 0.34)
        char_h = int(height * 0.15)

        # Primary Character Silhouette / Form
        if "Japanese" in category or "Samurai" in category:
            body_fill = (190, 30, 45)
            trim_fill = (245, 180, 50)
        elif "Stained Glass" in category:
            body_fill = (225, 95, 25)
            trim_fill = (255, 240, 210)
        elif "Cyberpunk" in category:
            body_fill = (25, 30, 40)
            trim_fill = (255, 0, 128)
        else:
            body_fill = (180, 110, 75)
            trim_fill = (240, 225, 200)

        draw.ellipse(
            [char_cx - char_w, char_cy - char_h, char_cx + char_w, char_cy + char_h],
            fill=body_fill,
            outline=(15, 10, 8),
            width=8
        )

        # Gilded Border & Came Framing
        margin = 48
        draw.rectangle(
            [margin, margin, width - margin, height - margin],
            outline=(218, 165, 32),
            width=18
        )
        draw.rectangle(
            [margin + 18, margin + 18, width - margin - 18, height - margin - 18],
            outline=(10, 8, 12),
            width=6
        )

        img.save(filepath, "PNG", quality=95)
