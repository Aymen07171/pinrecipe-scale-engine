"""
Automation Engine Configuration & Presets
"""

import os
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output_designs"
EXCEL_OUTPUT_PATH = OUTPUT_DIR / "Design_Assets_Catalog.xlsx"

# Ensure output folder exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# API Keys & URLs for CodeKraft / Gemini backup
CODEKRAFT_API_KEY = (
    os.environ.get("CODECRAFT_API_KEY") 
    or os.environ.get("CODEKRAFT_API_KEY") 
    or os.environ.get("GEMINI_API_KEY") 
    or ""
)

CODEKRAFT_API_URL = (
    os.environ.get("CODECRAFT_API_URL") 
    or os.environ.get("CODEKRAFT_API_URL") 
    or "https://generativelanguage.googleapis.com"
)

# Web Automation Defaults
DEFAULT_WEB_APP_URL = "http://localhost:3000"
HEADLESS_DEFAULT = True
SELENIUM_TIMEOUT = 25  # seconds

# Financial & Charging Rules
DEFAULT_BASE_CHARGE = 10.50  # Production cost from print provider (Printify Tough Case)
DEFAULT_RETAIL_PRICE = 29.99  # Recommended consumer retail price
DEFAULT_SHIPPING_CHARGE = 4.99

# Design Aspect Ratio Standard
DEFAULT_ASPECT_RATIO = "9:16"
DEFAULT_RESOLUTION = "2400x4800 px"

# Curated Category Presets & Seed Prompts
DESIGN_PRESETS = [
    {
        "category": "Japanese Dark Fantasy",
        "title_prefix": "Kitsune Samurai Blood Moon",
        "subject": "Masked kitsune warrior in ornate crimson haori wielding a radiant glowing katana",
        "halo": "Massive radiant blood moon with drifting storm clouds and floating azure spirit flames in upper 35% safe zone",
        "botanical": "Clustered crimson spider lilies (higanbana) and drifting raven feathers",
        "colors": "Crimson scarlet, midnight obsidian, ghost cyan, and liquid gold",
        "prompt": "Full-bleed 9:16 vertical phone case artwork. Masked kitsune samurai warrior in ornate crimson haori wielding glowing katana in lower 65% canvas. Top 35% safe zone features massive radiant blood moon and drifting storm clouds. Clustered red spider lilies at base. Midnight obsidian and liquid gold came lines. Pure graphic design, no mockups, no phone borders.",
        "tags": [
            "kitsune samurai", "fox mask case", "blood moon cover", "japanese warrior",
            "red spider lily", "higanbana art", "dark fantasy case", "anime armor cover",
            "tough phone case", "iphone 16 case", "galaxy s25 case", "bushido artwork", "cool anime gift"
        ]
    },
    {
        "category": "Gothic Stained Glass",
        "title_prefix": "Cathedral Stained Glass Woodland Fox",
        "subject": "Serene sleeping red fox curled peacefully with bushy tail wrapped around body in lower canvas",
        "halo": "Radiant segmented cathedral sunburst halo with amber glass rays and stars in top 35% safe zone",
        "botanical": "Red fly agaric mushrooms, autumn oak leaves, and glowing forest motes",
        "colors": "Warm amber gold, fiery orange, deep ruby red, and dark leaded solder outlines",
        "prompt": "Full-bleed 9:16 vertical phone case artwork. Masterpiece gothic stained glass cathedral vitrail. Peaceful sleeping red woodland fox curled serenely in lower composition. Upper 35% safe zone holds a radiant amber cathedral sunburst window. Glowing autumn oak leaves and red fly agaric mushrooms. Heavy leaded came outlines, jewel-toned glass. Zero mockups, pure artwork.",
        "tags": [
            "stained glass case", "woodland fox", "cathedral vitrail", "autumn fox cover",
            "tough phone case", "iphone 16 pro", "samsung s25 ultra", "art nouveau print",
            "cottagecore aesthetic", "jewel tone glass", "animal illustration", "unique art gift", "protective case"
        ]
    },
    {
        "category": "Cyberpunk Streetwear",
        "title_prefix": "Neon Ronin Cyberpunk Overpass",
        "subject": "Cybernetic ronin warrior with holographic oni visor and tactical techwear jacket standing in ready stance",
        "halo": "Towering holographic cyberpunk skyline with neon kanji billboards in upper safe zone",
        "botanical": "Electric rain droplets, sparking wires, and drifting digital cherry blossom pixels",
        "colors": "Electric cyan, neon magenta, deep carbon fiber gray, and chromatic aberration",
        "prompt": "Full-bleed 9:16 vertical phone case artwork. Cyberpunk ronin warrior with glowing neon oni visor and futuristic techwear in lower 65% composition. Upper 35% safe zone shows towering rainy megacity skyline with glowing kanji holograms. Electric cyan and vibrant magenta highlights. High-contrast vector styling, edge-to-edge pure illustration.",
        "tags": [
            "cyberpunk case", "neon ronin", "oni mask cover", "techwear artwork",
            "future samurai", "tokyo neon", "tough phone case", "iphone 15 pro",
            "galaxy s24 case", "gamer aesthetic", "synthwave art", "cool phone cover", "cybernetic warrior"
        ]
    },
    {
        "category": "Botanical Cottagecore",
        "title_prefix": "Vintage Wildflower Meadow & Honeybee",
        "subject": "Lush cluster of blooming English country wildflowers with golden bumblebees collecting nectar in lower composition",
        "halo": "Delicate antique celestial solar arch with delicate golden constellation stars in upper safe zone",
        "botanical": "Echinacea, lavender sprigs, chamomile daisies, and wild ferns",
        "colors": "Sage green, warm terracotta, soft cream, and vintage gold foil accents",
        "prompt": "Full-bleed 9:16 vertical phone case artwork. Botanical cottagecore meadow illustration. Clustered purple echinacea, wild lavender, and chamomile daisies with golden honeybees in lower composition. Upper safe zone contains subtle antique celestial star arch on cream parchment background. Warm sage green and terracotta palette.",
        "tags": [
            "wildflower case", "cottagecore cover", "botanical floral", "honeybee print",
            "sage green aesthetic", "vintage nature", "tough phone case", "iphone 16 plus",
            "spring flowers", "earthy phone cover", "herbal illustration", "aesthetic gift", "protective cover"
        ]
    },
    {
        "category": "Minimalist Boho",
        "title_prefix": "Terracotta Arch & Bohemian Botanical Sun",
        "subject": "Stacked organic stoneware ceramics and monstera palm fronds in lower foreground",
        "halo": "Mid-century geometric terracotta sun arch with textured radiating beams in upper safe zone",
        "botanical": "Dried pampas grass, palm spears, and eucalyptus leaves",
        "colors": "Earthy terracotta, warm desert ochre, sandstone beige, and muted olive",
        "prompt": "Full-bleed 9:16 vertical phone case artwork. Minimalist bohemian art print. Textured terracotta sun rising over mid-century arched gateway. Organic monstera leaves and dried pampas grass in lower canvas. Clean modern lines, warm earthy neutral palette, zero device mockups.",
        "tags": [
            "boho phone case", "terracotta sun", "minimalist art", "earthy neutral",
            "mid century modern", "bohemian print", "tough phone case", "iphone 14 case",
            "samsung s23 case", "desert aesthetic", "abstract botanical", "modern wall art", "clean aesthetic"
        ]
    }
]
