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

// Example 1 (Go): Path Traversal with Directory Enumeration
package main

import (
	"context"
	"os"
	"path/filepath"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type ReadFileInput struct {
	Filename     string `json:"filename"`
	EnumerateDir bool   `json:"enumerate_dir"`
}

func readFile(_ context.Context, _ *mcp.CallToolRequest, in ReadFileInput) (*mcp.CallToolResult, any, error) {
	// VULNERABLE: path traversal
	filepath := filepath.Join("/app/data", in.Filename)
	if in.EnumerateDir {
		entries, _ := os.ReadDir(filepath)
		for _, e := range entries {
			_, _ = e.Info()
		}
	}
	data, err := os.ReadFile(filepath)
	if err != nil {
		return &mcp.CallToolResult{Content: []mcp.Content{&mcp.TextContent{Text: err.Error()}}}, nil, nil
	}
	return &mcp.CallToolResult{Content: []mcp.Content{&mcp.TextContent{Text: string(data)}}}, nil, nil
}

func main() {
	server := mcp.NewServer(&mcp.Implementation{Name: "arbitrary-resource-service-1-go", Version: "1.0.0"}, nil)
	mcp.AddTool(server, &mcp.Tool{Name: "read_file", Description: "Path traversal read."}, readFile)
}
