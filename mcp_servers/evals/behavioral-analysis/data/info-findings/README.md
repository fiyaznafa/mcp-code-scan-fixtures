# INFO-severity code-scan fixtures (AIFW-28143)

Fixtures for validating **Template Manipulation / alignment** findings at **`INFO`** severity
in MCP **code scan** results.

## Background

| Ticket | Issue |
|--------|--------|
| [AIFW-17783](https://cisco-sbg.atlassian.net/browse/AIFW-17783) | UI showed **No threats found** while tool detail had findings marked **Safe** — root cause: `INFO` findings existed but were dropped from payload |
| [AIFW-28143](https://cisco-sbg.atlassian.net/browse/AIFW-28143) | Remove `INFO` filter in `mcp_code_scanner/analyzer.py`; include INFO in `findings`, `total_findings`, and logs |

## How INFO tools should display (expected after AIFW-28143)

### API / scan report

- Each tool with INFO-only findings appears in `POST /v1/mcp/servers/{id}/scan/report` items.
- Threat entries include `"severity": "INFO"` (not filtered out).
- `total_findings` counts INFO rows (same as HIGH/MEDIUM/LOW).
- Tool-level `severity` / `is_safe`: max non-INFO severity; INFO-only tools should **not** be treated as HIGH/LOW threats.

### UI (Deep dive)

| Surface | Expected |
|---------|----------|
| **Overview threat summary** | INFO findings contribute to informational counts (not mixed into Critical/High/Medium/Low vulnerability totals). |
| **Tools list row** | Must **not** show **No threats found** when INFO findings exist. Expect an informational indicator (e.g. **Info**), distinct from **No threats found** and from **High risk**. |
| **Tool side panel** | INFO findings listed with severity **Info**, description, source file, line evidence. |
| **Severity filter** | INFO selectable/filterable separately from Safe and from High/Medium/Low. |

### Distinction from SAFE

- **SAFE** — no meaningful finding; row may show **No threats found**.
- **INFO** — informational alignment/template finding (docstring vs implementation); **visible** but **not a vulnerability**.

## Registration (code scan)

```text
repositoryUrl: https://github.com/cisco-aispg/ai-defense-qa-api
sourceIdentifier: develop
subfolder: /mcp_servers/evals/behavioral-analysis/data/info-findings
scanEnabled: true
```

Enable rule: **Malicious Code Execution and Template Manipulation** (`RULE_TYPE_MCP_SCANNING_MALICIOUS_PAYLOAD`).

## Files

| File | Tool | INFO trigger pattern |
|------|------|----------------------|
| `docstring_implementation_mismatch.py` | `get_public_metadata` | Docstring: read-only public metadata; impl reads env + home path |
| `parameter_description_mismatch.py` | `search_records` | Schema says `limit` optional; impl requires positive limit |
| `declaration_alignment_gap.py` | `export_summary` | Claims CSV export only; impl also writes debug JSON sidecar |
