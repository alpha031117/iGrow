.PHONY: dev dev-down frontend backend install help

FRONTEND_PORT := 3000
BACKEND_PORT  := 8000

PKG_MANAGER := $(shell command -v bun >/dev/null 2>&1 && echo bun || echo npm)

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  dev        Start frontend and backend concurrently"
	@echo "  dev-down   Kill processes on ports $(FRONTEND_PORT) and $(BACKEND_PORT)"
	@echo "  frontend   Start Next.js dev server (port $(FRONTEND_PORT))"
	@echo "  backend    Start FastAPI dev server (port $(BACKEND_PORT))"
	@echo "  install    Install all dependencies (uses bun if available, else npm)"
	@echo "  help       Show this help message"

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
