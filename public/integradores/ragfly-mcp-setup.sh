#!/usr/bin/env bash
# ragfly-mcp-setup.sh — connect an AI agent to RAGfly over MCP with an API key.
# macOS / Linux. (Windows: use ragfly-mcp-setup.ps1.)
#
# Needs only bash and curl — no Node.js, no Python. What it does:
#   1. Checks your API key against GET /v1/session (a bad key writes nothing).
#   2. Stores it in ~/.ragfly/ragfly-mcp.env  (file mode 600, folder 700).
#   3. Installs a small launcher, ~/.ragfly/bin/ragfly-mcp.sh. It reads that file
#      and bridges the client's stdio to RAGfly's MCP endpoint over HTTPS. The key
#      lives ONLY in the .env file: never in a client config, a project file or a
#      command line.
#   4. Optionally registers the launcher in your client (--client).
#
# The API key is created by a person at https://app.ragfly.ai/api-keys (shown
# once). Pass it in one of these ways — never as an argument (arguments show up
# in `ps`):
#     RAGFLY_API_KEY=rf_... bash ragfly-mcp-setup.sh
#     printf '%s\n' "$KEY" | bash ragfly-mcp-setup.sh --key-stdin
#     bash ragfly-mcp-setup.sh                     # asks for it, no echo
#
# Options:
#   --client NAME   register the launcher in: claude-code | codex | claude-desktop
#                   (default: none; the script prints how to do it by hand)
#   --key-stdin     read the key from standard input (for agents)
#   --verify        only check the key already stored; write nothing
#   --test          after setup, call the MCP `session` tool through the launcher
#   -h, --help      this help
#
# Only the production environment (api.ragfly.ai) is configured. An existing
# ragfly-mcp.env keeps any other lines it has; a .bak-<timestamp> copy is saved
# first. Revoke the key at https://app.ragfly.ai/api-keys.
set -euo pipefail

API_URL="${RAGFLY_API_URL:-https://api.ragfly.ai}"
DIR="$HOME/.ragfly"
ENV_FILE="$DIR/ragfly-mcp.env"
LAUNCHER="$DIR/bin/ragfly-mcp.sh"

client="none"; from_stdin=0; only_verify=0; run_test=0
while [ $# -gt 0 ]; do
  case "$1" in
    --client)    [ $# -ge 2 ] || { echo "--client needs a value" >&2; exit 2; }; client="$2"; shift ;;
    --key-stdin) from_stdin=1 ;;
    --verify)    only_verify=1 ;;
    --test)      run_test=1 ;;
    -h|--help)   sed -n '2,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 2 ;;
  esac
  shift
done
case "$client" in none|claude-code|codex|claude-desktop) ;; *) echo "Unknown client: $client" >&2; exit 2 ;; esac

die() { echo "ERROR: $*" >&2; exit 1; }

# GET /v1/session with the key kept out of the command line. Returns 0 on HTTP 200.
check_key() {
  local key="$1" out code
  out="$(mktemp)"
  code="$(printf 'header = "Authorization: Bearer %s"\n' "$key" |
    curl -sS --max-time 25 -K - -o "$out" -w '%{http_code}' "$API_URL/v1/session" 2>/dev/null || true)"
  if [ "$code" = "200" ]; then
    # Human-readable summary without needing jq or python.
    printf '  organization: %s | workspace: %s | profile: %s\n' \
      "$(sed -n 's/.*"active_group" *: *"\([^"]*\)".*/\1/p' "$out" | head -n 1)" \
      "$(sed -n 's/.*"active_workspace" *: *"\([^"]*\)".*/\1/p' "$out" | head -n 1)" \
      "$(sed -n 's/.*"profile" *: *"\([^"]*\)".*/\1/p' "$out" | head -n 1)"
    rm -f "$out"; return 0
  fi
  rm -f "$out"
  case "$code" in
    401)    echo "The key was rejected (401): mistyped, revoked, or from another environment." >&2 ;;
    000|"") echo "Could not reach $API_URL (no network, DNS, or a sandbox without outbound access)." >&2 ;;
    *)      echo "Unexpected answer from $API_URL/v1/session: HTTP $code." >&2 ;;
  esac
  return 1
}

stored_key() {
  local k
  k="$(sed -n 's/^RAGFLY_API_KEY_PROD=//p' "$ENV_FILE" 2>/dev/null | head -n 1)"
  printf '%s' "${k//[\'\"]/}"
}

