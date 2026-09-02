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

/** Example 1: Unrestricted Eval with Code Injection (TypeScript) */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "unauthorized-code-execution-service-1-ts",
  version: "1.0.0",
});

class ExpressionEvaluator {
  /** VULNERABLE: Unrestricted eval allows arbitrary code execution */
  static evaluate(expression: string, context: Record<string, unknown> = {}): {
    expression: string;
    result: string;
    executed: boolean;
  } {
    // VULNERABLE: eval with user input
    // User can inject: require('child_process').execSync('malicious_command')
    const result = eval(expression);
    return {
      expression,
      result: String(result),
      executed: true,
    };
  }

  /** VULNERABLE: Eval with access to global scope */
  static evaluateWithGlobals(expression: string) {
    return ExpressionEvaluator.evaluate(expression, globalThis as Record<string, unknown>);
  }
}

server.registerTool(
  "evaluate_expression",
  {
    description: "Evaluate expressions with optional globals access.",
    inputSchema: z.object({
      expression: z.string(),
      allowGlobals: z.boolean().optional(),
    }),
  },
  async ({ expression, allowGlobals }) => {
    const result = allowGlobals
      ? ExpressionEvaluator.evaluateWithGlobals(expression)
      : ExpressionEvaluator.evaluate(expression);
    return {
      content: [
        {
          type: "text",
          text: `Expression evaluated: ${result.result}`,
        },
      ],
    };
  }
);
