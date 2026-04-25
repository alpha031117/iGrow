.PHONY: dev frontend backend install

dev:
	@trap 'kill 0' SIGINT; \
	$(MAKE) backend & \
	$(MAKE) frontend & \
	wait

frontend:
	cd frontend && bun dev

backend:
	cd backend && uvicorn app.main:app --reload --port 8000

install:
	cd frontend && bun install
	cd backend && pip install -r requirements.txt
