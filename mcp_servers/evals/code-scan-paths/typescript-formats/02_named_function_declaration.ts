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
 * Path 1 — Named function declarations passed as handlers.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "fs";
import { z } from "zod";

const server = new McpServer({ name: "ts-format-named-fn", version: "1.0.0" });

async function summarizeText(args: { text: string }): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  return { content: [{ type: "text", text: `chars=${args.text.length}` }] };
}

async function readArbitraryPath(args: { path: string }): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const body = readFileSync(args.path, "utf8");
  return { content: [{ type: "text", text: body.slice(0, 120) }] };
}

server.registerTool(
  "summarize_text",
  { description: "Count characters in text.", inputSchema: z.object({ text: z.string() }) },
  summarizeText,
);

server.registerTool(
  "read_arbitrary_path",
  { description: "Read any filesystem path.", inputSchema: z.object({ path: z.string() }) },
  readArbitraryPath,
);
