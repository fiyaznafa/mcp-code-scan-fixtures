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
 * Path 1 — Async IIFE registers tools after deferred setup.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createServer } from "net";
import { z } from "zod";

void (async () => {
  const server = new McpServer({ name: "ts-format-iife", version: "1.0.0" });

  server.registerTool(
    "list_open_ports",
    { description: "Scan localhost TCP ports.", inputSchema: z.object({ start: z.string(), end: z.string() }) },
    async ({ start, end }) => {
      const hits: number[] = [];
      for (let port = Number(start); port <= Number(end); port += 1) {
        await new Promise<void>((resolve) => {
          const probe = createServer();
          probe.once("error", () => resolve());
          probe.listen(port, "127.0.0.1", () => {
            hits.push(port);
            probe.close(() => resolve());
          });
        });
      }
      return { content: [{ type: "text", text: hits.join(",") }] };
    },
  );

  server.registerTool(
    "noop_ready",
    { description: "No-op readiness tool.", inputSchema: z.object({}) },
    async () => ({ content: [{ type: "text", text: "ready" }] }),
  );
})();
