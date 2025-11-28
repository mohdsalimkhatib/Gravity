# Gravity Application

A full-stack web application with:
- React 19.2 Frontend
- Spring Boot 3.5.0 Backend
- Java 21 LTS
- PostgreSQL Database

## Quick Start
```bash
docker run -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=learningdb \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  ${DOCKER_USERNAME}/gravity:latest
```

## Environment Variables
- `PORT`: Application port (default: 8080)
- `DB_HOST`: Database hostname
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `SPRING_PROFILES_ACTIVE`: Spring profile (dev/prod)
