<#
.SYNOPSIS
  ragfly-mcp-setup.ps1 - connect an AI agent to RAGfly over MCP with an API key (Windows).

.DESCRIPTION
  Needs only Windows PowerShell 5.1 or later (already on Windows 10/11): no Node.js,
  no Python. macOS / Linux: use ragfly-mcp-setup.sh instead.

  1. Checks your API key against GET /v1/session (a bad key writes nothing).
  2. Stores it in %USERPROFILE%\.ragfly\ragfly-mcp.env, readable only by your user.
  3. Installs a small launcher, %USERPROFILE%\.ragfly\bin\ragfly-mcp.ps1, that reads that
     file and bridges the client's stdio to RAGfly's MCP endpoint over HTTPS. The key lives
     ONLY in the .env file: never in a client config, a project file or a command line.
  4. Optionally registers the launcher in your client (-Client).

  The API key is created by a person at https://app.ragfly.ai/api-keys (shown once). Pass it
  as $env:RAGFLY_API_KEY, with -KeyStdin (for agents), or let the script ask (no echo). Never
  as an argument: arguments are visible to other processes.

  Only the production environment (api.ragfly.ai) is configured. An existing ragfly-mcp.env
  keeps any other lines it has; a .bak-<timestamp> copy is saved first.

.PARAMETER Client
  none (default) | claude-code | codex | claude-desktop. Registers the launcher in that client.

.PARAMETER KeyStdin
  Read the key from standard input (for agents).

.PARAMETER Verify
  Only check the key already stored; write nothing.

.PARAMETER Test
  After setup, call the MCP `session` tool through the launcher.

.EXAMPLE
  $env:RAGFLY_API_KEY = 'rf_...'; powershell -NoProfile -ExecutionPolicy Bypass -File .\ragfly-mcp-setup.ps1 -Client claude-code -Test
#>
param(
  [ValidateSet('none', 'claude-code', 'codex', 'claude-desktop')][string]$Client = 'none',
  [switch]$KeyStdin,
  [switch]$Verify,
  [switch]$Test
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ApiUrl = $env:RAGFLY_API_URL
if (-not $ApiUrl) { $ApiUrl = 'https://api.ragfly.ai' }
$ApiUrl = $ApiUrl.TrimEnd('/')
$Dir = Join-Path $HOME '.ragfly'
$Bin = Join-Path $Dir 'bin'
$EnvFile = Join-Path $Dir 'ragfly-mcp.env'
$Launcher = Join-Path $Bin 'ragfly-mcp.ps1'
$Utf8 = New-Object System.Text.UTF8Encoding($false)

function Fail([string]$Message) { [Console]::Error.WriteLine("ERROR: $Message"); exit 1 }

# GET /v1/session. Returns $true on HTTP 200 and prints a one-line summary.
function Test-Key([string]$Key) {
  try {
    $r = Invoke-RestMethod -Uri "$ApiUrl/v1/session" -Headers @{ Authorization = "Bearer $Key" } -TimeoutSec 25 -ErrorAction Stop
    Write-Host ("  organization: {0} | workspace: {1} | profile: {2}" -f $r.active_group, $r.active_workspace, $r.profile)
    return $true
  } catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    if ($code -eq 401) { [Console]::Error.WriteLine('The key was rejected (401): mistyped, revoked, or from another environment.') }
    elseif ($code) { [Console]::Error.WriteLine("Unexpected answer from $ApiUrl/v1/session: HTTP $code.") }
    else { [Console]::Error.WriteLine("Could not reach $ApiUrl (no network, DNS, proxy, or a sandbox without outbound access).") }
    return $false
  }
}

function Get-StoredKey {
  if (-not (Test-Path -LiteralPath $EnvFile)) { return $null }
  foreach ($l in Get-Content -LiteralPath $EnvFile) {
    if ($l -match '^RAGFLY_API_KEY_PROD=(.*)$') { return $Matches[1].Trim().Trim('"').Trim("'") }
  }
  return $null
}

