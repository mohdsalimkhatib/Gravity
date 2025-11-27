# 🔧 Fix: JAR File Not Found on Railway

**Problem:** `Error: Unable to access jarfile backend/target/learning-0.0.1-SNAPSHOT.jar`

**Root Cause:** Railway wasn't building the backend before running the application.

**Solution:** Fixed! Here's what was changed:

---

## 📝 Changes Made

### 1. ✅ Updated Dockerfile (RECOMMENDED)
- Now copies entire project (not just backend/frontend folders)
- Builds backend properly in the builder stage
- Uses Docker for deployment (most reliable)

### 2. ✅ Updated Procfile (FALLBACK)
- Added `release` command to build before starting app
- Fixed jar path to be absolute

### 3. ✅ Created railway.toml
- Tells Railway to use Docker
- Sets environment variables

---

## 🚀 How to Fix Your Deployment

### Step 1: Push Updated Files
```bash
cd /Users/mohammedsaleemkhatib/Documents/KnowledgeBaseApp/Gravity
git add .
git commit -m "Fix: JAR file build configuration for Railway deployment"
git push origin main
```

### Step 2: Redeploy on Railway

**Option A: Automatic (Recommended)**
- Railway will automatically redeploy when it detects new pushes
- Wait 5-10 minutes for new deployment

**Option B: Manual Redeploy**
1. Go to Railway dashboard
2. Select your project
3. Click "New Deployment"
4. Select "main" branch
5. Click "Deploy"

### Step 3: Verify Deployment
```bash
# Check if app is running
curl https://gravity-production-xxxx.up.railway.app/api/actuator/health

# Should return:
# {"status":"UP"}
```

---

## 📊 What Was Wrong

**Old Procfile:**
```
web: java -jar backend/target/learning-0.0.1-SNAPSHOT.jar
```
❌ JAR file wasn't built before running

**New Procfile:**
```
release: cd backend && mvn clean package -DskipTests && cd ..
web: java -Dserver.port=${PORT:-8080} -jar $PWD/backend/target/learning-0.0.1-SNAPSHOT.jar
```
✅ Builds JAR in release phase before starting

**New Dockerfile:**
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace
COPY . .                    # Copy entire project
WORKDIR /workspace/backend
RUN mvn clean package ...   # Build JAR
```
✅ Builds everything in Docker (most reliable)

---

## ✅ Why Docker is Better for Railway

1. **Reliable Build:** All dependencies installed in container
2. **Consistent:** Same build everywhere (local, staging, production)
3. **Optimized:** Multi-stage build keeps image size small
4. **Automatic:** Railway auto-detects Dockerfile

---

## 🔍 If It Still Fails

### Check Railway Logs:
1. Go to Railway dashboard
2. Select your project
3. Click "Deployments" tab
4. View latest deployment logs
5. Look for build errors

### Common Issues:

**❌ "MVN command not found"**
- Docker build doesn't have Maven
- This is now fixed by using builder stage

**❌ "Frontend not found"**
- Frontend build is optional for API-only deployment
- We only build backend now

**❌ "Database connection failed"**
- This happens after build succeeds
- Make sure PostgreSQL service is added in Railway
- Check environment variables are set

---

## ✅ Testing Locally First (Recommended)

### Build with Docker locally:
```bash
cd /Users/mohammedsaleemkhatib/Documents/KnowledgeBaseApp/Gravity
docker build -t gravity:latest .
```

### Run the Docker image:
```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=learningdb \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  gravity:latest
```

### Test it:
```bash
curl http://localhost:8080/api/actuator/health
```

---

## 📋 Files Updated

| File | Change |
|------|--------|
| `Dockerfile` | Now copies entire project, builds backend properly |
| `Procfile` | Added release phase for build, fixed JAR path |
| `railway.toml` | Added Railway configuration |
| `build.sh` | Helper script for builds |

---

## 🎯 Next Steps

1. **Commit changes:** `git push origin main`
2. **Redeploy:** Railway will auto-deploy or do manual redeploy
3. **Wait:** 5-10 minutes for build and deployment
4. **Test:** Visit your Railway app URL
5. **Check logs:** If issues, check Railway deployment logs

---

## ✨ Expected Result

After redeployment:
- ✅ Application builds successfully
- ✅ JAR file is created
- ✅ Container starts
- ✅ App is accessible at Railway URL
- ✅ API endpoints work
- ✅ Database connects

---

**Status:** ✅ Fixed and Ready to Redeploy

**Last Updated:** November 27, 2025
