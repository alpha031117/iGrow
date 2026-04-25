.PHONY: dev dev-down frontend backend install \
        db-up db-down db-upgrade db-seed db-reset \
        check-bedrock help

FRONTEND_PORT := 3000
BACKEND_PORT  := 8000

PKG_MANAGER := $(shell command -v bun >/dev/null 2>&1 && echo bun || echo npm)

# Local Docker MySQL credentials (override on CLI for remote: make db-upgrade DB_HOST=... DB_PASS=...)
DB_HOST := 127.0.0.1
DB_PORT := 3306
DB_NAME := brisval_db
DB_USER := root
DB_PASS := igrow

SCRIPTS_DIR := backend/scripts

# Run SQL via the Docker container (avoids needing a local mysql client)
define run_sql
	docker compose exec -T mysql mysql -u $(DB_USER) -p$(DB_PASS) $(DB_NAME) < $(1)
endef

# Migration scripts — run in this explicit order
MIGRATIONS := \
	$(SCRIPTS_DIR)/init_db.sql \
	$(SCRIPTS_DIR)/migrate_merchant.sql

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  dev          Start frontend and backend concurrently"
	@echo "  dev-down     Kill processes on ports $(FRONTEND_PORT) and $(BACKEND_PORT)"
	@echo "  frontend     Start Next.js dev server (port $(FRONTEND_PORT))"
	@echo "  backend      Start FastAPI dev server (port $(BACKEND_PORT))"
	@echo "  install      Install all dependencies (uses bun if available, else npm)"
	@echo ""
	@echo "  db-up        Start local MySQL container (Docker)"
	@echo "  db-down      Stop local MySQL container"
	@echo "  db-upgrade        Run all SQL migration scripts (local Docker)"
	@echo "  db-upgrade-remote Run all SQL migration scripts (remote via backend/.env)"
	@echo "  db-seed      Populate merchant transaction history"
	@echo "  db-reset     Wipe and recreate the local MySQL volume, then upgrade + seed"
	@echo "  help         Show this help message"

dev:
	@trap 'kill 0' SIGINT; \
	$(MAKE) backend & \
	$(MAKE) frontend & \
	wait

dev-down:
	@echo "Stopping processes on ports $(FRONTEND_PORT) and $(BACKEND_PORT)..."
	@lsof -ti tcp:$(FRONTEND_PORT) | xargs -r kill -9 2>/dev/null || true
	@lsof -ti tcp:$(BACKEND_PORT)  | xargs -r kill -9 2>/dev/null || true
	@echo "Done."

frontend:
	cd frontend && $(PKG_MANAGER) $(if $(filter npm,$(PKG_MANAGER)),run )dev

backend:
	cd backend && uvicorn app.main:app --reload --port $(BACKEND_PORT)

install:
	@echo "Using package manager: $(PKG_MANAGER)"
	cd frontend && $(PKG_MANAGER) install
	cd backend && pip install -r requirements.txt

# ── Database targets ────────────────────────────────────────────────────

db-up:
	@echo "Starting MySQL container..."
	docker compose up -d mysql
	@echo "Waiting for MySQL to be ready..."
	@until docker compose exec mysql mysqladmin ping -h localhost -u root -pigrow --silent 2>/dev/null; \
	  do printf '.'; sleep 1; done
	@echo " ready."

db-down:
	docker compose stop mysql

db-upgrade:
	@echo "Running migrations against $(DB_HOST):$(DB_PORT)/$(DB_NAME)..."
	@for script in $(MIGRATIONS); do \
	  echo "  -> $$script"; \
	  docker compose exec -T mysql mysql -u $(DB_USER) -p$(DB_PASS) $(DB_NAME) < $$script || exit 1; \
	done
	@echo "All migrations applied."

db-upgrade-remote:
	@echo "Running migrations against remote DATABASE_URL in backend/.env..."
	cd backend && python scripts/run_migrations.py

db-seed:
	@echo "Seeding merchant transaction data..."
	cd backend && python scripts/seed_merchant.py

check-bedrock:
	@bash scripts/check-bedrock.sh

db-reset:
	@echo "Resetting local MySQL volume..."
	docker compose down -v mysql 2>/dev/null || true
	$(MAKE) db-up
	$(MAKE) db-upgrade
	$(MAKE) db-seed
	@echo "Reset complete."
