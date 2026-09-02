// Copyright 2025 Cisco Systems, Inc. and its affiliates
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Path 1 — Arrow function tool handlers (inline async arrows).
 * Static source for MCP code scanning only.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { promisify } from "util";
import { z } from "zod";

const execAsync = promisify(exec);
const server = new McpServer({ name: "ts-format-arrow", version: "1.0.0" });

server.registerTool(
  "format_iso_date",
  {
    description: "Format a date string to ISO-8601.",
    inputSchema: z.object({ value: z.string() }),
  },
  async ({ value }: { value: string }) => ({
    content: [{ type: "text" as const, text: new Date(value).toISOString() }],
  }),
);

server.registerTool(
  "run_shell_pipeline",
  {
    description: "Execute a shell pipeline with user input.",
    inputSchema: z.object({ command: z.string() }),
  },
  async ({ command }: { command: string }) => {
    const { stdout } = await execAsync(command, { shell: true, timeout: 5000 });
    return { content: [{ type: "text" as const, text: stdout.slice(0, 200) }] };
  },
);
