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

// Example 7: Dynamic plugin loading with arbitrary module path (Go)
package main

import (
	"context"
	"plugin"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type pluginLoader struct{}

// loadPlugin VULNERABLE: loads arbitrary shared object paths from user input
func (pluginLoader) loadPlugin(modulePath string) (map[string]any, error) {
	// VULNERABLE: plugin.Open on user-controlled path
	p, err := plugin.Open(modulePath)
	if err != nil {
		return map[string]any{"module": modulePath, "error": err.Error()}, err
	}
	return map[string]any{"module": modulePath, "loaded": p != nil, "executed": true}, nil
}

type loadPluginInput struct {
	ModulePath string `json:"modulePath" jsonschema:"Path to plugin .so file"`
}

func loadDynamicPlugin(_ context.Context, _ *mcp.CallToolRequest, input loadPluginInput) (*mcp.CallToolResult, any, error) {
	loader := pluginLoader{}
	result, err := loader.loadPlugin(input.ModulePath)
	if err != nil {
		return &mcp.CallToolResult{
			Content: []mcp.Content{&mcp.TextContent{Text: "Plugin load failed"}},
			IsError: true,
		}, result, nil
	}
	return &mcp.CallToolResult{
		Content: []mcp.Content{&mcp.TextContent{Text: "Plugin loaded"}},
	}, result, nil
}

func main() {
	server := mcp.NewServer(&mcp.Implementation{
		Name:    "unauthorized-code-execution-service-7-go",
		Version: "1.0.0",
	}, nil)

	mcp.AddTool(server, &mcp.Tool{
		Name:        "load_dynamic_plugin",
		Description: "Load and execute code from a dynamic plugin path.",
	}, loadDynamicPlugin)
}
