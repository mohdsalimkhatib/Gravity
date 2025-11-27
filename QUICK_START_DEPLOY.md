# 🚀 QUICK START - Deploy to Internet in 15 Minutes

## Choose Your Platform

### ⭐ **RECOMMENDED: Railway.app**
**Easiest • Fastest • Free tier available**

---

## Step 1️⃣: Build Locally (3 min)
```bash
cd backend
mvn clean package -DskipTests
```
✅ Verify: Check if `backend/target/learning-0.0.1-SNAPSHOT.jar` exists

---

## Step 2️⃣: Push to GitHub (2 min)
```bash
git add .
git commit -m "Deploy to internet"
git push origin main
```

---

## Step 3️⃣: Create Railway Account (2 min)
1. Go to https://railway.app
2. Click "Login"
3. Click "GitHub" button
4. Authorize Railway to access GitHub

---

## Step 4️⃣: Create New Project (3 min)
1. Click "New Project"
2. Click "Deploy from GitHub"
3. Select repository: `Gravity`
4. Click "Deploy Now"

---

## Step 5️⃣: Add PostgreSQL Database (2 min)
1. In Railway dashboard, click "New"
2. Select "PostgreSQL"
3. Add to project
4. Railway auto-configures environment variables ✨

---

## Step 6️⃣: View Your App (2 min)
1. Click on your app in Railway dashboard
2. Go to "Deployments" tab
3. Click the URL under "Networking"
4. **Your app is live! 🎉**

---

## ✅ Verify Your Deployment

### Check if running:
```bash
# Replace URL with your Railway URL
curl https://your-app-name.up.railway.app/api/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Access Your App:
```
Frontend: https://your-app-name.up.railway.app
API: https://your-app-name.up.railway.app/api
```

---

## 🔧 If Something Goes Wrong

### Check Logs in Railway:
1. Dashboard → Your Project
2. Click "Backend" service
3. Go to "Deployments" tab
4. Click "View Logs"

### Common Issues:

**❌ Build failed?**
- Make sure `mvn clean package -DskipTests` works locally first
- Check Java version: `java -version` (should be 21)

**❌ Database not connecting?**
- Railway automatically adds PostgreSQL service
- Variables are auto-configured
- Wait 2-3 minutes after adding PostgreSQL

**❌ App won't start?**
- Check logs
- Verify environment variables are set
- Ensure port is set to 8080

---

## 📊 What You Get

✅ **Free Tier Includes:**
- 500 hours/month of compute (plenty for 1 app)
- PostgreSQL database
- Automatic HTTPS (SSL certificate)
- GitHub auto-deploy
- Logs & monitoring

✅ **Upgrade to Pro (optional):**
- More resources
- Multiple apps
- Team collaboration
- ~$5-20/month

---

## 🌐 Your App is Now Public!

**Access Point:** `https://your-app-name.up.railway.app`

Share this URL with anyone - they can use your app!

---

## 📚 Need More Help?

- **Full Guide:** `DEPLOYMENT_GUIDE.md`
- **All Commands:** `DEPLOYMENT_COMMANDS.md`
- **Visual Overview:** `README_DEPLOYMENT.md`
- **Technical Details:** `INTERNET_DEPLOYMENT_READY.md`

---

## 🎯 Next Steps (After Deployment)

1. **Test Your App**
   - Try all features
   - Upload files
   - Check database

2. **Set Custom Domain** (optional)
   - In Railway dashboard
   - Under "Networking"
   - Add your domain

3. **Monitor Performance**
   - Check Railway logs daily
   - Set up alerts

4. **Backup Database**
   - Railway does auto-backups
   - Configure backup schedule

---

## ⏱️ Timeline

- **Now:** You're reading this (1 min)
- **+1 min:** Go to railway.app
- **+3 min:** Connect GitHub
- **+5 min:** Deploy app
- **+2 min:** Add PostgreSQL
- **+3 min:** App is live!

**Total: ~15 minutes** ⏰

---

## 🚀 Go Now!

Your app is ready. Visit https://railway.app and deploy!

**Status:** ✅ Production Ready  
**Date:** November 27, 2025
