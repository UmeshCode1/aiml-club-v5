# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] All features working locally
- [x] Database collections created
- [x] Environment variables configured
- [x] API routes tested
- [ ] Build succeeds locally
- [ ] No TypeScript errors

## 🎯 Choose Your Deployment Platform

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy environment variable management
- ✅ Automatic deployments from Git
- ✅ Perfect for Next.js (made by same team)

**Quick Steps:**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
npm run deploy:vercel:preview

# 4. When ready for production
npm run deploy:vercel
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Vercel auto-detects Next.js settings
5. Add environment variables (copy from .env.local)
6. Click "Deploy"

---

### Option 2: Appwrite Sites (Native Integration)

**Why Appwrite Sites?**
- ✅ Native Appwrite integration
- ✅ Same dashboard as your database
- ✅ Unified platform

**Quick Steps:**
```bash
# 1. Install Appwrite CLI
npm install -g appwrite-cli

# 2. Login
appwrite login

# 3. Deploy
npm run deploy:appwrite
```

**Or use Appwrite Console:**
1. Go to https://cloud.appwrite.io/console/project-691e2b31003e6415bb4f
2. Click "Sites" in sidebar
3. Click "Create site"
4. Connect Git or upload files
5. Add environment variables
6. Deploy

---

## 📋 Step-by-Step: Vercel Deployment (Detailed)

### Step 1: Test Local Build
```bash
npm run build
npm start
```
Visit http://localhost:3000 and verify everything works.

### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3: Login to Vercel
```bash
vercel login
```
Choose your preferred login method (GitHub, GitLab, Email, etc.)

### Step 4: Deploy Preview
```bash
vercel
```
Answer the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- What's your project's name? **aiml-club**
- In which directory is your code located? **./**
- Want to override settings? **No**

### Step 5: Add Environment Variables

**Via CLI:**
```bash
vercel env add NEXT_PUBLIC_APPWRITE_ENDPOINT production
vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID production
vercel env add NEXT_PUBLIC_APPWRITE_DATABASE_ID production
vercel env add APPWRITE_API_KEY production
# Add all other variables
```

**Or via Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from `.env.local`

### Step 6: Deploy to Production
```bash
vercel --prod
```

Your site will be live at: `https://aiml-club.vercel.app` (or custom domain)

---

## 🔧 Environment Variables to Add

Copy these from your `.env.local` to your deployment platform:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=691e2b31003e6415bb4f
NEXT_PUBLIC_APPWRITE_DATABASE_ID=691e2d6e00131d7cccf1
APPWRITE_API_KEY=your-api-key-here
NEXT_PUBLIC_COLLECTION_EVENTS=auto_1763586568976_qt1sfp
NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=auto_1763586571724_psmsmf
NEXT_PUBLIC_COLLECTION_TEAM=auto_1763586573960_ec75mk
NEXT_PUBLIC_COLLECTION_MEMBERS=auto_1763586576829_9d9mwm
NEXT_PUBLIC_COLLECTION_SUGGESTIONS=auto_1763586579090_lvnnos
NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=auto_1763586581248_oi4e46
NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=auto_1763586582606_wjggpt
NEXT_PUBLIC_COLLECTION_GALLERY=auto_1763586583858_5bdqms
NEXT_PUBLIC_BUCKET_GALLERY=gallery
NEXT_PUBLIC_BUCKET_EVENTS=events
NEXT_PUBLIC_BUCKET_TEAM=team
```

⚠️ **Important:** Never commit your `.env.local` file to Git!

---

## 🌐 Custom Domain Setup (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Vercel provides automatic HTTPS

### On Appwrite Sites:
1. Go to Site Settings → Domains
2. Add custom domain
3. Follow DNS setup instructions

---

## 🎯 What's Next?

After deployment:
1. ✅ Test all pages on live URL
2. ✅ Verify database connections work
3. ✅ Test image uploads
4. ✅ Check all API routes
5. ✅ Test on mobile devices
6. ✅ Share with team!

---

## 🆘 Troubleshooting

**Build fails?**
- Run `npm run build` locally first
- Check for TypeScript errors: `npm run type-check`
- Review build logs in deployment dashboard

**Environment variables not working?**
- Make sure they're added to production environment
- Redeploy after adding variables
- Check variable names match exactly

**API routes returning errors?**
- Verify Appwrite endpoint is accessible
- Check API key has correct permissions
- Review server logs in dashboard

**Images not loading?**
- Check bucket permissions in Appwrite
- Verify bucket IDs are correct
- Ensure CORS is configured properly

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Appwrite Sites**: https://appwrite.io/docs/products/sites
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Ready to deploy? Let's go! 🚀**

Recommended: Start with Vercel for easiest deployment.
