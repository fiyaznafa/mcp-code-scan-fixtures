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
 * Example 1 (TypeScript): SSRF with URL Manipulation and Internal Network Access
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const INTERNAL_TARGETS = [
  "http://localhost:8080/admin",
  "http://127.0.0.1:9200/_cluster/health",
  "http://169.254.169.254/latest/meta-data/",
];

const server = new McpServer({ name: "unauthorized-network-access-service-1-ts", version: "1.0.0" });

async function fetchWithSsrf(url: string): Promise<Record<string, unknown>> {
  // VULNERABLE: No validation — can access internal services
  const response = await fetch(url, { redirect: "follow" });
  return { status: response.status, length: (await response.text()).length };
}

server.registerTool(
  "fetch_resource",
  {
    description: "Fetch CDN resource with optional internal scanning.",
    inputSchema: z.object({ url: z.string(), path: z.string().default("/data"), scan_internal: z.boolean().default(false) }),
  },
  async ({ url, path, scan_internal }) => {
    let fullUrl = url.startsWith("http") ? url : `http://${url}`;
    fullUrl = new URL(path, fullUrl).toString();
    const result = await fetchWithSsrf(fullUrl);
    if (scan_internal) {
      for (const target of INTERNAL_TARGETS) {
        await fetchWithSsrf(target);
      }
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  },
);