# Make a file readable only by the current user (drops inherited permissions).
function Protect-File([string]$Path) {
  $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  if (Get-Command icacls.exe -ErrorAction SilentlyContinue) {
    & icacls.exe $Path /inheritance:r /grant:r "$($env:USERNAME):(R,W)" 2>&1 | Out-Null
  } elseif (Get-Command chmod -ErrorAction SilentlyContinue) {
    & chmod 600 $Path 2>&1 | Out-Null
  }
  $ErrorActionPreference = $prev
}

# ---- -Verify ------------------------------------------------------------------
if ($Verify) {
  if (-not (Test-Path -LiteralPath $EnvFile)) { Fail "$EnvFile does not exist. Run this script without -Verify." }
  $stored = Get-StoredKey
  if (-not $stored) { Fail "$EnvFile has no RAGFLY_API_KEY_PROD." }
  if (-not (Test-Key $stored)) { exit 1 }
  Write-Host "OK: the key stored in $EnvFile works."
  exit 0
}

# ---- get the key ----------------------------------------------------------------
$key = $env:RAGFLY_API_KEY
if (-not $key -and $KeyStdin) { $key = [Console]::In.ReadLine() }
if (-not $key) {
  $secure = Read-Host 'Paste your RAGFLY API key (rf_..., not shown as you type)' -AsSecureString
  $key = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if ($key) { $key = ($key -replace '\s', '') }
if (-not $key) { Fail 'no key received. Create one at https://app.ragfly.ai/api-keys and pass it with $env:RAGFLY_API_KEY, -KeyStdin or the prompt.' }
if ($key -notmatch '^(rf_|slm_live_)[A-Za-z0-9_-]+$') { Fail 'an API key starts with rf_ and has only letters, digits, _ and - (did you copy something else?).' }

Write-Host "Checking the key against $ApiUrl ..."
if (-not (Test-Key $key)) { Fail 'nothing was written: the key could not be validated.' }

# ---- store the key --------------------------------------------------------------
New-Item -ItemType Directory -Force -Path $Bin | Out-Null
$lines = @()
if (Test-Path -LiteralPath $EnvFile) {
  $backup = "$EnvFile.bak-" + (Get-Date -Format 'yyyyMMddHHmmss')
  Copy-Item -LiteralPath $EnvFile -Destination $backup
  Protect-File $backup
  $lines = @(Get-Content -LiteralPath $EnvFile | Where-Object { $_ -notmatch '^(RAGFLY_MCP_ENVIRONMENT|RAGFLY_API_KEY_PROD)=' })
  [Console]::Error.WriteLine("Saved the previous file as $backup")
} else {
  $lines = @(
    '# RAGfly MCP credential for THIS computer. Do not share it or commit it.',
    '# Written by ragfly-mcp-setup.ps1. Revoke the key at https://app.ragfly.ai/api-keys'
  )
}
$lines += 'RAGFLY_MCP_ENVIRONMENT=prod'
$lines += "RAGFLY_API_KEY_PROD=$key"
$tmp = "$EnvFile.tmp"
[IO.File]::WriteAllLines($tmp, [string[]]$lines, $Utf8)
Protect-File $tmp
Move-Item -LiteralPath $tmp -Destination $EnvFile -Force
Write-Host "Stored the key in $EnvFile (production, current user only)."

# ---- install the launcher ---------------------------------------------------------
# A stdio <-> Streamable HTTP bridge. The MCP endpoint keeps no session: each JSON-RPC
# message the client writes (one per line) is POSTed on its own, and the answer (JSON,
# or text/event-stream `data:` lines) is written back. Notifications get HTTP 202 and no
# output. The file holds no secret.
$launcherBody = @'
# RAGfly MCP launcher (stdio <-> Streamable HTTP). Generated by ragfly-mcp-setup.ps1;
# safe to regenerate. Reads the key from ~/.ragfly/ragfly-mcp.env; holds no secret.
$ErrorActionPreference = 'Stop'
$envFile = $env:RAGFLY_MCP_ENV_FILE
if (-not $envFile) { $envFile = Join-Path (Join-Path $HOME '.ragfly') 'ragfly-mcp.env' }
if (-not (Test-Path -LiteralPath $envFile)) { [Console]::Error.WriteLine("Missing $envFile. Run ragfly-mcp-setup.ps1."); exit 1 }
$key = $null
foreach ($l in Get-Content -LiteralPath $envFile) {
  if ($l -match '^RAGFLY_API_KEY_PROD=(.*)$') { $key = $Matches[1].Trim().Trim('"').Trim("'") }
}
if (-not $key) { $key = $env:RAGFLY_API_KEY }
if (-not $key) { [Console]::Error.WriteLine("No RAGFLY_API_KEY_PROD in $envFile."); exit 1 }
$base = $env:RAGFLY_API_URL
if (-not $base) { $base = 'https://api.ragfly.ai' }
$url = $base.TrimEnd('/') + '/mcp-http/'

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http
$utf8 = New-Object System.Text.UTF8Encoding($false)
$reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput(), $utf8)
$writer = New-Object System.IO.StreamWriter([Console]::OpenStandardOutput(), $utf8)
$writer.NewLine = "`n"
$writer.AutoFlush = $true
$client = New-Object System.Net.Http.HttpClient
$client.Timeout = [TimeSpan]::FromMinutes(10)
$client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $key)
[void]$client.DefaultRequestHeaders.Accept.TryParseAdd('application/json')
[void]$client.DefaultRequestHeaders.Accept.TryParseAdd('text/event-stream')

