# Run from the repository root (same directory as docker-compose.yml).
.PHONY: console
console:
	docker compose exec backend bin/rails console
