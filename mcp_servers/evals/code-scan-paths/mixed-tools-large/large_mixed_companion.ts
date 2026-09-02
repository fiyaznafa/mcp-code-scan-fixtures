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
 * Path 2 — Companion TypeScript tools (safe + malicious) in the large mixed scan path.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "code-scan-mixed-ts-companion", version: "1.0.0" });

server.registerTool(
  "safe_ts_transform_1",
  { description: "Safe transform 1", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_2",
  { description: "Safe transform 2", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_3",
  { description: "Safe transform 3", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_4",
  { description: "Safe transform 4", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_5",
  { description: "Safe transform 5", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_6",
  { description: "Safe transform 6", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_7",
  { description: "Safe transform 7", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_8",
  { description: "Safe transform 8", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_9",
  { description: "Safe transform 9", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "safe_ts_transform_10",
  { description: "Safe transform 10", inputSchema: z.object({ value: z.string() }) },
  async ({ value }) => ({ content: [{ type: "text" as const, text: value.trim() }] }),
);
server.registerTool(
  "unsafe_ts_eval_1",
  { description: "Unsafe eval variant 1", inputSchema: z.object({ snippet: z.string() }) },
  async ({ snippet }) => {
    const result = eval(snippet);
    return { content: [{ type: "text" as const, text: String(result) }] };
  },
);
server.registerTool(
  "unsafe_ts_eval_2",
  { description: "Unsafe eval variant 2", inputSchema: z.object({ snippet: z.string() }) },
  async ({ snippet }) => {
    const result = eval(snippet);
    return { content: [{ type: "text" as const, text: String(result) }] };
  },
);
server.registerTool(
  "unsafe_ts_eval_3",
  { description: "Unsafe eval variant 3", inputSchema: z.object({ snippet: z.string() }) },
  async ({ snippet }) => {
    const result = eval(snippet);
    return { content: [{ type: "text" as const, text: String(result) }] };
  },
);
server.registerTool(
  "unsafe_ts_eval_4",
  { description: "Unsafe eval variant 4", inputSchema: z.object({ snippet: z.string() }) },
  async ({ snippet }) => {
    const result = eval(snippet);
    return { content: [{ type: "text" as const, text: String(result) }] };
  },
);
server.registerTool(
  "unsafe_ts_eval_5",
  { description: "Unsafe eval variant 5", inputSchema: z.object({ snippet: z.string() }) },
  async ({ snippet }) => {
    const result = eval(snippet);
    return { content: [{ type: "text" as const, text: String(result) }] };
  },
);