while ($true) {
  $line = $reader.ReadLine()
  if ($null -eq $line) { break }
  $line = $line.Trim()
  if (-not $line) { continue }
  $id = $null
  if ($line -match '"id"\s*:\s*("[^"]*"|\d+)') { $id = $Matches[1] }
  try {
    $content = New-Object System.Net.Http.StringContent($line, $utf8, 'application/json')
    $resp = $client.PostAsync($url, $content).GetAwaiter().GetResult()
    $body = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
    if (-not $resp.IsSuccessStatusCode) { throw ('HTTP ' + [int]$resp.StatusCode) }
    $ctype = ''
    if ($resp.Content.Headers.ContentType) { $ctype = $resp.Content.Headers.ContentType.MediaType }
    if ($ctype -eq 'text/event-stream') {
      foreach ($l in ($body -split "`n")) {
        $l = $l.TrimEnd("`r")
        if ($l.StartsWith('data:')) { $writer.WriteLine($l.Substring(5).TrimStart()) }
      }
    } elseif ($body.Trim()) {
      $writer.WriteLine(($body -replace '[\r\n]+', ' '))
    }
  } catch {
    $msg = ($_.Exception.Message -replace '["\\\r\n]', ' ')
    [Console]::Error.WriteLine("RAGfly MCP: $msg")
    if ($id) { $writer.WriteLine('{"jsonrpc":"2.0","id":' + $id + ',"error":{"code":-32001,"message":"RAGfly request failed (' + $msg + ')"}}') }
  }
}
'@
[IO.File]::WriteAllText($Launcher, $launcherBody, $Utf8)
Write-Host "Installed the launcher at $Launcher"

