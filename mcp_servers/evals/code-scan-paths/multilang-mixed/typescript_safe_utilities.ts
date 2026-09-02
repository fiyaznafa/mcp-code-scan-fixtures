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

/** Path 3 — TypeScript safe utilities (multilang mixed folder). */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "multilang-ts-safe", version: "1.0.0" });

server.registerTool(
  "capitalize_words",
  { description: "Capitalize each word.", inputSchema: z.object({ text: z.string() }) },
  async ({ text }) => ({
    content: [{ type: "text" as const, text: text.replace(/\b\w/g, (m) => m.toUpperCase()) }],
  }),
);
