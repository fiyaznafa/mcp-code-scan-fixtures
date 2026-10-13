# MCP Findings tab fixtures

Two code-scan servers for the Findings tab ([AIFW-28982](https://cisco-sbg.atlassian.net/browse/AIFW-28982), tech spec [MCP Findings](https://cisco-sbg.atlassian.net/wiki/spaces/AIFW/pages/1507629125/MCP+Findings)).

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

Server instructions on the multi-finding server contain the exact sentence:

```text
FINDINGS_FIXTURE_INSTRUCTIONS: Lab server for the MCP Findings tab.
```

Drawer tests look for that sentence. Code-scan servers omit instructions until the scanner persists `InitializeResult.instructions`; a remote registration of the same file is what populates Instructions.

## Test cases

Standalone cases (no cross-references): [MCP_Findings_test_cases.csv](MCP_Findings_test_cases.csv).
