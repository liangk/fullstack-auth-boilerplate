# Docker development helper script
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Fullstack Auth Boilerplate - Docker Helper${NC}"
echo ""

case "$1" in
    "start")
        echo -e "${GREEN}Starting all services...${NC}"
        docker-compose up --build
        ;;
    "start-bg")
        echo -e "${GREEN}Starting all services in background...${NC}"
        docker-compose up -d --build
        ;;
    "stop")
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
        ;;
    "restart")
        echo -e "${YELLOW}Restarting all services...${NC}"
        docker-compose down
        docker-compose up -d --build
        ;;
    "logs")
        echo -e "${BLUE}Showing logs...${NC}"
        docker-compose logs -f
        ;;
    "clean")
        echo -e "${RED}Cleaning up containers and volumes...${NC}"
        docker-compose down -v --remove-orphans
        docker system prune -f
        ;;
    "migrate")
        echo -e "${GREEN}Running database migrations...${NC}"
        docker-compose exec backend npm run prisma:migrate
        ;;
    "seed")
        echo -e "${GREEN}Seeding database...${NC}"
        docker-compose exec backend npm run prisma:seed
        ;;
    "studio")
        echo -e "${BLUE}Opening Prisma Studio...${NC}"
        docker-compose exec backend npm run prisma:studio
        ;;
    "shell")
        echo -e "${BLUE}Opening backend shell...${NC}"
        docker-compose exec backend sh
        ;;
    "db-shell")
        echo -e "${BLUE}Opening database shell...${NC}"
        docker-compose exec postgres psql -U postgres -d auth_boilerplate
        ;;
    "help"|*)
        echo "Usage: $0 {command}"
        echo ""
        echo "Commands:"
        echo "  start      - Start all services with build"
        echo "  start-bg   - Start all services in background"
        echo "  stop       - Stop all services"
        echo "  restart    - Restart all services"
        echo "  logs       - Show logs from all services"
        echo "  clean      - Clean up containers and volumes"
        echo "  migrate    - Run database migrations"
        echo "  seed       - Seed the database"
        echo "  studio     - Open Prisma Studio"
        echo "  shell      - Open backend container shell"
        echo "  db-shell   - Open PostgreSQL shell"
        echo "  help       - Show this help message"
        echo ""
        echo "Services:"
        echo "  Frontend:  http://localhost:3000"
        echo "  Backend:   http://localhost:4000"
        echo "  MailDev:   http://localhost:1080"
        echo "  Database:  localhost:5432"
        ;;
esac
