# 🐳 Docker Hub Integration - Setup Guide

**Updated:** November 27, 2025  
**Workflow:** GitHub Actions → Docker Hub  
**Status:** Ready to configure

---

## 📋 What Was Updated

Your `main.yml` GitHub Actions workflow has been updated to:

✅ Build your application (frontend + backend)  
✅ Run tests  
✅ Create a Docker image  
✅ Push to Docker Hub automatically on every push to `main`  
✅ Tag images with branch, semver, sha, and latest  
✅ Update Docker Hub repository description  

---

## 🔑 Setup Required - Add GitHub Secrets

### Step 1: Get Your Docker Hub Credentials

1. Go to https://hub.docker.com
2. Sign in (or create account if needed)
3. Click your profile → **Account Settings**
4. Click **Security** tab
5. Click **New Access Token**
6. Create token:
   - Token name: `github-actions`
   - Permissions: Read, Write
   - Copy the token

### Step 2: Create Docker Hub Repository

1. Go to https://hub.docker.com
2. Click **Create Repository**
3. Repository name: `gravity`
4. Visibility: `Public` (recommended) or `Private`
5. Click **Create**

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo: https://github.com/mohdsalimkhatib/Gravity
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add these 2 secrets:**

#### Secret 1: DOCKER_USERNAME
- **Name:** `DOCKER_USERNAME`
- **Value:** Your Docker Hub username
- Click **Add secret**

#### Secret 2: DOCKER_PASSWORD
- **Name:** `DOCKER_PASSWORD`
- **Value:** Your Docker Hub access token (NOT your password)
- Click **Add secret**

---

## ✅ Verify Secrets Are Set

After adding secrets:
1. Go to GitHub repo **Settings** → **Secrets and variables** → **Actions**
2. You should see:
   - ✅ `DOCKER_USERNAME`
   - ✅ `DOCKER_PASSWORD`

---

## 🚀 How It Works Now

### On Every Push to `main`:

```
1. Code pushed to GitHub
2. GitHub Actions workflow triggers
3. JDK 21 is set up
4. Node.js is set up
5. Frontend is built (npm run build)
6. Backend is compiled (mvn clean package)
7. Tests are run (mvn test)
8. Docker image is built
9. Image is pushed to Docker Hub
10. Repository description is updated
```

### Docker Images Created

Your images will be available at:

```
docker.io/YOUR_USERNAME/gravity:main
docker.io/YOUR_USERNAME/gravity:sha-XXXXXXX
docker.io/YOUR_USERNAME/gravity:latest
```

---

## 📊 Workflow File Changes

### What Changed in `main.yml`:

| Component | Before | After |
|-----------|--------|-------|
| Jobs | 2 (build, deploy to Netlify) | 2 (build, docker-build-push) |
| Docker Support | ❌ None | ✅ Full Docker build & push |
| Registry | ❌ None | ✅ Docker Hub |
| Image Tagging | ❌ N/A | ✅ Multiple tags (branch, sha, latest) |
| Caching | ❌ No Docker cache | ✅ GitHub Actions cache |

---

## 🎯 Test the Workflow

### Step 1: Push a Change
```bash
cd /Users/mohammedsaleemkhatib/Documents/KnowledgeBaseApp/Gravity
git add .
git commit -m "Add Docker Hub integration to CI/CD"
git push origin main
```

### Step 2: Watch GitHub Actions
1. Go to your repo on GitHub
2. Click **Actions** tab
3. Watch the workflow run
4. Should complete in ~10-15 minutes

### Step 3: Check Docker Hub
1. Go to https://hub.docker.com
2. Click your profile
3. Go to **Repositories**
4. Look for `gravity` repository
5. You should see your Docker image with tags

---

## 🐳 Pull and Run Your Docker Image

After the workflow completes successfully:

### Pull the image:
```bash
docker pull YOUR_USERNAME/gravity:latest
```

