# Deploy Gravity Application to the Internet

**Date:** November 27, 2025  
**Application:** Gravity (React Frontend + Spring Boot 3.5 Backend)  
**Status:** Ready for Deployment

---

## Overview

Your application consists of:
- **Frontend:** React 19.2 + Vite (SPA - Single Page Application)
- **Backend:** Spring Boot 3.5.0 with Java 21
- **Database:** H2 Database (currently file-based)

To make your application available on the internet, you have several deployment options. I'll cover the most popular and cost-effective approaches.

---

## Deployment Options

### Option 1: Azure Cloud (Recommended - Free Trial Available)
**Pros:** Integrated with Microsoft ecosystem, free tier available, excellent Spring Boot support  
**Cons:** Requires Azure account

### Option 2: AWS (Amazon Web Services)
**Pros:** Industry standard, extensive features, free tier  
**Cons:** Can be complex to set up

### Option 3: Railway.app (Easiest - Recommended for Quick Deployment)
**Pros:** Dead simple, free tier, GitHub integration  
**Cons:** Limited features compared to major clouds

### Option 4: Render
**Pros:** Free tier, GitHub integration, simple deployment  
**Cons:** Free tier has limitations

---

## Step-by-Step: Deploy to Railway.app (Quickest Way)

### Prerequisites
1. Create a GitHub account (if you don't have one)
2. Push your code to GitHub
3. Create a Railway account at https://railway.app

### Step 1: Prepare Your Application

#### 1.1 Create Production Build for Frontend
```bash
cd frontend
npm run build
```
This creates a `dist` folder with production-ready files.

#### 1.2 Configure Backend to Serve Frontend
Update your Spring Boot backend to serve the React build files.

**Add to `backend/pom.xml`** (in dependencies):
```xml
<!-- Frontend Maven Plugin to build React app -->
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>1.15.0</version>
    <configuration>
        <workingDirectory>../frontend</workingDirectory>
        <installDirectory>target</installDirectory>
    </configuration>
    <executions>
        <execution>
            <id>install node and npm</id>
            <goals>
                <goal>install-node-and-npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <nodeVersion>v21.7.1</nodeVersion>
                <npmVersion>10.5.0</npmVersion>
            </configuration>
        </execution>
        <execution>
            <id>npm install</id>
            <goals>
                <goal>npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <arguments>install</arguments>
                <workingDirectory>../frontend</workingDirectory>
            </configuration>
        </execution>
        <execution>
            <id>npm run build</id>
            <goals>
                <goal>npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <arguments>run build</arguments>
                <workingDirectory>../frontend</workingDirectory>
            </configuration>
        </execution>
    </executions>
</plugin>

<!-- Copy built frontend to backend resources -->
<plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.3.1</version>
    <executions>
        <execution>
            <id>copy-resources</id>
            <phase>process-resources</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <outputDirectory>${basedir}/src/main/resources/static</outputDirectory>
                <resources>
                    <resource>
                        <directory>../frontend/dist</directory>
                        <filtering>false</filtering>
                    </resource>
                </resources>
            </configuration>
        </execution>
    </executions>
</plugin>
```

**Or Manually:** Copy `frontend/dist` folder contents to `backend/src/main/resources/static`

#### 1.3 Update Backend Application Properties
**File: `backend/src/main/resources/application.properties`**

```properties
# Server Configuration
server.port=${PORT:8080}
server.servlet.context-path=/api

# Application name
spring.application.name=learning

# Database Configuration (Use PostgreSQL in production instead of H2)
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:learningdb}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Disable H2 console in production
spring.h2.console.enabled=false

# CORS Configuration for Frontend
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

#### 1.4 Update Backend pom.xml - Add PostgreSQL Driver

Add to `backend/pom.xml` dependencies:
```xml
<!-- PostgreSQL Database -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### 1.5 Create Controller to Serve Frontend

Create file: `backend/src/main/java/com/example/learning/controller/IndexController.java`
```java
package com.example.learning.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }
}
```

### Step 2: Create Railway Deployment Files

#### 2.1 Create Procfile
**File: `backend/Procfile`**
```
web: java -Dserver.port=${PORT} -jar target/learning-0.0.1-SNAPSHOT.jar
```

#### 2.2 Create .railwayignore
**File: `.railwayignore`**
```
node_modules/
.git
.env
.gitignore
.DS_Store
frontend/node_modules
backend/target
```

### Step 3: Push to GitHub

```bash
# Initialize git repo if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for cloud deployment - add production configs"

# Push to GitHub (replace with your repo)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Gravity.git
git push -u origin main
```

### Step 4: Deploy on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize and select your `Gravity` repository
5. Configure variables:
   - `JAVA_VERSION`: 21
   - `PORT`: 8080
6. Add PostgreSQL service:
   - Click "Add Service"
   - Select "PostgreSQL"
   - Railway will auto-configure database variables
7. Set environment variables:
   - `DB_HOST`: `${{ Postgres.PGHOST }}`
   - `DB_PORT`: `${{ Postgres.PGPORT }}`
   - `DB_USER`: `${{ Postgres.PGUSER }}`
   - `DB_PASSWORD`: `${{ Postgres.PGPASSWORD }}`
   - `DB_NAME`: `${{ Postgres.PGDATABASE }}`

### Step 5: Build Backend with Frontend

```bash
cd backend
mvn clean package -DskipTests
```

This will automatically build the React frontend and include it in the JAR file.

---

## Option: Deploy to Azure (More Enterprise-Ready)

### Prerequisites
```bash
# Install Azure CLI
brew install azure-cli

# Login to Azure
az login

# Install azd (Azure Developer CLI)
brew tap azure/azd && brew install azd
```

### Create azure.yaml

**File: `azure.yaml`**
```yaml
version: 1.0
name: gravity
metadata:
  template: gravity-app@latest
services:
  backend:
    project: ./backend
    language: java
    host: appservice
  frontend:
    project: ./frontend
    language: js
    host: appservice
```

### Deploy

```bash
azd up
```

---

## Option: Docker Containerization (for Any Cloud)

### Create Dockerfile for Backend

**File: `backend/Dockerfile`**
```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY backend/ .
COPY frontend ../frontend
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/learning-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
```

### Create docker-compose.yml

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: learningdb
      DB_USER: postgres
      DB_PASSWORD: postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: learningdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Build and Run Locally

```bash
docker-compose up --build
```

### Deploy Docker Image

Push to Docker Hub or any container registry, then deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- Heroku
- DigitalOcean App Platform

---

## Environment Variables Needed for Production

```bash
# Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=learningdb
DB_USER=dbuser
DB_PASSWORD=secure_password

# Application
PORT=8080
SERVER_CONTEXT_PATH=/api
```

---

## Security Checklist Before Going Live

- [ ] Change default database credentials
- [ ] Enable HTTPS/SSL certificate (Let's Encrypt free option available)
- [ ] Set up proper CORS configuration
- [ ] Enable authentication/authorization
- [ ] Add input validation
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Enable database backups
- [ ] Use environment variables for all secrets
- [ ] Enable HTTP security headers
- [ ] Perform security testing

---

## Monitoring & Maintenance

### Add Application Monitoring (Optional but Recommended)

**Add to pom.xml:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Add to application.properties:**
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Set Up Alerts

Configure cloud provider to send alerts for:
- High CPU usage
- High memory usage
- Errors in logs
- Database connectivity issues

---

## Cost Estimates (Approximate - 2024 Pricing)

| Platform | Free Tier | Pay-as-you-go | Notes |
|----------|-----------|---------------|-------|
| **Railway** | 5 GB RAM/month | $5-50/month | Easiest to start |
| **Render** | Shared CPU | $7-100/month | Good free tier |
| **Azure** | 1 year free | $10-50/month | Enterprise option |
| **AWS** | 1 year free | $15-100/month | Most features |
| **DigitalOcean** | None | $5-100/month | Simple & clear |
| **Heroku** | Deprecated | $7-50/month | Used to be easiest |

---

## Quick Start - Railway Deployment (5 Minutes)

1. **Build:** `cd backend && mvn clean package -DskipTests`
2. **Push to GitHub:** Commit and push your code
3. **Create Railway account:** https://railway.app
4. **Connect GitHub repo:** Select your repository
5. **Add PostgreSQL:** Railway will handle database setup
6. **Deploy:** Railway automatically deploys on push

Your app will be live at: `https://your-app-name.up.railway.app`

---

## Next Steps

**Choose your deployment option above and let me know if you need help with:**
1. Setting up environment variables
2. Configuring the database
3. Deploying to a specific platform
4. Setting up custom domain
5. Configuring SSL certificate
6. Setting up CI/CD pipeline

**I recommend starting with Railway.app for simplicity, then move to Azure/AWS for production.**

