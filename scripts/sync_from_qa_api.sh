#!/usr/bin/env bash
# Replicate eval fixtures from ai-defense-qa-api into this public mirror (no deletes from source).
set -euo pipefail

QA_API_ROOT="${QA_API_ROOT:-$HOME/Automation/ai-defense-qa-api}"
DEST_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${QA_API_ROOT}/mcp_servers/evals"
DEST="${DEST_ROOT}/mcp_servers/evals"

if [[ ! -d "$SRC" ]]; then
  echo "Source not found: $SRC" >&2
  echo "Set QA_API_ROOT to your ai-defense-qa-api checkout." >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
rsync -av --delete "$SRC/" "$DEST/"
echo "Synced $SRC -> $DEST"
echo "Review with: git -C $DEST_ROOT status"
