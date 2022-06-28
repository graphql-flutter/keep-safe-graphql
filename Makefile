default: fmt

dep:
	npm install

fmt:
	npx prettier --write .

clean:
	@echo "Nothing to clean"

run:
	yarn dev

watch:
	yarn watch

check:
	@echo "Nothing to check"

build:
	npm run build