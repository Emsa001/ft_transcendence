### Variables
FRONTEND_DIR	= ./frontend
BACKEND_DIR		= ./backend
SHARED_DIR		= ./shared
DOCKER_COMPOSE	= docker compose \
	--project-name ft_inception

### Main Targets
.PHONY: all dev run build clean install format test up down re frontend backend shared

all: build

dev: run

# Starts dev servers in separate terminals
run: frontend backend
	gnome-terminal -- bash -c "npm run start --prefix $(FRONTEND_DIR); exec bash" &
	gnome-terminal -- bash -c "npm run dev --prefix $(BACKEND_DIR); exec bash"

build:	clean
	@bash nginx/certs/generate.sh
	@echo "\nStarting Docker in the background...\n"
	@$(DOCKER_COMPOSE) up --build -d
	@echo "\nAll services launched. Logs with: $(DOCKER_COMPOSE) logs -f\n"

clean:
	rm -rf ./*/node_modules
	rm -rf ./*/dist
	rm -rf ./*/package-lock.json
	$(DOCKER_COMPOSE) down -v --remove-orphans --rmi all

install: frontend backend

format:
	npm run format --prefix $(FRONTEND_DIR)
	npm run format --prefix $(BACKEND_DIR)

test: backend
	npm run test --prefix $(BACKEND_DIR)


### Project Parts
frontend: shared
	npm install --prefix $(FRONTEND_DIR)

backend: shared
	npm install --prefix $(BACKEND_DIR)

shared:
	npm install --prefix ./shared
	npm run build --prefix ./shared


### Docker Shortcuts
up:
	@$(DOCKER_COMPOSE) up

down:
	@$(DOCKER_COMPOSE) down

re: clean build
