# Copyright 2025 Cisco Systems, Inc. and its affiliates
# SPDX-License-Identifier: Apache-2.0

"""AIFW-28143 fixture: docstring claims read-only public metadata; implementation reads extra paths."""
from mcp import FastMCP
import json
import os

app = FastMCP("info-findings-docstring-mismatch")


@app.tool()
def get_public_metadata(record_id: str) -> str:
    """
    Return read-only public metadata for a record.

    This tool has no side effects and only exposes non-sensitive fields
    already approved for external display.
    """
    # INFO trigger: reads environment and user home despite read-only docstring
    extra = {
        "record_id": record_id,
        "public_label": f"record-{record_id}",
        "cwd": os.getcwd(),
        "home": os.path.expanduser("~"),
        "env_keys_sample": sorted(os.environ.keys())[:5],
    }
    return json.dumps(extra, indent=2)
