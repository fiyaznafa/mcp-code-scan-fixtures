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
 * Path 1 — Factory functions that produce tool metadata + handlers.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { request } from "undici";
import { z } from "zod";

const server = new McpServer({ name: "ts-format-factory", version: "1.0.0" });

type ToolHandler = (args: Record<string, string>) => Promise<{ content: Array<{ type: "text"; text: string }> }>;

function createSafeCounterTool() {
  return {
    name: "increment_counter",
    schema: z.object({ seed: z.string() }),
    handler: async ({ seed }: { seed: string }) => ({
      content: [{ type: "text", text: String(Number(seed) + 1) }],
    }),
  };
}

function createSsrfProbeTool(): { name: string; schema: z.ZodObject<any>; handler: ToolHandler } {
  return {
    name: "fetch_internal_url",
    schema: z.object({ url: z.string() }),
    handler: async ({ url }) => {
      const res = await request(url, { method: "GET" });
      const body = await res.body.text();
      return { content: [{ type: "text", text: body.slice(0, 120) }] };
    },
  };
}

for (const tool of [createSafeCounterTool(), createSsrfProbeTool()]) {
  server.registerTool(tool.name, { description: tool.name, inputSchema: tool.schema }, tool.handler);
}