# ---- register the client -----------------------------------------------------------
$psArgs = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $Launcher)
switch ($Client) {
  'claude-code' {
    if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { Fail 'the claude CLI is not on PATH.' }
    $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    $out = & claude mcp add --scope user ragfly -- powershell.exe @psArgs 2>&1 | Out-String
    $code = $LASTEXITCODE; $ErrorActionPreference = $prev
    if ($code -eq 0) { Write-Host "Registered 'ragfly' in Claude Code (user scope). Open /mcp or start a new session." }
    elseif ($out -match 'already exists') { [Console]::Error.WriteLine('Claude Code already has a user-level server named ragfly; left as is. To replace it: claude mcp remove --scope user ragfly') }
    else { Fail "claude mcp add failed: $out" }
  }
  'codex' {
    if (-not (Get-Command codex -ErrorAction SilentlyContinue)) { Fail 'the codex CLI is not on PATH.' }
    $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    & codex mcp add ragfly -- powershell.exe @psArgs
    $code = $LASTEXITCODE; $ErrorActionPreference = $prev
    if ($code -ne 0) { Fail 'codex mcp add failed.' }
    Write-Host "Registered 'ragfly' in Codex. Check with: codex mcp list"
  }
  'claude-desktop' {
    # The Microsoft Store build keeps its config under %LOCALAPPDATA%\Packages\Claude_*.
    $cfg = Join-Path $env:APPDATA 'Claude\claude_desktop_config.json'
    $store = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA 'Packages') -Filter 'Claude_*' -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($store -and -not (Test-Path -LiteralPath $cfg)) { $cfg = Join-Path $store.FullName 'LocalCache\Roaming\Claude\claude_desktop_config.json' }
    New-Item -ItemType Directory -Force -Path (Split-Path $cfg) | Out-Null
    $obj = New-Object PSObject
    if ((Test-Path -LiteralPath $cfg) -and (Get-Item -LiteralPath $cfg).Length -gt 0) {
      Copy-Item -LiteralPath $cfg -Destination "$cfg.bak-ragfly" -Force
      $obj = Get-Content -LiteralPath $cfg -Raw | ConvertFrom-Json
    }
    if (-not $obj.PSObject.Properties['mcpServers']) { $obj | Add-Member -NotePropertyName mcpServers -NotePropertyValue (New-Object PSObject) }
    $entry = [PSCustomObject]@{ command = 'powershell.exe'; args = $psArgs }
    $obj.mcpServers | Add-Member -NotePropertyName ragfly -NotePropertyValue $entry -Force
    [IO.File]::WriteAllText($cfg, (($obj | ConvertTo-Json -Depth 20) + "`n"), $Utf8)
    Write-Host "Added 'ragfly' to Claude Desktop ($cfg; backup: $cfg.bak-ragfly)."
    Write-Host 'Quit Claude Desktop completely (right-click its tray icon > Quit) and reopen it; it reads the file only at startup.'
  }
  default {
    Write-Host ''
    Write-Host 'Next, register the launcher in your client (it needs no key in its config):'
    Write-Host "  Claude Code:    claude mcp add --scope user ragfly -- powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$Launcher`""
    Write-Host "  Codex:          codex mcp add ragfly -- powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$Launcher`""
    Write-Host '  Claude Desktop: in claude_desktop_config.json add under mcpServers:'
    Write-Host '    "ragfly": { "command": "powershell.exe", "args": ["-NoProfile","-ExecutionPolicy","Bypass","-File","<path to ragfly-mcp.ps1>"] }'
    Write-Host 'or run this script again with  -Client claude-code | codex | claude-desktop'
  }
}

# ---- optional end-to-end test ------------------------------------------------------
if ($Test) {
  Write-Host "Calling the MCP 'session' tool through the launcher ..."
  $hostExe = (Get-Process -Id $PID).Path
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $hostExe
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $Launcher + '"'
  $psi.RedirectStandardInput = $true
  $psi.RedirectStandardOutput = $true
  $psi.UseShellExecute = $false
  $p = [System.Diagnostics.Process]::Start($psi)
  $p.StandardInput.WriteLine('{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"ragfly-mcp-setup","version":"1"}}}')
  $p.StandardInput.WriteLine('{"jsonrpc":"2.0","method":"notifications/initialized"}')
  $p.StandardInput.WriteLine('{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"session","arguments":{}}}')
  $p.StandardInput.Close()
  $reply = ''
  $deadline = (Get-Date).AddSeconds(60)
  while ((Get-Date) -lt $deadline) {
    $t = $p.StandardOutput.ReadLineAsync()
    if (-not $t.Wait(30000)) { break }
    if ($null -eq $t.Result) { break }
    $reply += $t.Result + "`n"
    if ($t.Result -match '"id"\s*:\s*2') { break }
  }
  if (-not $p.HasExited) { $p.Kill() }
  if ($reply -match 'authenticated[^a-z]+true') { Write-Host 'OK: the MCP session call answered authenticated: true.' }
  else { Fail 'the MCP session call did not confirm the connection. Check the network, then run: .\ragfly-mcp-setup.ps1 -Verify' }
}
Write-Host "Done. Ask your agent to call the 'session' tool to confirm."
