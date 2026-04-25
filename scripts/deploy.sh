#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/iGrow}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
BACKEND_DIR="${BACKEND_DIR:-$APP_DIR/backend}"
FRONTEND_DIR="${FRONTEND_DIR:-$APP_DIR/frontend}"
BACKEND_SERVICE="${BACKEND_SERVICE:-igrow}"
FRONTEND_PM2_APP="${FRONTEND_PM2_APP:-igrow-frontend}"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://127.0.0.1:8000/health}"
BUN_INSTALL_ARGS="${BUN_INSTALL_ARGS:---frozen-lockfile}"
PIP_INDEX_URL="${PIP_INDEX_URL:-https://pypi.org/simple/}"
LOCK_FILE="${LOCK_FILE:-/tmp/igrow-deploy.lock}"

export PATH="$HOME/.bun/bin:/root/.bun/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
  nvm use --silent default >/dev/null 2>&1 || true
fi

log() {
  printf '\n=== %s ===\n' "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

retry_health_check() {
  local url="$1"
  local attempts="${2:-12}"
  local delay_seconds="${3:-5}"

  for attempt in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null; then
      echo "Health check passed: $url"
      return 0
    fi

    echo "Health check failed, retrying ($attempt/$attempts)..."
    sleep "$delay_seconds"
  done

  echo "Health check failed after $attempts attempts: $url" >&2
  return 1
}

require_cmd git
require_cmd curl
require_cmd flock
require_cmd bun
require_cmd pm2

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another deployment is already running." >&2
  exit 1
fi

log "Fetching latest code"
cd "$APP_DIR"
git fetch origin "$DEPLOY_BRANCH"
git reset --hard "origin/$DEPLOY_BRANCH"

log "Checking AWS Bedrock credentials"
bash "$APP_DIR/scripts/check-bedrock.sh"

log "Installing backend dependencies"
cd "$BACKEND_DIR"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt -i "$PIP_INDEX_URL" --trusted-host pypi.org
deactivate

log "Installing frontend dependencies"
cd "$FRONTEND_DIR"
bun install $BUN_INSTALL_ARGS

log "Building frontend"
bun run build

log "Restarting backend"
sudo systemctl restart "$BACKEND_SERVICE"

log "Restarting frontend"
pm2 restart "$FRONTEND_PM2_APP" --update-env

log "Checking backend health"
retry_health_check "$BACKEND_HEALTH_URL"

log "Deployment complete"
