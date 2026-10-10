"""
Excel Catalog Integration Manager
Creates and maintains formatted multi-sheet Excel workbooks using openpyxl.
"""

import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from .config import EXCEL_OUTPUT_PATH


class ExcelCatalogManager:
    """
    Manages the creation and incremental update of the Design Assets Catalog Excel workbook.
    """

    def __init__(self, excel_path: Optional[Path] = None):
        self.excel_path = excel_path or EXCEL_OUTPUT_PATH
        self.excel_path.parent.mkdir(parents=True, exist_ok=True)

    def write_catalog(self, records: List[Dict[str, Any]]) -> Path:
        """
        Creates or overwrites the master catalog workbook with the provided list of design records.
        """
        wb = openpyxl.Workbook()

        # Styles
        header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        regular_font = Font(name="Segoe UI", size=10)
        bold_font = Font(name="Segoe UI", size=10, bold=True)
        zebra_fill = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")
        summary_header_fill = PatternFill(start_color="2E75B6", end_color="2E75B6", fill_type="solid")

        thin_border = Border(
            left=Side(style="thin", color="E5E7EB"),
            right=Side(style="thin", color="E5E7EB"),
            top=Side(style="thin", color="E5E7EB"),
            bottom=Side(style="thin", color="E5E7EB")
        )

        # ----------------------------------------------------------------------
        # SHEET 1: Master_Catalog
        # ----------------------------------------------------------------------
        ws1 = wb.active
        ws1.title = "Master_Catalog"
        ws1.views.sheetView[0].showGridLines = True

        headers = [
            "Design ID",
            "Status",
            "Product Title",
            "Category",
            "Generation Provider",
            "Aspect Ratio",
            "Resolution",
            "Base Charge ($)",
            "Retail Price ($)",
            "Projected Profit ($)",
            "SEO / Etsy Tags (13)",
            "Prompt Specification",
            "Product Description",
            "Image Filename",
            "Asset File Path",
            "Timestamp"
        ]

        ws1.append(headers)

        # Style header row
        for col_num in range(1, len(headers) + 1):
            cell = ws1.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            cell.border = thin_border
        ws1.row_dimensions[1].height = 28

        # Insert record rows
        for r_idx, rec in enumerate(records, start=2):
            tags_str = ", ".join(rec.get("tags", [])) if isinstance(rec.get("tags"), list) else str(rec.get("tags", ""))
            profit_formula = f"=I{r_idx}-H{r_idx}"  # Retail Price - Base Charge

            row_data = [
                rec.get("design_id", f"DSGN-{r_idx-1:04d}"),
                rec.get("status", "Active"),
                rec.get("title", ""),
                rec.get("category", ""),
                rec.get("provider", "Selenium / API Fallback"),
                rec.get("aspect_ratio", "9:16"),
                rec.get("resolution", "2400x4800 px"),
                float(rec.get("base_charge", 10.50)),
                float(rec.get("retail_price", 29.99)),
                profit_formula,
                tags_str,
                rec.get("prompt", ""),
                rec.get("description", ""),
                rec.get("image_filename", ""),
                str(rec.get("image_path", "")),
                rec.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            ]
            ws1.append(row_data)

            # Apply row formatting
            is_even = (r_idx % 2 == 0)
            for c_idx in range(1, len(row_data) + 1):
                c = ws1.cell(row=r_idx, column=c_idx)
                c.font = regular_font
                c.border = thin_border
                if is_even:
                    c.fill = zebra_fill

                # Alignments & Formats
                if c_idx in [1, 2, 6, 7, 16]:  # ID, Status, Ratio, Res, Timestamp
                    c.alignment = Alignment(horizontal="center", vertical="center")
                elif c_idx in [8, 9, 10]:  # Financials: Base Charge, Retail, Profit
                    c.number_format = "$#,##0.00"
                    c.alignment = Alignment(horizontal="right", vertical="center")
                    if c_idx == 10:
                        c.font = bold_font
                elif c_idx in [11, 12, 13]:  # Text blocks
                    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=False)

            ws1.row_dimensions[r_idx].height = 22

        # ----------------------------------------------------------------------
        # SHEET 2: Category_Summary
        # ----------------------------------------------------------------------
        ws2 = wb.create_sheet(title="Category_Summary")
        ws2.views.sheetView[0].showGridLines = True

        cat_headers = [
            "Category",
            "Total Designs",
            "Total Base Charges ($)",
            "Total Retail Value ($)",
            "Total Projected Profit ($)",
            "Avg Profit / Unit ($)"
        ]
        ws2.append(cat_headers)
        for col_num in range(1, len(cat_headers) + 1):
            cell = ws2.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = summary_header_fill
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = thin_border
        ws2.row_dimensions[1].height = 26

        # Aggregate categories
        cat_stats: Dict[str, Dict[str, Any]] = {}
        for rec in records:
            cat = rec.get("category", "General")
            if cat not in cat_stats:
                cat_stats[cat] = {"count": 0, "charges": 0.0, "retail": 0.0}
            cat_stats[cat]["count"] += 1
            cat_stats[cat]["charges"] += float(rec.get("base_charge", 10.50))
            cat_stats[cat]["retail"] += float(rec.get("retail_price", 29.99))

        for row_i, (cat_name, stats) in enumerate(cat_stats.items(), start=2):
            total_profit = stats["retail"] - stats["charges"]
            avg_profit = total_profit / stats["count"] if stats["count"] > 0 else 0.0
            ws2.append([
                cat_name,
                stats["count"],
                stats["charges"],
                stats["retail"],
                total_profit,
                avg_profit
            ])

            for c_idx in range(1, 7):
                c = ws2.cell(row=row_i, column=c_idx)
                c.font = regular_font
                c.border = thin_border
                if c_idx == 2:
                    c.alignment = Alignment(horizontal="center", vertical="center")
                elif c_idx >= 3:
                    c.number_format = "$#,##0.00"
                    c.alignment = Alignment(horizontal="right", vertical="center")
                    if c_idx in [5, 6]:
                        c.font = bold_font
            ws2.row_dimensions[row_i].height = 20

        # Totals Row
        last_cat_row = len(cat_stats) + 2
        ws2.append([
            "TOTAL / FLEET",
            f"=SUM(B2:B{last_cat_row-1})",
            f"=SUM(C2:C{last_cat_row-1})",
            f"=SUM(D2:D{last_cat_row-1})",
            f"=SUM(E2:E{last_cat_row-1})",
            f"=AVERAGE(F2:F{last_cat_row-1})"
        ])
        for c_idx in range(1, 7):
            c = ws2.cell(row=last_cat_row, column=c_idx)
            c.font = bold_font
            c.fill = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")
            c.border = thin_border
            if c_idx == 2:
                c.alignment = Alignment(horizontal="center", vertical="center")
            elif c_idx >= 3:
                c.number_format = "$#,##0.00"
                c.alignment = Alignment(horizontal="right", vertical="center")

        # ----------------------------------------------------------------------
        # Auto-fit Column Widths across sheets
        # ----------------------------------------------------------------------
        for ws in [ws1, ws2]:
            for col in ws.columns:
                max_len = 0
                col_letter = get_column_letter(col[0].column)
                for cell in col:
                    val_str = str(cell.value or "")
                    if len(val_str) > max_len and not val_str.startswith("="):
                        max_len = len(val_str)
                # Cap column width at 45 to keep spreadsheet compact
                ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 45)

        wb.save(self.excel_path)
        print(f"[OK] Successfully generated Excel Catalog: {self.excel_path}")
        return self.excel_path
