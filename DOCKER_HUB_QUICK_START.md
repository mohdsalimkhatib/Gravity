# ⚡ Docker Hub CI/CD - Quick Start

**What:** Automatic Docker image build & push on every commit  
**When:** Every push to `main` branch  
**Where:** Docker Hub (hub.docker.com)  
**Cost:** Free (for public images)

---

## ⏱️ 5-Minute Setup

### 1. Create Docker Hub Account (1 min)
- Go to https://hub.docker.com
- Sign up (or sign in)
- Create repository named `gravity`

### 2. Get Access Token (2 min)
- Account Settings → Security
- Click "New Access Token"
- Name: `github-actions`
- Copy token (you'll need it)

### 3. Add GitHub Secrets (2 min)
Go to: https://github.com/mohdsalimkhatib/Gravity/settings/secrets/actions

**Add 2 secrets:**
```
Name: DOCKER_USERNAME
Value: your_docker_hub_username

Name: DOCKER_PASSWORD
Value: your_docker_hub_access_token
```

### 4. Push to GitHub (DONE!)
```bash
git push origin main
```

---

## 🚀 That's It!

Your workflow now:
1. Builds frontend (React)
2. Builds backend (Spring Boot)
3. Runs tests
4. Creates Docker image
5. Pushes to Docker Hub

All automatically! 🎉

---

## 📍 Find Your Image

### On Docker Hub:
```
https://hub.docker.com/r/YOUR_USERNAME/gravity
```

### Pull Command:
```bash
docker pull YOUR_USERNAME/gravity:latest
```

### Run:
```bash
docker run -p 8080:8080 \
  -e DB_HOST=db.example.com \
  -e DB_PASSWORD=your_password \
  YOUR_USERNAME/gravity:latest
```

---

## 📊 Image Tags

Each build creates multiple tags:

| Tag | Type | When |
|-----|------|------|
| `latest` | Recommended | Always points to newest |
| `main` | Branch | From main branch |
| `sha-a1b2c3d` | Commit hash | Specific version |

---

## 📚 More Info

See: `DOCKER_HUB_SETUP.md` for detailed setup

---

**Status:** ✅ Ready to configure  
**Time to Setup:** 5 minutes  
**Automated:** Every push to main
