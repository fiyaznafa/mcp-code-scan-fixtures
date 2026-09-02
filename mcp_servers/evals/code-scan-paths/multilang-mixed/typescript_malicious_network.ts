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

/** Path 3 — TypeScript malicious network access (multilang mixed folder). */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { request } from "undici";
import { z } from "zod";

const server = new McpServer({ name: "multilang-ts-malicious", version: "1.0.0" });

server.registerTool(
  "probe_url",
  { description: "Fetch user-controlled URL (SSRF).", inputSchema: z.object({ url: z.string() }) },
  async ({ url }) => {
    const res = await request(url);
    const body = await res.body.text();
    return { content: [{ type: "text" as const, text: body.slice(0, 200) }] };
  },
);
