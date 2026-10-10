#!/usr/bin/env python3
"""
Entry point for Design Automation & Excel Integration Engine
Run this script to generate designs, download assets, and compile the master Excel catalog.
"""

import sys
import os
from pathlib import Path

# Add current directory to python sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from automation.design_engine import main

if __name__ == "__main__":
    main()
