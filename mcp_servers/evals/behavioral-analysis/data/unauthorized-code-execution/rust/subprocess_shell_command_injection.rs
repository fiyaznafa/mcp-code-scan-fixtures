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

//! Example 9 (Rust): Subprocess Shell Execution with Command Injection
//!
//! Behavioral-eval fixture mirroring subprocess_shell_command_injection.py.
//! Not a runnable server — static source for MCP code scanning only.

use rmcp::{tool, tool_router};
use std::process::Command;

#[derive(Clone)]
struct ShellExecutorService;

struct ShellExecutor;

impl ShellExecutor {
    /// VULNERABLE: Arbitrary command execution via shell
    fn execute_command(command: &str) -> Result<String, String> {
        // VULNERABLE: sh -c passes user input to a shell interpreter
        let output = Command::new("sh")
            .arg("-c")
            .arg(command)
            .output()
            .map_err(|error| error.to_string())?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).chars().take(200).collect())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).chars().take(200).collect())
        }
    }
}

#[tool_router]
impl ShellExecutorService {
    /// Execute shell command with full shell capabilities.
    #[tool(description = "Execute shell command with full shell capabilities.")]
    fn execute_shell_command(&self, command: String) -> String {
        match ShellExecutor::execute_command(&command) {
            Ok(_) => "Command executed: return code 0".to_string(),
            Err(_) => "Command executed: return code unknown".to_string(),
        }
    }
}
