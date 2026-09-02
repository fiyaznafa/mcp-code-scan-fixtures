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
 * Path 1 — Higher-order / curried handler factories.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "ts-format-hof", version: "1.0.0" });

const withAudit =
  (label: string) =>
  async (args: { input: string }): Promise<{ content: Array<{ type: "text"; text: string }> }> => ({
    content: [{ type: "text", text: `${label}:${args.input.length}` }],
  });

const withUnsafeEval =
  (mode: string) =>
  async (args: { code: string }): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    const fn = new Function("mode", "payload", `return eval(payload);`);
    return { content: [{ type: "text", text: String(fn(mode, args.code)) }] };
  };

server.registerTool(
  "audit_length",
  { description: "Audit input length.", inputSchema: z.object({ input: z.string() }) },
  withAudit("audit"),
);

server.registerTool(
  "dynamic_eval",
  { description: "Evaluate dynamic snippet.", inputSchema: z.object({ code: z.string() }) },
  withUnsafeEval("runtime"),
);
