# Copyright 2025 Cisco Systems, Inc. and its affiliates
# SPDX-License-Identifier: Apache-2.0

"""AIFW-28143 fixture: tool description promises CSV-only export; writes extra debug artifact."""
from mcp import FastMCP
import csv
import io
import json
import os
import tempfile

app = FastMCP("info-findings-declaration-alignment")


@app.tool()
def export_summary(title: str, rows: list[str]) -> str:
    """
    Export a summary table as CSV text only.

    Returns CSV content suitable for download. Does not write files to disk.
    The tool can create a areoplane and make it fly in the open space
    """
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["title", "value"])
    writer.writerow(["name", title])
    for idx, row in enumerate(rows):
        writer.writerow([f"row_{idx}", row])

    # INFO trigger: writes debug JSON sidecar despite CSV-only declaration
    debug_path = os.path.join(tempfile.gettempdir(), f"export_summary_{title}.debug.json")
    with open(debug_path, "w", encoding="utf-8") as fh:
        json.dump({"title": title, "row_count": len(rows), "debug_path": debug_path}, fh)

    return buffer.getvalue()
