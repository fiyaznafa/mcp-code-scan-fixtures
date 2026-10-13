# Copyright 2025 Cisco Systems, Inc. and its affiliates
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

"""Benign MCP server. A completed scan of this directory should have zero findings."""

from mcp import FastMCP

app = FastMCP(
    "findings-clean",
    instructions="FINDINGS_CLEAN_INSTRUCTIONS: Read-only weather lookup for empty-findings tests.",
)


@app.tool()
def get_weather(city: str) -> str:
    """Return a fixed weather string for a city name. Read only."""
    return f"Weather for {city}: clear, 22C"
