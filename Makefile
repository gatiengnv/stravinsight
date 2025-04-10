.PHONY: reset watch-front reset-start-dev
NODE_PKG_MANAGER = npm


watch-front:
	$(NODE_PKG_MANAGER) install
	$(NODE_PKG_MANAGER) run watch

reset:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate

reset-start-dev: reset watch-front
