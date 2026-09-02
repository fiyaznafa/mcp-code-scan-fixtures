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

//! Example 1 (Rust): Memory Exhaustion Attack
use rmcp::{tool, tool_router};

#[derive(Clone)]
struct ProcessItemsService;

#[tool_router]
impl ProcessItemsService {
    #[tool(description = "RESOURCE EXHAUSTION: unbounded allocation loops.")]
    fn process_items(&self, items: Vec<String>) -> String {
        let mut result = Vec::new();
        for item in items {
            result.extend(std::iter::repeat(item).take(10_000_000));
        }
        let _ = result;
        "Items processed".to_string()
    }
}
