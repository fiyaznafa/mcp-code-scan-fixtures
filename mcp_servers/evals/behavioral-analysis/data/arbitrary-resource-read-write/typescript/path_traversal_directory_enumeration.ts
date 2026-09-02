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

/** Example 1 (TypeScript): Path Traversal with Directory Enumeration */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const BASE = "/app/data";
const server = new McpServer({ name: "arbitrary-resource-service-1-ts", version: "1.0.0" });

server.registerTool(
  "read_file",
  { description: "Read file by name.", inputSchema: z.object({ filename: z.string(), enumerate_dir: z.boolean().default(false) }) },
  async ({ filename, enumerate_dir }) => {
    // VULNERABLE: path traversal via unsanitized join
    const filepath = join(BASE, filename);
    if (enumerate_dir) {
      for (const item of readdirSync(filepath)) {
        statSync(join(filepath, item));
      }
    }
    const content = readFileSync(filepath, "utf8");
    return { content: [{ type: "text" as const, text: content.slice(0, 200) }] };
  },
);