# ---- --verify ----------------------------------------------------------------
if [ "$only_verify" = 1 ]; then
  [ -f "$ENV_FILE" ] || die "$ENV_FILE does not exist. Run this script without --verify."
  key="$(stored_key)"; [ -n "$key" ] || die "$ENV_FILE has no RAGFLY_API_KEY_PROD."
  check_key "$key" || exit 1
  echo "OK: the key stored in $ENV_FILE works."
  exit 0
fi

# ---- prerequisites -------------------------------------------------------------
command -v curl >/dev/null 2>&1 || die "curl is required."

# ---- get the key -----------------------------------------------------------------
key="${RAGFLY_API_KEY:-}"
if [ -z "$key" ] && [ "$from_stdin" = 1 ]; then
  IFS= read -r key || true
elif [ -z "$key" ] && [ -t 0 ]; then
  printf 'Paste your RAGfly API key (rf_..., not shown as you type): ' >&2
  IFS= read -r -s key || true
  printf '\n' >&2
fi
key="${key//[[:space:]]/}"
[ -n "$key" ] || die "no key received. Create one at https://app.ragfly.ai/api-keys and pass it with RAGFLY_API_KEY, --key-stdin or the prompt."
case "$key" in rf_*|slm_live_*) ;; *) die "an API key starts with rf_ (did you copy something else?)." ;; esac
case "$key" in *[!A-Za-z0-9_-]*) die "the key has characters that are not valid." ;; esac

echo "Checking the key against $API_URL ..." >&2
check_key "$key" || die "nothing was written: the key could not be validated."

# ---- store the key ---------------------------------------------------------------
umask 077
mkdir -p "$DIR/bin"; chmod 700 "$DIR"
tmp="$(mktemp "$DIR/.ragfly-mcp.env.XXXXXX")"
trap 'rm -f "$tmp"' EXIT
if [ -f "$ENV_FILE" ]; then
  backup="$ENV_FILE.bak-$(date +%Y%m%d%H%M%S)"
  cp -p "$ENV_FILE" "$backup"; chmod 600 "$backup"
  grep -v -E '^(RAGFLY_MCP_ENVIRONMENT|RAGFLY_API_KEY_PROD)=' "$ENV_FILE" > "$tmp" || true
  echo "Saved the previous file as $backup" >&2
else
  {
    echo "# RAGfly MCP credential for THIS computer. Do not share it or commit it."
    echo "# Written by ragfly-mcp-setup.sh. Revoke the key at https://app.ragfly.ai/api-keys"
  } > "$tmp"
fi
printf 'RAGFLY_MCP_ENVIRONMENT=prod\nRAGFLY_API_KEY_PROD=%s\n' "$key" >> "$tmp"
chmod 600 "$tmp"; mv "$tmp" "$ENV_FILE"; trap - EXIT
echo "Stored the key in $ENV_FILE (production, mode 600)."

# ---- install the launcher ----------------------------------------------------------
# A stdio <-> Streamable HTTP bridge in plain bash + curl. The MCP endpoint keeps
# no session: each JSON-RPC message the client writes (one per line) is POSTed on
# its own, and the answer (JSON, or text/event-stream `data:` lines) is written
# back. Notifications get HTTP 202 and no output. The file holds no secret.
cat > "$LAUNCHER" <<'LAUNCHER_EOF'
#!/usr/bin/env bash
# RAGfly MCP launcher (stdio <-> Streamable HTTP). Generated by ragfly-mcp-setup.sh;
# safe to regenerate. Reads the key from ~/.ragfly/ragfly-mcp.env; holds no secret.
set -uo pipefail
env_file="${RAGFLY_MCP_ENV_FILE:-$HOME/.ragfly/ragfly-mcp.env}"
[ -f "$env_file" ] || { echo "Missing $env_file. Run ragfly-mcp-setup.sh." >&2; exit 1; }
set -a; . "$env_file"; set +a
key="${RAGFLY_API_KEY_PROD:-${RAGFLY_API_KEY:-}}"
[ -n "$key" ] || { echo "No RAGFLY_API_KEY_PROD in $env_file." >&2; exit 1; }
url="${RAGFLY_API_URL:-https://api.ragfly.ai}/mcp-http/"
body="$(mktemp)"; trap 'rm -f "$body"' EXIT

