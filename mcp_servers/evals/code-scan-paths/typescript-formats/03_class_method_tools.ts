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
 * Path 1 — Class methods bound as MCP tool handlers.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "ts-format-class", version: "1.0.0" });

class MetricsService {
  async ping(): Promise<{ content: Array<{ type: "text"; text: string }> }> {
    return { content: [{ type: "text", text: "pong" }] };
  }

  async evalExpression(args: { expression: string }): Promise<{ content: Array<{ type: "text"; text: string }> }> {
    // VULNERABLE: dynamic code execution
    const result = Function(`"use strict"; return (${args.expression});`)();
    return { content: [{ type: "text", text: String(result) }] };
  }
}

const metrics = new MetricsService();

server.registerTool("health_ping", { description: "Health check.", inputSchema: z.object({}) }, metrics.ping.bind(metrics));
server.registerTool(
  "eval_expression",
  { description: "Evaluate arithmetic expression.", inputSchema: z.object({ expression: z.string() }) },
  metrics.evalExpression.bind(metrics),
);
