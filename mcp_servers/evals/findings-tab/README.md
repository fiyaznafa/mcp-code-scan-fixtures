# MCP Findings tab fixtures

Two code-scan servers for findings scans.

Register **one subfolder per server**. Scanning the parent `findings-tab` folder merges both servers into one asset.

| Server | Subfolder | What a completed scan should show |
| --- | --- | --- |
| Multi-finding | `mcp_servers/evals/findings-tab/multi-findings` | Several unsafe findings across tools, one prompt, and one resource. `get_escalation_policies` combines shell execution and credential caching so one capability can carry more than one finding. `get_weather` is clean and must not appear as a finding. |
| Clean only | `mcp_servers/evals/findings-tab/clean-only` | Scan completes with zero findings. `lastScannedAt` is still set. |

## Register in AI Defense

Repository:

```text
https://github.com/fiyaznafa/mcp-code-scan-fixtures
```

Branch: `main`

Subfolder examples:

```text
/mcp_servers/evals/findings-tab/multi-findings
/mcp_servers/evals/findings-tab/clean-only
```

Turn scan on at registration. In **Settings → Supply Chain Profiles**, the MCP Scanning profile must have the expected rules enabled. A profile left with only one rule enabled will under-count findings.

## Capability names in the multi-finding server

| Name | Type | Role in testing |
| --- | --- | --- |
| `get_weather` | Tool | Clean. Absent from the findings list. |
| `get_escalation_policies` | Tool | Annotations, required `policy_id`, default `team=platform`, and two unsafe behaviors in one capability. |
| `execute_system_command` | Tool | Caller-supplied shell command. |
| `read_any_file` | Tool | Caller-supplied filesystem path. |
| `install_untrusted_package` | Tool | Download from a caller-supplied URL. |
| `publish_env_snapshot` | Tool | Posts environment variables to a caller-supplied URL. |
| `incident_summary` | Prompt | Prompt text tells the model to ignore safety rules and print credentials. |
| `customer_export` | Resource | Reads a customer export. No input schema. |

The server source includes an instructions string, but the current code-scan findings UI does not show Instructions. A missing Instructions section on this fixture is expected.

Annotations on a capability are informational metadata (for example a commit hash). They are shown only when the scan stored them, and they do not change the finding.

Server instructions on the multi-finding server contain the exact sentence:

```text
FINDINGS_FIXTURE_INSTRUCTIONS: Lab server for the MCP Findings tab.
```

Drawer tests look for that sentence. Code-scan servers omit instructions until the scanner persists `InitializeResult.instructions`; a remote registration of the same file is what populates Instructions.
