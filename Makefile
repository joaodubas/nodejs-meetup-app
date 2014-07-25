ROOT=$(CURDIR)

# --- ENTRYPOINTS -------------------------------------------------------------
NODE=--entrypoint /usr/local/bin/node
NPM=--entrypoint /usr/local/bin/npm

# --- MULTILEVEL --------------------------------------------------------------
DB_IMAGE=joaodubas/multilevel:latest
DB_CONTAINER_NAME=meetup_db
DB_OPTS=--name $(DB_CONTAINER_NAME) \
	-v $(ROOT)/data:/opt/data

DB_LNK=--link $(DB_CONTAINER_NAME):db \
	--env LVLDB_HOST=db \
	--env LVLDB_PORT=3001

# --- APPLICATION -------------------------------------------------------------
SRV_IMAGE=joaodubas/nodejs:latest
SRV_CONTAINER_NAME=meetup_app
SRV_NPM_OPTS=-v $(ROOT)/app:/opt/app \
	-w /opt/app
SRV_SHELL_OPTS=$(SRV_NPM_OPTS) $(DB_LNK)
SRV_OPTS=--name $(SRV_CONTAINER_NAME) \
	--expose 3000 \
	--env NODE_PORT=3000 \
	-p 10000:3000 \
	$(SRV_SHELL_OPTS)

# --- LEVELHUD ----------------------------------------------------------------
HUD_IMAGE=joaodubas/levelhud:latest
HUD_CONTAINER_NAME=hud_db

HUD_OPTS=--name $(HUD_CONTAINER_NAME) \
	-p 10002:3002 \
	$(DB_LNK)

# --- COMMAND -----------------------------------------------------------------
CMD=docker run

DB_CMD=$(CMD) -d $(DB_OPTS) $(DB_IMAGE)

HUD_CMD=$(CMD) -d $(HUD_OPTS) $(HUD_IMAGE)

SRV_NPM_ARGS=$(SRV_NPM_OPTS) $(SRV_IMAGE)
SRV_SHELL_ARGS=$(SRV_SHELL_OPTS) $(SRV_IMAGE)
SRV_ARGS=$(SRV_OPTS) $(SRV_IMAGE)
SRV_CMD_SERVICE=$(CMD) -d $(SRV_ARGS)
SRV_CMD_SHELL=$(CMD) -i -t --rm $(NODE) $(SRV_SHELL_ARGS) --interactive
SRV_CMD_NPM=$(CMD) -i -t --rm $(NPM) $(SRV_NPM_ARGS) $(args)

start_db:
	@$(DB_CMD)

stop_db:
	@docker kill $(DB_CONTAINER_NAME) && docker rm $(DB_CONTAINER_NAME)

start_hud:
	@$(HUD_CMD)

stop_hud:
	@docker kill $(HUD_CONTAINER_NAME) && docker rm $(HUD_CONTAINER_NAME)

start_app:
	@$(SRV_CMD_SERVICE) node index

stop_app:
	@docker kill $(SRV_CONTAINER_NAME) && docker rm $(SRV_CONTAINER_NAME);

start: start_db start_hud start_app
stop: stop_app stop_hud stop_db

shell:
	@$(SRV_CMD_SHELL)

install:
	@$(SRV_CMD_NPM)install

.PHONY: start stop start_app stop_app start_hud stop_hud start_db stop_db shell
