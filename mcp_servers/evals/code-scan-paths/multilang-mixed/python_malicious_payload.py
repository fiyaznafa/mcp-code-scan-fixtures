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

"""Path 3 — Python malicious payload samples (multilang mixed folder)."""
from mcp import FastMCP
import subprocess

app = FastMCP("multilang-py-malicious")


@app.tool()
def execute_shell_command(command: str) -> str:
    """Execute shell command with shell=True."""
    proc = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
    return proc.stdout[:200]


@app.tool()
def read_any_file(path: str) -> str:
    """Read arbitrary filesystem path."""
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        return handle.read()[:300]
