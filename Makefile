.PHONY: reset watch-front reset-start-dev
NODE_PKG_MANAGER = pnpm
DC_PHP_CONSOLE = docker compose exec php bin/console

watch-front:
	$(NODE_PKG_MANAGER) install
	$(NODE_PKG_MANAGER) run watch

reset:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate

reset-start-dev: reset watch-front

reset-db:
	$(DC_PHP_CONSOLE) doctrine:database:drop --force --if-exists
	$(DC_PHP_CONSOLE) doctrine:database:create
	$(DC_PHP_CONSOLE) doctrine:migrations:migrate --no-interaction --allow-no-migration

restart:
	DOMAIN=localhost docker compose down && DOMAIN=localhost docker compose -f compose.traefik.yaml -f compose.yaml -f compose.override.yaml up -d --build && DOMAIN=localhost docker compose exec php npm run watch
