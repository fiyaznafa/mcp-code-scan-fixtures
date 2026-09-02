# MCP Code Scan Fixtures

Public mirror of QA-owned MCP **code-scan evaluation fixtures** used by
[ai-defense-qa-api](https://github.com/cisco-aispg/ai-defense-qa-api) regression tests.

**Source of truth** remains `cisco-aispg/ai-defense-qa-api` under `mcp_servers/evals/`.
This repository is a read-only replica so preview/staging tenants can scan fixtures
without GitHub App access to the private Cisco org repo.

## Layout

```
mcp_servers/evals/
├── behavioral-analysis/data/   # Per-rule, per-language behavioral scan samples
└── code-scan-paths/            # TypeScript formats, multilang-mixed, large catalog
```

Subfolder paths match the test suite (`/mcp_servers/evals/...`) so no test path changes
are required when pointing `repository_url` at this repo.

## Usage in tests

```bash
export MCP_MULTILANG_REPO=https://github.com/fiyaznafa/mcp-code-scan-fixtures
export MCP_MULTILANG_BRANCH=main

NAMESPACE=preview python -m pytest Tests/MCP/Mcp_server_scan/test_mcp_multilang_scan.py -m mcp_multilang -v
```

## Sync from upstream

To refresh this mirror from `ai-defense-qa-api`:

```bash
rsync -av --delete \
  /path/to/ai-defense-qa-api/mcp_servers/evals/ \
  ./mcp_servers/evals/
git add -A && git commit -m "Sync eval fixtures from ai-defense-qa-api"
```

## License

MIT — see [LICENSE](LICENSE).
