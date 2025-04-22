.PHONY: reset watch-front reset-start-dev
NODE_PKG_MANAGER = npm


watch-front:
	$(NODE_PKG_MANAGER) install
	$(NODE_PKG_MANAGER) run watch

reset:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate

reset-start-dev: reset watch-front

reset-db:
	docker compose exec php bin/console doctrine:database:drop --force --if-exists
	docker compose exec php bin/console doctrine:database:create
	docker compose exec php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

