# Troubleshooting Guide

## 🔍 Current Status Check

Your `.env.local` shows:
- ✅ All collection IDs are configured (auto_* IDs present)
- ✅ Appwrite connection details are set
- ✅ Database ID is set

So the Appwrite setup DID work! 🎉

---

## ❓ What Exactly Is Not Working?

Please help me understand by checking these:

### 1. Is the Dev Server Running?

Open Command Prompt and run:
```bash
cd "d:\AIML CLUB V5"
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

If you see errors, copy them and let me know!

---

### 2. Can You Access the Homepage?

Open browser: `http://localhost:3000`

**Expected:** Homepage loads, shows logo and content
**If it fails:** What error do you see?

---

### 3. Can You Access Admin Panel?

Open browser: `http://localhost:3000/admin`

**Expected:** Either login page OR admin dashboard
**If it fails:** What do you see? White screen? Error message?

---

### 4. Check Browser Console

Press F12 in browser, check Console tab.
Any red error messages? Copy them!

---

### 5. Check Terminal Output

When running `npm run dev`, check the terminal.
Any errors or warnings? Copy them!

---

## 🛠️ Quick Fixes

### Fix 1: Clean Build

```bash
# Stop the dev server (Ctrl+C)
# Then run:
rd /s /q .next
npm run dev
```

### Fix 2: Reinstall Dependencies

```bash
rd /s /q node_modules
npm install
npm run dev
```

### Fix 3: Check File Permissions

Make sure you can read/write in the project folder.

### Fix 4: Verify Node Version

```bash
node --version
```

Should be v18.0.0 or higher.

---

## 📊 Verification Commands

Run these and tell me the results:

### Check 1: Verify Collections Are Created
```bash
node -e "console.log('Collections configured:', require('dotenv').config({path:'.env.local'}), process.env.NEXT_PUBLIC_COLLECTION_EVENTS ? 'YES' : 'NO')"
```

### Check 2: Check if Highlights API Exists
```bash
dir app\api\highlights\route.ts
```

### Check 3: Check if Admin Files Exist
```bash
dir app\admin\layout.tsx
dir app\admin\page.tsx
```

### Check 4: Check if Notifications Page Exists
```bash
dir app\admin\notifications\page.tsx
```

---

## 🎯 Most Common Issues & Solutions

### Issue 1: "Port 3000 already in use"
**Solution:**
```bash
# Kill the process using port 3000
netstat -ano | findstr :3000
# Then kill that process ID
taskkill /PID <process_id> /F
```

### Issue 2: "Module not found"
**Solution:**
```bash
npm install
```

### Issue 3: "Cannot find module 'ts-node'"
**Solution:**
```bash
npm install --save-dev ts-node typescript
```

### Issue 4: White screen in browser
**Solutions:**
1. Check browser console (F12)
2. Check terminal for build errors
3. Clear browser cache
4. Try incognito mode

### Issue 5: Admin pages not styled
**Solutions:**
1. Check if Tailwind CSS is compiled
2. Clear .next folder
3. Restart dev server

---

## 📝 Tell Me Specifically

To help you better, please provide:

1. **Error Message**: Exact text of any error
2. **Which Page**: Homepage? Admin? Specific page?
3. **Browser Console**: Any red errors (F12)
4. **Terminal Output**: Any errors when running npm run dev
5. **Steps You Took**: What commands did you run?

Example format:
```
Problem: Admin dashboard shows white screen
Error in console: "Cannot GET /admin"
Steps: 
1. Ran npm run dev
2. Opened http://localhost:3000/admin
3. See white screen
Terminal shows: [copy error here]
```

---

## 🚀 Quick Test Script

Save this as `test-setup.js` and run `node test-setup.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking AIML Club Setup...\n');

// Check .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8');
  const hasTBD = env.includes('=TBD');
  console.log('✅ .env.local exists');
  console.log(hasTBD ? '❌ Still has TBD values' : '✅ All IDs configured');
} else {
  console.log('❌ .env.local not found');
}

// Check API routes
const highlightsApi = path.join(__dirname, 'app', 'api', 'highlights', 'route.ts');
console.log(fs.existsSync(highlightsApi) ? '✅ Highlights API exists' : '❌ Highlights API missing');

// Check admin layout
const adminLayout = path.join(__dirname, 'app', 'admin', 'layout.tsx');
console.log(fs.existsSync(adminLayout) ? '✅ Admin layout exists' : '❌ Admin layout missing');

// Check notifications page
const notificationsPage = path.join(__dirname, 'app', 'admin', 'notifications', 'page.tsx');
console.log(fs.existsSync(notificationsPage) ? '✅ Notifications page exists' : '❌ Notifications page missing');

// Check node_modules
const nodeModules = path.join(__dirname, 'node_modules');
console.log(fs.existsSync(nodeModules) ? '✅ Dependencies installed' : '❌ Need to run npm install');

console.log('\n📊 Summary:');
console.log('If you see ❌, that needs to be fixed.');
console.log('Run the specific fix for any missing items.\n');
```

---

## 💬 Next Steps

1. **Tell me what's broken**: Be specific - which page, what error?
2. **Run the test script**: `node test-setup.js` and share results
3. **Share error messages**: Console errors, terminal errors
4. **I'll give you exact fix**: Based on your specific issue

I'm ready to help once I know the specific problem! 🚀
