# Multi-language behavioral fixtures (prototype)

QA-owned prototype samples for **per-language malicious code scan** validation (AIFW-23242).
Python baselines remain in each category root (`.py` files). Non-Python samples live in
`{category}/{typescript,go,rust}/` (QA prototypes; extend as Threat/OSS delivers AITRAP-29061 corpus).

## Layout

```
unauthorized-code-execution/
├── *.py                          # Python (existing, 9 files)
├── typescript/
│   ├── subprocess_shell_command_injection.ts
│   └── unrestricted_eval_code_injection.ts
├── go/
│   ├── subprocess_shell_command_injection.go
│   └── dynamic_plugin_code_execution.go
└── rust/
    ├── subprocess_shell_command_injection.rs
    └── unsafe_dynamic_library_loading.rs
```

Future rule categories should mirror this pattern:
`{rule-category}/{language}/<sample>.{ext}`

## Preview scan (GitHub code scan)

The behavioral analyzer reads **GitHub source** only (no local path upload). Push a branch, then register:

| Language | Subfolder |
|----------|-----------|
| Python only | `/mcp_servers/evals/behavioral-analysis/data/<category>` (category root; matrix asserts `.py` sourceFile only) |
| TypeScript | `/mcp_servers/evals/behavioral-analysis/data/unauthorized-code-execution/typescript` |
| Go | `/mcp_servers/evals/behavioral-analysis/data/unauthorized-code-execution/go` |
| Rust | `/mcp_servers/evals/behavioral-analysis/data/unauthorized-code-execution/rust` |

Example registration:

- **Repo:** `https://github.com/cisco-aispg/ai-defense-qa-api`
- **Branch:** `develop` (override with `MCP_MULTILANG_BRANCH` for preview/feature branches)
- **Rule:** enable only `RULE_TYPE_MCP_SCANNING_MALICIOUS_PAYLOAD` (Malicious Code Execution)

## Automation follow-up

1. Parametrize `TestMCPScanRulesCodeScan` with `(language, subfolder)` once preview confirms detections.
2. Extend to remaining rule categories under `behavioral-analysis/data/`.
3. Align naming with Threat paired fixtures for AIFW-25459 parity testing.

### Pytest (automated)

```bash
# Full matrix: 10 rules × 4 languages (TS malicious-code-execution xfail: AIFW-27933)
NAMESPACE=preview .venv/bin/python -m pytest \
  Tests/MCP/Mcp_server_scan/test_mcp_multilang_scan.py -m mcp_multilang -v

# Evidence parity (Go/Rust) + paired shell-injection parity (AIFW-25459)
NAMESPACE=preview .venv/bin/python -m pytest \
  Tests/MCP/Mcp_server_scan/test_mcp_multilang_scan.py::TestMCPMultilangEvidenceParity -v

# Override fixture branch
MCP_MULTILANG_BRANCH=develop \
  NAMESPACE=preview .venv/bin/python -m pytest Tests/MCP/Mcp_server_scan/test_mcp_multilang_scan.py -m mcp_multilang
```

| Module | Purpose |
|--------|---------|
| `Tests/MCP/Mcp_server_scan/multilang_scan_config.py` | Rule×language matrix, paired fixtures, known bugs |
| `Tests/MCP/Mcp_server_scan/multilang_scan_helpers.py` | Scan wait, evidence validation, positive detection |
| `Tests/MCP/Mcp_server_scan/test_mcp_multilang_scan.py` | Matrix + evidence + AIFW-25459 parity tests |

TypeScript malicious-code-execution cases are `xfail` (AIFW-27933). All rule categories now have TS/Go/Rust prototype fixtures under `{category}/{lang}/`.
