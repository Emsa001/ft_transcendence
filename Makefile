all: run

run: frontend backend
	# Kill any previously running frontend/backend npm processes
	pkill -f "npm run start --prefix ./frontend" || true
	pkill -f "npm run start --prefix ./backend" || true

	# Start frontend and backend in new terminals
	gnome-terminal -- bash -c "npm run start --prefix ./frontend; exec bash" &
	gnome-terminal -- bash -c "npm run start --prefix ./backend; exec bash"

dev: run

test: backend
	npm run test --prefix ./backend

build:
	npm run build --prefix ./frontend

clean:
	rm -rf ./frontend/node_modules ./frontend/dist ./frontend/package-lock.json
	rm -rf ./backend/node_modules ./backend/dist ./backend/package-lock.json

frontend:
	npm install --prefix ./frontend

backend:
	npm install --prefix ./backend

install: frontend backend

docker:
	docker-compose down
	docker-compose up --build

.PHONY: all run dev build clean frontend backend docker install test
