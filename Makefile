TARGET := $(firstword $(MAKECMDGOALS))
ARGS := $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))

ifneq ($(filter exec in,$(TARGET)),)
$(eval $(ARGS):;@:)
#previous line can't start with tab
	SERVICE := $(if $(ARGS),$(firstword $(ARGS)),php)
	ARGS := $(wordlist 2, $(words $(ARGS)), $(ARGS))
endif


build:
	docker-compose up --detach --build

down:
	docker-compose down

exec:
	docker-compose exec $(SERVICE) bash

in:
	@$(MAKE) --silent exec $(SERVICE) $(ARGS)

restart:
	docker-compose restart

up:
	docker-compose up --detach

.PHONY: down exec in restart up
