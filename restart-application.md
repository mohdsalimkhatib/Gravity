---
description: How to restart the Gravity application (backend and frontend)
---

# Restarting the Gravity Application

This guide explains how to restart both the backend (Spring Boot) and frontend (React) servers.

## Prerequisites

- Java 17+ installed
- Maven installed
- Node.js and npm installed

## Option 1: Restart Both Servers

### Step 1: Stop Running Processes

First, stop any running instances:

```bash
# Stop backend (Spring Boot) - Find and kill process on port 8080
lsof -t -i :8080 | xargs kill -9

# Stop frontend (Vite) - Find and kill process on port 5173
lsof -t -i :5173 | xargs kill -9
```

### Step 2: Start Backend

```bash
cd /Users/mohammedsaleemkhatib/Documents/Gravity/backend
mvn test
mvn spring-boot:run
```

Wait for the backend to fully start (you should see "Started LearningApplication" in the logs).

### Step 3: Start Frontend (in a new terminal)

```bash
cd /Users/mohammedsaleemkhatib/Documents/Gravity/frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Option 2: Restart Only Backend

```bash
# Stop backend
lsof -t -i :8080 | xargs kill -9

# Start backend
cd /Users/mohammedsaleemkhatib/Documents/KnowledgeBaseApp/Gravity/backend
mvn test
mvn spring-boot:run
```

## Option 3: Restart Only Frontend

```bash
# Stop frontend
lsof -t -i :5173 | xargs kill -9

# Start frontend
cd /Users/mohammedsaleemkhatib/Documents/KnowledgeBaseApp/Gravity/frontend
npm run dev
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using port 8080 (backend)
lsof -i :8080

# Check what's using port 5173 (frontend)
lsof -i :5173

# Kill the process using the port
kill -9 <PID>
```

### Backend Won't Start

1. Make sure you're in the correct directory
2. Verify Java is installed: `java -version`
3. Verify Maven is installed: `mvn -version`
4. Try cleaning and rebuilding: `mvn clean package`

### Frontend Won't Start

1. Make sure you're in the correct directory
2. Verify Node.js is installed: `node -version`
3. Try reinstalling dependencies: `npm install`

## Quick Reference

**Backend URL:** `http://localhost:8080`  
**Frontend URL:** `http://localhost:5173`  
**API Endpoints:** `http://localhost:8080/api/learnings`
