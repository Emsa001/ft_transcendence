all: run

run: frontend backend
	# TODO: changes this for general compatibility
	# -> use docker compose --watch ?
	gnome-terminal -- bash -c "npm run start --prefix ./frontend; exec bash" &
	gnome-terminal -- bash -c "npm run dev --prefix ./backend; exec bash"

dev: run

build:
	npm run build --prefix ./frontend

clean:
	rm -rf ./frontend/node_modules
	rm -rf ./frontend/dist
	rm -rf ./frontend/package-lock.json

	rm -rf ./backend/node_modules
	rm -rf ./backend/dist
	rm -rf ./backend/package-lock.json

frontend: shared
	npm install --prefix ./frontend

backend: shared
	npm install --prefix ./backend

shared:
	npm install --prefix ./shared
	npm run build --prefix ./shared

install: frontend backend 

format:
	npm run format --prefix ./frontend
	npm run format --prefix ./backend

test: backend
	npm run test --prefix ./backend

docker:
	docker-compose down
	docker-compose up --build

.PHONY: all run dev build clean frontend backend docker install shared
