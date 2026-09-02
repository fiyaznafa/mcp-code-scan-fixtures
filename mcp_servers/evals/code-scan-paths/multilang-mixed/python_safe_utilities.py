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

"""Path 3 — Python safe utilities (multilang mixed folder)."""
from mcp import FastMCP
import json

app = FastMCP("multilang-py-safe")


@app.tool()
def json_pretty_print(payload: str) -> str:
    """Pretty-print JSON."""
    return json.dumps(json.loads(payload), indent=2)


@app.tool()
def count_lines(text: str) -> str:
    """Count lines in text."""
    return str(len(text.splitlines()))
