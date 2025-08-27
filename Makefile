# Decast Monorepo Makefile
# Common commands for managing the monorepo

.PHONY: help build build-all dev prod clean logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the production Docker image
	docker-compose build did-web

build-all: ## Build all Docker images
	docker-compose build

dev: ## Run development environment
	docker-compose --profile dev up did-web-dev

prod: ## Run production environment
	docker-compose up -d did-web

logs: ## Show logs
	docker-compose logs -f

clean: ## Stop and remove containers
	docker-compose down

clean-all: ## Stop and remove containers, volumes, and images
	docker-compose down -v --rmi all

test: ## Test the application
	curl -f http://localhost:8080/api/health || echo "Health check failed"

install: ## Install dependencies locally
	pnpm install

build-local: ## Build locally
	pnpm build
