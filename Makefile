DC=docker-compose

up:
	$(DC) up -d --build

down:
	$(DC) down

logs:
	$(DC) logs -f

logs-api:
	$(DC) logs -f api

# ローカルで front を立ち上げる (ホスト上で npm run dev を実行)
install-front:
	cd front && npm ci

dev-front:
	cd front && npm run dev

ps:
	$(DC) ps

restart:
	$(DC) restart

migrate:
	$(DC) exec api npx prisma migrate deploy
