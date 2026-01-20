# 🚨 URGENT: Fix Deployment Issues

## Current Status
Your deployment is failing with **2 critical issues**:

1. ❌ **MongoDB Connection Failure** - `querySrv ENOTFOUND _mongodb._tcp.nullscape.gpy7uvl.mongodb.net`
2. ⚠️ **Postinstall Script Error** - `Cannot find module 'scripts/create-indexes.js'`

---

## ✅ IMMEDIATE FIXES NEEDED

### 1. **RESUME MONGODB ATLAS CLUSTER** (Most Critical!)

**The cluster `nullscape.gpy7uvl` is paused or unreachable.**

#### Steps:
1. Go to https://cloud.mongodb.com
2. Log in to your account
3. Select your project
4. Click on your cluster (should show "Paused" status)
5. Click **"Resume"** button
6. Wait 2-3 minutes for cluster to fully resume
7. Verify cluster status shows "Running"

#### Why this happens:
- Free tier (M0) clusters auto-pause after 1 week of inactivity
- Render deployments fail when trying to connect to paused clusters

---

### 2. **VERIFY MONGODB_URI IN RENDER DASHBOARD**

1. Go to Render Dashboard
2. Click on your service (`nullscape-api`)
3. Go to **"Environment"** tab
4. Check if `MONGODB_URI` exists
5. Verify the format is correct:

```
mongodb+srv://username:password@nullscape.gpy7uvl.mongodb.net/database-name?retryWrites=true&w=majority
```

**Common Issues:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong username/password
- ❌ Special characters in password not URL-encoded (@ → %40, # → %23)
- ❌ Missing database name

**To get correct connection string:**
1. MongoDB Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password (URL-encoded if needed)
5. Replace `<dbname>` with your database name

---

### 3. **CHECK MONGODB ATLAS NETWORK ACCESS**

1. MongoDB Atlas → **Network Access**
2. Ensure one of these IPs is allowed:
   - `0.0.0.0/0` (allows all IPs - recommended for Render)
   - Or add Render's IP addresses

**Render uses dynamic IPs, so `0.0.0.0/0` is the best option.**

---

### 4. **PUSH CODE CHANGES TO GITHUB**

The `postinstall` script error will be fixed once you push the updated `package.json`.

```bash
cd nullscape-backend
git add package.json src/config/mongo.js render.yaml
git commit -m "Fix: Remove postinstall script and improve MongoDB error handling"
git push origin main
```

**What was fixed:**
- ✅ Removed `postinstall` script that was causing build warnings
- ✅ Improved MongoDB connection error messages
- ✅ Removed hardcoded PORT from render.yaml (Render provides it automatically)

---

## 🔍 Testing Before Deployment

### Test MongoDB Connection Locally:

```bash
cd nullscape-backend
node test-atlas-connection.js
```

This will verify your connection string works.

**Expected output if successful:**
```
✅ Connection Successful!
Host: nullscape-shard-00-02.gpy7uvl.mongodb.net
Database: your-database-name
Is MongoDB Atlas? YES ✅
```

---

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] MongoDB Atlas cluster is **RUNNING** (not paused)
- [ ] `MONGODB_URI` is set correctly in Render Dashboard
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Code changes are pushed to GitHub
- [ ] Connection string tested locally with `test-atlas-connection.js`

---

## 🚀 After Fixing

1. **Push code changes** to trigger new deployment
2. **Monitor Render logs** for successful connection
3. **Test health endpoint**: `https://your-service.onrender.com/api/v1/health`

Expected successful log:
```
Attempting MongoDB connection...
MongoDB connection initiated successfully
API server started on port 10000
```

---

## ❓ Still Having Issues?

### Check Render Logs for:
- MongoDB connection errors
- Missing environment variables
- Port binding issues

### Common Solutions:

**If cluster is resumed but still failing:**
- Wait 5-10 minutes (cluster takes time to fully resume)
- Double-check MONGODB_URI format
- Verify database user exists and has correct permissions

**If connection string is correct but failing:**
- Check Network Access settings
- Verify database user password is correct
- Try creating a new database user

---

**Last Updated:** 2026-01-20
**Status:** ⚠️ Pending MongoDB Atlas cluster resume and MONGODB_URI verification
