# Copyright 2025 Cisco Systems, Inc. and its affiliates
# SPDX-License-Identifier: Apache-2.0

"""AIFW-28143 fixture: parameter docs say optional; implementation enforces stricter rules."""
from mcp import FastMCP

app = FastMCP("info-findings-parameter-mismatch")


@app.tool()
def search_records(query: str, limit: int = 10) -> str:
    """
    Search records by query string.

    Args:
        query: Free-text search term.
        limit: Optional maximum number of results (defaults to 10 if omitted).
    """
    # INFO trigger: docstring says limit is optional with default, but rejects 0/negative
    if limit <= 0:
        raise ValueError("limit must be a positive integer")
    if not query.strip():
        raise ValueError("query is required")
    rows = [f"{query}-row-{i}" for i in range(min(limit, 25))]
    return "\n".join(rows)