### Run locally:
```bash
docker run -p 8080:8080 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  -e DB_NAME=learningdb \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  YOUR_USERNAME/gravity:latest
```

### Access:
- Frontend: http://localhost:8080
- API: http://localhost:8080/api
- Health: http://localhost:8080/api/actuator/health

---

## 📋 Workflow Features

### Automatic Image Tagging

Your images are tagged with:

| Tag | When | Example |
|-----|------|---------|
| `main` | On main branch | `gravity:main` |
| `latest` | On main branch (default) | `gravity:latest` |
| `sha-XXXXX` | On any commit | `gravity:sha-a1b2c3d` |

### Example Tags You'll See:
```
gravity:latest           (most recent main branch)
gravity:main             (main branch)
gravity:sha-a1b2c3d      (specific commit)
```

---

## ✨ Benefits

✅ **Automated Builds:** Every push builds a new Docker image  
✅ **Docker Hub Sync:** Automatically pushes to Docker Hub  
✅ **Version Control:** Multiple tags for different versions  
✅ **Easy Deployment:** Deploy from Docker Hub to any platform  
✅ **Caching:** Uses GitHub Actions cache for faster builds  
✅ **Easy Sharing:** Anyone can pull your image  

---

## 🔧 Troubleshooting

### Workflow fails with "authentication failed"

**Solution:**
1. Check secrets are set correctly
2. Verify Docker Hub credentials
3. Try creating new access token

### Image not appearing on Docker Hub

**Solution:**
1. Check GitHub Actions logs (Actions tab)
2. Look for error messages
3. Verify secrets are configured
4. Verify Docker Hub repository exists

### Build takes too long

**Solution:**
1. GitHub Actions cache helps (first build is slowest)
2. Subsequent builds use cache (faster)
3. Be patient on first build (~15 minutes)

---

## 📚 Next Steps

### Step 1: Configure Secrets ✅
Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` to GitHub Secrets

### Step 2: Verify Repository ✅
Create `gravity` repository on Docker Hub

### Step 3: Trigger Workflow ✅
Push a change to main branch

### Step 4: Monitor Build ✅
Watch GitHub Actions workflow run

### Step 5: Deploy from Docker ✅
Pull image from Docker Hub and deploy anywhere

---

## 🚀 Deploy Your Docker Image

Once in Docker Hub, you can deploy to:

- **Railway.app** - `docker pull YOUR_USERNAME/gravity:latest`
- **AWS ECS** - Direct Docker Hub integration
- **Google Cloud Run** - Build from Docker Hub
- **Azure Container Instances** - Pull from Docker Hub
- **DigitalOcean** - App Platform integration
- **Any VPS** - Just run `docker pull` and `docker run`

---

## 📖 Reference

### GitHub Actions Documentation
- https://docs.github.com/en/actions

### Docker Hub
- https://hub.docker.com
- https://docs.docker.com/docker-hub/

### Docker Build & Push Action
- https://github.com/docker/build-push-action

---

## ✅ Quick Checklist

- [ ] Created Docker Hub account
- [ ] Created `gravity` repository on Docker Hub
- [ ] Created Docker Hub access token
- [ ] Added `DOCKER_USERNAME` to GitHub Secrets
- [ ] Added `DOCKER_PASSWORD` to GitHub Secrets
- [ ] Pushed changes to GitHub
- [ ] GitHub Actions workflow ran successfully
- [ ] Docker image appears on Docker Hub
- [ ] Successfully pulled image: `docker pull YOUR_USERNAME/gravity:latest`

---

## 🎉 You're All Set!

Your CI/CD pipeline now:
1. ✅ Builds everything on every push
2. ✅ Runs tests automatically
3. ✅ Creates Docker image
4. ✅ Pushes to Docker Hub
5. ✅ Updates Docker Hub description

**From now on, every push to `main` will automatically create and push a Docker image!**

---

**Status:** ✅ Ready to configure and use  
**Last Updated:** November 27, 2025
