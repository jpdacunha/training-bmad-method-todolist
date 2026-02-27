#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-full}"
API_PORT="${API_PORT:-3000}"

STARTED_API=0
API_PID=''

cd "$ROOT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
  echo -e "${YELLOW}[verify-app]${NC} $1"
}

log_ok() {
  echo -e "${GREEN}[verify-app]${NC} $1"
}

log_error() {
  echo -e "${RED}[verify-app]${NC} $1"
}

usage() {
  cat <<EOF
Usage: ./scripts/verify-app.sh [core|smoke|full]

Modes:
  core   Run lint, build and tests for the whole monorepo
  smoke  Validate API health endpoint on http://localhost:
         \\$API_PORT/api/health (starts API server if needed)
  full   Run core checks + smoke test (default)

Environment variables:
  API_PORT  API port to target for smoke test (default: 3000)

Examples:
  ./scripts/verify-app.sh core
  API_PORT=3001 ./scripts/verify-app.sh smoke
  ./scripts/verify-app.sh full
EOF
}

run_core_checks() {
  log_info "Running global lint..."
  pnpm lint

  log_info "Running global build..."
  pnpm build

  log_info "Running global tests..."
  pnpm test

  log_ok "Core checks passed (lint/build/test)."
}

wait_for_health() {
  local max_attempts=30
  local attempt=1

  while [[ $attempt -le $max_attempts ]]; do
    if curl -fsS "http://localhost:${API_PORT}/api/health" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done

  return 1
}

run_smoke_test() {
  if lsof -i ":${API_PORT}" >/dev/null 2>&1; then
    log_info "Port ${API_PORT} already in use, reusing existing API process for smoke test."
  else
    log_info "Starting API server for smoke test on port ${API_PORT}..."
    (
      cd apps/api
      PORT="${API_PORT}" node dist/main.js
    ) >/tmp/verify-app-api.log 2>&1 &
    API_PID=$!
    STARTED_API=1
  fi

  trap 'if [[ ${STARTED_API:-0} -eq 1 ]] && [[ -n "${API_PID:-}" ]]; then kill "${API_PID}" >/dev/null 2>&1 || true; wait "${API_PID}" 2>/dev/null || true; log_info "Stopped temporary API process (${API_PID})."; fi' EXIT

  if ! wait_for_health; then
    log_error "API health endpoint did not become ready on http://localhost:${API_PORT}/api/health"
    if [[ -f /tmp/verify-app-api.log ]]; then
      log_info "Last API logs:"
      tail -n 30 /tmp/verify-app-api.log || true
    fi
    exit 1
  fi

  local response
  response="$(curl -fsS "http://localhost:${API_PORT}/api/health")"

  if ! echo "$response" | grep -q '"status":"ok"'; then
    log_error "Health response is invalid: $response"
    exit 1
  fi

  log_ok "Smoke test passed: GET /api/health returned status ok."
}

case "$MODE" in
  core)
    run_core_checks
    ;;
  smoke)
    run_smoke_test
    ;;
  full)
    run_core_checks
    run_smoke_test
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    log_error "Unknown mode: $MODE"
    usage
    exit 1
    ;;
esac