while IFS= read -r line || [ -n "$line" ]; do
  line="${line%$'\r'}"
  [ -n "$line" ] || continue
  id="$(printf '%s' "$line" | grep -o '"id" *: *\("[^"]*"\|[0-9][0-9]*\)' | head -n 1 | sed 's/^"id" *: *//')"
  info="$(printf 'header = "Authorization: Bearer %s"\n' "$key" |
    curl -sS --max-time 600 -K - -X POST \
      -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
      --data-binary "$line" -o "$body" -w '%{http_code} %{content_type}' "$url" 2>/dev/null)" || info="000 "
  code="${info%% *}"; ctype="${info#* }"
  case "$code" in
    2*)
      case "$ctype" in
        text/event-stream*) tr -d '\r' < "$body" | sed -n 's/^data: \{0,1\}//p' ;;
        *) [ -s "$body" ] && tr -d '\r\n' < "$body" && printf '\n' ;;
      esac ;;
    *)
      echo "RAGfly MCP: HTTP $code from $url" >&2
      [ -n "$id" ] && printf '{"jsonrpc":"2.0","id":%s,"error":{"code":-32001,"message":"RAGfly request failed (HTTP %s)"}}\n' "$id" "$code" ;;
  esac
done
LAUNCHER_EOF
chmod 755 "$LAUNCHER"
echo "Installed the launcher at $LAUNCHER"

# ---- register the client -------------------------------------------------------------
case "$client" in
  claude-code)
    command -v claude >/dev/null 2>&1 || die "the claude CLI is not on PATH."
    if add_out="$(claude mcp add --scope user ragfly -- "$LAUNCHER" 2>&1)"; then
      echo "Registered 'ragfly' in Claude Code (user scope). Open /mcp or start a new session."
    elif printf '%s' "$add_out" | grep -qi "already exists"; then
      echo "Claude Code already has a user-level server named ragfly; left as is. To replace it: claude mcp remove --scope user ragfly" >&2
    else
      die "claude mcp add failed: $add_out"
    fi ;;
  codex)
    command -v codex >/dev/null 2>&1 || die "the codex CLI is not on PATH."
    codex mcp add ragfly -- "$LAUNCHER"
    echo "Registered 'ragfly' in Codex. Check with: codex mcp list" ;;
  claude-desktop)
    cfg="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    if command -v python3 >/dev/null 2>&1; then
      mkdir -p "$(dirname "$cfg")"
      [ -f "$cfg" ] && cp -p "$cfg" "$cfg.bak-ragfly"
      python3 -I - "$cfg" "$LAUNCHER" <<'PY'
import json, os, sys
path, launcher = sys.argv[1], sys.argv[2]
cfg = {}
if os.path.exists(path) and os.path.getsize(path):
    cfg = json.load(open(path))
cfg.setdefault("mcpServers", {})["ragfly"] = {"command": launcher}
tmp = path + ".tmp"
json.dump(cfg, open(tmp, "w"), indent=2); open(tmp, "a").write("\n")
os.replace(tmp, path)
PY
      echo "Added 'ragfly' to Claude Desktop (backup: $cfg.bak-ragfly)."
      echo "Quit Claude Desktop completely (Cmd+Q) and reopen it; it reads the file only at startup."
    else
      echo "python3 is not available to edit $cfg safely. Add this under \"mcpServers\" by hand"
      echo "(Claude Desktop > Settings > Developer > Edit config), then quit with Cmd+Q and reopen:"
      echo "  \"ragfly\": { \"command\": \"$LAUNCHER\" }"
    fi ;;
  none)
    cat <<EOF

Next, register the launcher in your client (it needs no key in its config):
  Claude Code:    claude mcp add --scope user ragfly -- $LAUNCHER
  Codex:          codex mcp add ragfly -- $LAUNCHER
  Claude Desktop: in claude_desktop_config.json add  "ragfly": { "command": "$LAUNCHER" }  under mcpServers
or run this script again with  --client claude-code | codex | claude-desktop
EOF
    ;;
esac

# ---- optional end-to-end test ----------------------------------------------------------
if [ "$run_test" = 1 ]; then
  echo "Calling the MCP 'session' tool through the launcher ..." >&2
  reply="$( { printf '%s\n' \
      '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"ragfly-mcp-setup","version":"1"}}}' \
      '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
      '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"session","arguments":{}}}'
      } | env -i HOME="$HOME" PATH="/usr/bin:/bin" "$LAUNCHER" 2>/dev/null || true)"
  if printf '%s' "$reply" | grep -Eq 'authenticated[^a-z]+true'; then
    echo "OK: the MCP session call answered authenticated: true."
  else
    echo "The MCP session call did not confirm the connection. Check the network, then run: bash ragfly-mcp-setup.sh --verify" >&2
    exit 1
  fi
fi
echo "Done. Ask your agent to call the 'session' tool to confirm."
