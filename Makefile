# Run from the repository root (same directory as docker-compose.yml).
.PHONY: console start stop up logs restart

# Start all services in the background (rebuild images if needed).
start:
	docker compose up -d --build

# Stop and remove containers (keeps named volumes / database data).
stop:
	docker compose down

# Run in the foreground with logs (Ctrl+C stops the stack).
up:
	docker compose up --build

# Follow logs from all services.
logs:
	docker compose logs -f

# Stop then start in the background.
restart: stop start

console:
	docker compose exec backend bin/rails console
