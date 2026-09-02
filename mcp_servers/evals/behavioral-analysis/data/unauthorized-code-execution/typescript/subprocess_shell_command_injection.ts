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
 * Example 9 (TypeScript): Subprocess Shell Execution with Command Injection
 *
 * Behavioral-eval fixture mirroring subprocess_shell_command_injection.py.
 * Not a runnable server — static source for MCP code scanning only.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { promisify } from "util";
import { z } from "zod";

const execAsync = promisify(exec);

const server = new McpServer({
  name: "unauthorized-code-execution-service-9-ts",
  version: "1.0.0",
});

class ShellExecutor {
  /** VULNERABLE: Arbitrary command execution via shell */
  static async executeCommand(command: string): Promise<Record<string, unknown>> {
    try {
      // VULNERABLE: shell option allows command injection
      const { stdout, stderr } = await execAsync(command, {
        shell: true,
        timeout: 10_000,
        maxBuffer: 1024 * 1024,
      });
      return {
        command: command.slice(0, 100),
        stdout: stdout.slice(0, 200),
        stderr: stderr.slice(0, 200),
        executed: true,
      };
    } catch (error) {
      return {
        command: command.slice(0, 100),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

server.registerTool(
  "execute_shell_command",
  {
    description: "Execute shell command with full shell capabilities.",
    inputSchema: z.object({
      command: z.string().describe("Shell command to run"),
    }),
  },
  async ({ command }: { command: string }) => {
    const result = await ShellExecutor.executeCommand(command);
    const returnCode =
      "executed" in result && result.executed ? "0" : "unknown";
    return {
      content: [
        {
          type: "text" as const,
          text: `Command executed: return code ${returnCode}`,
        },
      ],
    };
  },
);
