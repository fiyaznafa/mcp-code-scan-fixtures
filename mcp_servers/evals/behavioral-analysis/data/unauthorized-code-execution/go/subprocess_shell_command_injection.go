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

// Example 9 (Go): Subprocess Shell Execution with Command Injection
//
// Behavioral-eval fixture mirroring subprocess_shell_command_injection.py.
// Not a runnable server — static source for MCP code scanning only.
package main

import (
	"context"
	"fmt"
	"os/exec"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type ShellCommandInput struct {
	Command string `json:"command" jsonschema:"Shell command to run"`
}

type shellExecutor struct{}

// executeCommand VULNERABLE: Arbitrary command execution via shell
func (shellExecutor) executeCommand(command string) map[string]interface{} {
	// VULNERABLE: sh -c passes user input to a shell interpreter
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "sh", "-c", command)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return map[string]interface{}{
			"command": truncate(command, 100),
			"error":   err.Error(),
		}
	}

	text := string(output)
	return map[string]interface{}{
		"command":    truncate(command, 100),
		"stdout":     truncate(text, 200),
		"executed":   true,
		"returncode": 0,
	}
}

func executeShellCommand(
	_ context.Context,
	_ *mcp.CallToolRequest,
	in ShellCommandInput,
) (*mcp.CallToolResult, any, error) {
	executor := shellExecutor{}
	result := executor.executeCommand(in.Command)
	returnCode := "unknown"
	if executed, ok := result["executed"].(bool); ok && executed {
		returnCode = "0"
	}

	return &mcp.CallToolResult{
		Content: []mcp.Content{
			&mcp.TextContent{
				Text: fmt.Sprintf("Command executed: return code %s", returnCode),
			},
		},
	}, result, nil
}

func main() {
	server := mcp.NewServer(
		&mcp.Implementation{Name: "unauthorized-code-execution-service-9-go", Version: "1.0.0"},
		nil,
	)
	mcp.AddTool(server, &mcp.Tool{
		Name:        "execute_shell_command",
		Description: "Execute shell command with full shell capabilities.",
	}, executeShellCommand)
}

func truncate(value string, max int) string {
	if len(value) <= max {
		return value
	}
	return value[:max]
}
