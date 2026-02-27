#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-dev}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
  echo -e "${YELLOW}[start]${NC} $1"
}

log_ok() {
  echo -e "${GREEN}[start]${NC} $1"
}

log_error() {
  echo -e "${RED}[start]${NC} $1"
}

usage() {
  cat <<EOF
Usage: ./scripts/start.sh [dev|prod]

Modes:
  dev   Start stack from docker-compose.yml (default)
  prod  Start stack from docker-compose.prod.yml

Examples:
  ./scripts/start.sh
  ./scripts/start.sh dev
  ./scripts/start.sh prod
EOF
}

require_docker_compose() {
  if ! docker compose version >/dev/null 2>&1; then
    log_error "docker compose is required but not available."
    exit 1
  fi
}

start_dev() {
  log_info "Starting development stack (docker-compose.yml)..."
  docker compose up -d --build
  log_ok "Development stack started."
}

start_prod() {
  log_info "Starting production stack (docker-compose.prod.yml)..."
  docker compose -f docker-compose.prod.yml up -d --build
  log_ok "Production stack started."
}

cd "$ROOT_DIR"
require_docker_compose

case "$MODE" in
  dev)
    start_dev
    ;;
  prod)
    start_prod
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
