#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-dev}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
  echo -e "${YELLOW}[upgrade-db]${NC} $1"
}

log_ok() {
  echo -e "${GREEN}[upgrade-db]${NC} $1"
}

log_error() {
  echo -e "${RED}[upgrade-db]${NC} $1"
}

usage() {
  cat <<EOF
Usage: ./scripts/upgrade-db.sh [dev]

Modes:
  dev   Run API database migrations in docker-compose.yml (default)

Examples:
  ./scripts/upgrade-db.sh
  ./scripts/upgrade-db.sh dev
EOF
}

require_docker_compose() {
  if ! docker compose version >/dev/null 2>&1; then
    log_error "docker compose is required but not available."
    exit 1
  fi
}

run_dev_migration() {
  log_info "Ensuring db and api services are running (docker-compose.yml)..."
  docker compose up -d db api

  log_info "Running API migrations via container entrypoint (/app/apps/api/scripts/upgrade-db.sh)..."
  docker compose exec -T api /app/apps/api/scripts/upgrade-db.sh

  log_ok "Database migrations completed successfully."
}

cd "$ROOT_DIR"
require_docker_compose

case "$MODE" in
  dev)
    run_dev_migration
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
