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

//! Example 7: Dynamic library loading from user-controlled path (Rust)

use std::ffi::CString;

struct DynamicLoader;

impl DynamicLoader {
    /// VULNERABLE: loads arbitrary native libraries from user input
    unsafe fn load_library(path: &str) -> bool {
        // VULNERABLE: libloading on user-controlled path enables arbitrary code execution
        let c_path = CString::new(path).expect("invalid path");
        let lib = libloading::Library::new(c_path.as_c_str());
        lib.is_ok()
    }
}

/// Load and execute code from a dynamic library path.
#[tool(description = "Load and execute code from a dynamic library path.")]
fn load_dynamic_library(library_path: String) -> String {
    // VULNERABLE: unsafe dynamic load of user-supplied library
    let loaded = unsafe { DynamicLoader::load_library(&library_path) };
    format!("Library loaded: {loaded}")
}

fn main() {
    let server = McpServer::new("unauthorized-code-execution-service-7-rs");
    server.register_tool(load_dynamic_library);
}
