all: run

run: frontend backend
	npm run start --prefix ./frontend &
	npm run start --prefix ./backend

build:
	npm run build --prefix ./frontend

clean:
	rm -rf ./frontend/node_modules
	rm -rf ./frontend/dist
	rm -rf ./frontend/package-lock.json

	rm -rf ./backend/node_modules
	rm -rf ./backend/dist
	rm -rf ./backend/package-lock.json

frontend:
	npm install --prefix ./frontend

backend:
	npm install --prefix ./backend

docker:
	docker-compose down
	docker-compose up --build

.PHONY: all run build clean frontend backend docker