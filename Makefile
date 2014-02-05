ROOT=$(CURDIR)

NODE=-entrypoint /usr/local/bin/node
NPM=-entrypoint /usr/local/bin/npm

IMAGE=joaodubas/nodejs:latest
CONTAINER_NAME=meetup_app
CONTAINER=-name $(CONTAINER_NAME)

PORT_SSH=-p 40051:22
PORT_SUPERVISOR=-p 9011:9001
PORT_SERVER=-p 3001:3001
PORT=$(PORT_SSH) $(PORT_SUPERVISOR) $(PORT_SERVER)

MOUNT_APP=-v $(ROOT)/app:/opt/app
MOUNT_SUPERVISOR=-v $(ROOT)/supervisor:/etc/supervisor/conf.d/hook.d
MOUNT=$(MOUNT_APP) $(MOUNT_SUPERVISOR)

ENV=-e NODE_PORT=3001

WORKDIR=-w /opt/app

ARGS=$(PORT) $(CONTAINER) $(MOUNT) $(WORKDIR) $(IMAGE)

DB_IMAGE=joaodubas/multilevel:latest
DB_CONTAINER_NAME=meetup_db
DB_CONTAINER=-name $(DB_CONTAINER_NAME)
DB_CMD=$(CMD) -d $(DB_CONTAINER) $(MOUNT_APP) $(DB_IMAGE)
DB_LINK=-link $(DB_CONTAINER_NAME):db

CMD=docker run -t
CMD_SERVICE=$(CMD) -d $(PORT) $(CONTAINER) $(MOUNT) $(DB_LINK) $(WORKDIR) $(IMAGE)
CMD_SHELL=$(CMD) -i $(PORT) $(CONTAINER) $(MOUNT) $(NODE) $(DB_LINK) $(WORKDIR) $(IMAGE)
CMD_NPM=$(CMD) -i $(PORT) $(CONTAINER) $(MOUNT) $(NPM) $(WORKDIR) $(IMAGE) $(args)

start_db:
	@$(DB_CMD)

stop_db:
	@docker kill $(DB_CONTAINER_NAME) && docker rm $(DB_CONTAINER_NAME)

start: start_db
	@$(CMD_SERVICE); $(MAKE) stop; $(MAKE) stop_db

stop:
	@docker kill $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME);

shell: start_db
	@$(CMD_SHELL); $(MAKE) stop; $(MAKE) stop_db

install:
	@$(CMD_NPM); $(MAKE) stop

.PHONY: start stop shell
