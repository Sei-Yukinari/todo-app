DC=docker-compose

up:
	$(DC) up -d --build

down:
	$(DC) down

logs:
	$(DC) logs -f

logs-api:
	$(DC) logs -f api

logs-front:
	$(DC) logs -f front

ps:
	$(DC) ps

restart:
	$(DC) restart

migrate:
	$(DC) exec api npx prisma migrate deploy
