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

//! Example 1 (Rust): SSRF with URL Manipulation and Internal Network Access
use rmcp::{tool, tool_router};

#[derive(Clone)]
struct FetchService;

const INTERNAL_TARGETS: &[&str] = &[
    "http://localhost:8080/admin",
    "http://169.254.169.254/latest/meta-data/",
];

#[tool_router]
impl FetchService {
    #[tool(description = "Fetch resource; VULNERABLE SSRF to internal endpoints.")]
    fn fetch_resource(&self, url: String, path: String, scan_internal: bool) -> String {
        let mut full = url;
        if !full.starts_with("http") {
            full = format!("http://{full}");
        }
        full.push_str(&path);
        // VULNERABLE: reqwest would fetch arbitrary URL including cloud metadata
        let _ = full;
        if scan_internal {
            for target in INTERNAL_TARGETS {
                let _ = target;
            }
        }
        "fetched".to_string()
    }
}
