all: run

run: frontend backend
	# TODO: changes this for general compatibility
	# -> use docker compose --watch ?
	gnome-terminal -- bash -c "npm run start --prefix ./frontend; exec bash" &
	gnome-terminal -- bash -c "npm run dev --prefix ./backend; exec bash"

dev: run

clean:
	rm -rf ./*/node_modules
	rm -rf ./*/dist
	rm -rf ./*/package-lock.json
	docker compose down -v --remove-orphans --rmi all

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

docker: clean
	docker compose down -v --remove-orphans --rmi all
	@bash nginx/certs/generate.sh
	@echo "\nStarting Docker in the background...\n"
	-@docker compose up --build -d || true
	@echo "\nAll services launched. Logs with: docker compose logs -f\n"


.PHONY: all run dev build clean frontend backend docker install shared
