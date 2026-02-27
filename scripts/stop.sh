#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-dev}"
VOLUMES_FLAG="${2:-}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
  echo -e "${YELLOW}[stop]${NC} $1"
}

log_ok() {
  echo -e "${GREEN}[stop]${NC} $1"
}

log_error() {
  echo -e "${RED}[stop]${NC} $1"
}

usage() {
  cat <<EOF
Usage: ./scripts/stop.sh [dev|prod] [--volumes]

Modes:
  dev   Stop stack from docker-compose.yml (default)
  prod  Stop stack from docker-compose.prod.yml

Options:
  --volumes  Also remove compose volumes

Examples:
  ./scripts/stop.sh
  ./scripts/stop.sh dev
  ./scripts/stop.sh prod
  ./scripts/stop.sh dev --volumes
EOF
}

require_docker_compose() {
  if ! docker compose version >/dev/null 2>&1; then
    log_error "docker compose is required but not available."
    exit 1
  fi
}

down_dev() {
  log_info "Stopping development stack (docker-compose.yml)..."
  if [[ "$VOLUMES_FLAG" == "--volumes" ]]; then
    docker compose down --volumes
  else
    docker compose down
  fi
  log_ok "Development stack stopped."
}

down_prod() {
  log_info "Stopping production stack (docker-compose.prod.yml)..."
  if [[ "$VOLUMES_FLAG" == "--volumes" ]]; then
    docker compose -f docker-compose.prod.yml down --volumes
  else
    docker compose -f docker-compose.prod.yml down
  fi
  log_ok "Production stack stopped."
}

cd "$ROOT_DIR"
require_docker_compose

case "$MODE" in
  dev)
    down_dev
    ;;
  prod)
    down_prod
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
