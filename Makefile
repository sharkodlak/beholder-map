TARGET := $(firstword $(MAKECMDGOALS))
ARGS := $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))

ifneq ($(filter exec in,$(TARGET)),)
$(eval $(ARGS):;@:)
#previous line can't start with tab
	SERVICE := $(if $(ARGS),$(firstword $(ARGS)),php)
	ARGS := $(wordlist 2, $(words $(ARGS)), $(ARGS))
endif


build:
	podman-compose up --detach --build

down:
	podman-compose down

exec:
	podman-compose exec $(SERVICE) bash

in:
	@$(MAKE) --silent exec $(SERVICE) $(ARGS)

restart:
	podman-compose restart

up:
	podman-compose up --detach

.PHONY: down exec in restart up
