ROOT=$(CURDIR)

# --- ENTRYPOINTS -------------------------------------------------------------
NODE=-entrypoint /usr/local/bin/node
NPM=-entrypoint /usr/local/bin/npm

# --- IMAGES ------------------------------------------------------------------
SRV_IMAGE=joaodubas/nodejs:latest
SRV_CONTAINER_NAME=meetup_app
SRV_CONTAINER=-name $(SRV_CONTAINER_NAME)

DB_IMAGE=joaodubas/multilevel:latest
DB_CONTAINER_NAME=meetup_db
DB_CONTAINER=-name $(DB_CONTAINER_NAME)

HUD_IMAGE=joaodubas/levelhud:latest
HUD_CONTAINER_NAME=hud_db
HUD_CONTAINER=-name $(HUD_CONTAINER_NAME)

# --- PORTS -------------------------------------------------------------------
SRV_PORT_SSH=-p 40051:22
SRV_PORT_SUPERVISOR=-p 9011:9001
SRV_PORT_SERVER=-p 8001:3000
SRV_PORT=$(SRV_PORT_SSH) $(SRV_PORT_SUPERVISOR) $(SRV_PORT_SERVER)

DB_PORT_SSH=-p 40071:22
DB_PORT_SUPERVISOR=-p 9071:9001
DB_PORT_SERVER=-p 8003:3001
DB_PORT=$(DB_PORT_SSH) $(DB_PORT_SUPERVISOR) $(DB_PORT_SERVER)

HUD_PORT_SSH=-p 40061:22
HUD_PORT_SUPERVISOR=-p 9061:9001
HUD_PORT_SERVER=-p 8002:3002
HUD_PORT=$(HUD_PORT_SSH) $(HUD_PORT_SUPERVISOR) $(HUD_PORT_SERVER)

# --- MOUNT -------------------------------------------------------------------
SRV_MOUNT_APP=-v $(ROOT)/app:/opt/app
SRV_MOUNT_SUPERVISOR=-v $(ROOT)/supervisor:/etc/supervisor/conf.d/hook.d
SRV_MOUNT=$(SRV_MOUNT_APP) $(SRV_MOUNT_SUPERVISOR)

DB_MOUNT_DATA=-v $(ROOT)/data:/opt/data
DB_MOUNT_LOG=-v $(ROOT)/app:/opt/app
DB_MOUNT=$(DB_MOUNT_DATA) $(DB_MOUNT_LOG)

# --- ENVIRONMENT -------------------------------------------------------------
SRV_ENV=-e NODE_PORT=3000
SRV_EXPOSE=-expose 3000
SRV_WORKDIR=-w /opt/app

# --- COMMAND -----------------------------------------------------------------
CMD=docker run -t

DB_CMD=$(CMD) -d $(DB_CONTAINER) $(DB_MOUNT) $(DB_PORT) $(DB_IMAGE)
DB_LINK=-link $(DB_CONTAINER_NAME):db

HUD_CMD=$(CMD) -d $(HUD_CONTAINER) $(SRV_MOUNT_APP) $(HUD_PORT) $(DB_LINK) $(HUD_IMAGE)

SRV_ARGS=$(SRV_EXPOSE) $(SRV_PORT) $(SRV_CONTAINER) $(SRV_MOUNT) $(SRV_WORKDIR) $(SRV_ENV) $(SRV_IMAGE)
SRV_CMD_SERVICE=$(CMD) -d $(DB_LINK) $(SRV_ARGS)
SRV_CMD_SHELL=$(CMD) -i $(NODE) $(DB_LINK) $(SRV_ARGS)
SRV_CMD_NPM=$(CMD) -i $(NPM) $(SRV_ARGS) $(args)

start_db:
	@$(DB_CMD)

stop_db:
	@docker kill $(DB_CONTAINER_NAME) && docker rm $(DB_CONTAINER_NAME)

start_hud:
	@$(HUD_CMD)

stop_hud:
	@docker kill $(HUD_CONTAINER_NAME) && docker rm $(HUD_CONTAINER_NAME)

start: start_db start_hud
	@$(SRV_CMD_SERVICE)

stop:
	@docker kill $(SRV_CONTAINER_NAME) && docker rm $(SRV_CONTAINER_NAME);

stop-all: stop stop_hud stop_db

shell: start_db
	@$(SRV_CMD_SHELL); $(MAKE) stop; $(MAKE) stop_db

install:
	@$(SRV_CMD_NPM); $(MAKE) stop

.PHONY: start stop shell stop-all
