#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${TGG_PROOF_MODE:-headless}"

run_smoke() {
  node "$SCRIPT_DIR/browser-smoke.mjs" "$@"
}

case "${MODE,,}" in
  headful|visible|ui|proof)
    if [[ -n "${DISPLAY:-}" ]]; then
      run_smoke "$@"
    elif command -v xvfb-run >/dev/null 2>&1; then
      exec xvfb-run --auto-servernum --server-args="-screen 0 1280x1024x24" \
        node "$SCRIPT_DIR/browser-smoke.mjs" "$@"
    else
      echo "TGG browser proof requires a display. Install xvfb or provide DISPLAY." >&2
      exit 86
    fi
    ;;
  *)
    run_smoke "$@"
    ;;
esac
