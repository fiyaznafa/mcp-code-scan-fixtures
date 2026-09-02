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

//! Example 1 (Rust): Path Traversal with Directory Enumeration
use rmcp::{tool, tool_router};
use std::fs;
use std::path::PathBuf;

#[derive(Clone)]
struct ReadFileService;

#[tool_router]
impl ReadFileService {
    #[tool(description = "VULNERABLE path traversal via unsanitized join.")]
    fn read_file(&self, filename: String, enumerate_dir: bool) -> String {
        let mut path = PathBuf::from("/app/data");
        path.push(filename);
        if enumerate_dir {
            if let Ok(entries) = fs::read_dir(&path) {
                for entry in entries.flatten() {
                    let _ = entry.path();
                }
            }
        }
        fs::read_to_string(path).unwrap_or_else(|e| e.to_string())
    }
}
