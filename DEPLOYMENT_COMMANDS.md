# Gravity Application - Quick Deployment Commands

## Local Development

### Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

### Start Backend Development Server
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
# Access at http://localhost:8080/api
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Creates dist/ folder with production files
```

### Build Backend for Production
```bash
cd backend
mvn clean package -DskipTests
# Creates target/learning-0.0.1-SNAPSHOT.jar
```

---

## Docker Local Deployment

### Build and Run with Docker Compose
```bash
# Set up environment variables
cp .env.example .env
# Edit .env and fill in your values

# Start all services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Access Services
- Backend API: http://localhost:8080/api
- Frontend: http://localhost:8080/
- PostgreSQL: localhost:5432 (from backend container)

---

## Railway Deployment (Easiest)

### Prerequisites
- GitHub account with your code pushed
- Railway.app account

### Deploy Steps
```bash
# 1. Build locally first to ensure it works
cd backend
mvn clean package -DskipTests

# 2. Push to GitHub
git add .
git commit -m "Prepare for Railway deployment"
git push origin main

# 3. Go to Railway.app
# - Connect your GitHub repo
# - Add PostgreSQL service
# - Configure environment variables
# - Railway will auto-deploy on push

# 4. View logs
railway logs
```

### Environment Variables in Railway
```
DB_HOST=${{ Postgres.PGHOST }}
DB_PORT=${{ Postgres.PGPORT }}
DB_NAME=${{ Postgres.PGDATABASE }}
DB_USER=${{ Postgres.PGUSER }}
DB_PASSWORD=${{ Postgres.PGPASSWORD }}
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

---

## Azure Deployment

### Prerequisites
```bash
brew install azure-cli
brew tap azure/azd && brew install azd
```

### Deploy
```bash
# Create azure.yaml (already provided)
# Login to Azure
az login

# Deploy
azd up

# View logs
azd logs
```

---

## AWS Deployment (using Elastic Beanstalk)

### Deploy
```bash
# Install AWS CLI
brew install awscli

# Configure AWS credentials
aws configure

# Deploy using Elastic Beanstalk CLI
eb init -p java-21 gravity
eb create gravity-env
eb deploy
```

---

## Health Check Endpoint

Once deployed, verify your application is running:

```bash
# Check backend health
curl https://your-app-domain.com/api/actuator/health

# Expected response:
# {"status":"UP"}
```

---

## Database Migration

For first-time deployment, the database schema will be created automatically due to:
```properties
spring.jpa.hibernate.ddl-auto=update
```

For production with existing data, consider using Flyway or Liquibase for migrations.

---

## Production Checklist

- [ ] Set strong DB_PASSWORD
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring alerts
- [ ] Configure domain name
- [ ] Enable auto-scaling (if using cloud provider)
- [ ] Set up CI/CD pipeline
- [ ] Test all endpoints in production
- [ ] Set up error tracking (e.g., Sentry)

---

## Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs backend

# Check if port is already in use
lsof -i :8080
```

### Database connection failed
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check database credentials
docker-compose logs postgres
```

### Frontend not loading
```bash
# Build frontend
cd frontend && npm run build

# Verify dist/ folder exists
ls -la frontend/dist/
```

### Port already in use
```bash
# Kill process using port 8080
lsof -t -i :8080 | xargs kill -9

# Or use different port
PORT=8081 docker-compose up
```

---

## Support & Documentation

- [Spring Boot Deployment](https://spring.io/projects/spring-boot)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

