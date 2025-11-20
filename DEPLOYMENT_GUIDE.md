# 🚀 Deploying AIML Club Website to Appwrite Sites

## Prerequisites
- ✅ Appwrite account (you already have one)
- ✅ Project ID: 691e2b31003e6415bb4f
- ✅ Working Next.js application

## Deployment Steps

### Step 1: Build Your Application
First, create a production build of your Next.js app:

```bash
npm run build
```

### Step 2: Install Appwrite CLI (if not already installed)

**For Windows (PowerShell):**
```powershell
iwr -useb https://appwrite.io/cli/install.ps1 | iex
```

**Or using npm:**
```bash
npm install -g appwrite-cli
```

### Step 3: Login to Appwrite CLI

```bash
appwrite login
```

This will open a browser window. Login with your Appwrite account credentials.

### Step 4: Initialize Appwrite in Your Project

```bash
appwrite init
```

When prompted:
- **Select your organization**: Choose your organization
- **Select your project**: Choose "691e2b31003e6415bb4f" (AIML Club)
- **Would you like to create a new function?**: No (press N)

### Step 5: Create appwrite.json Configuration

Create `appwrite.json` in your project root with this content:

```json
{
    "projectId": "691e2b31003e6415bb4f",
    "projectName": "AIML Club",
    "sites": [
        {
            "name": "aiml-club-website",
            "rootDirectory": ".",
            "buildDirectory": ".next",
            "buildCommand": "npm run build",
            "framework": "nextjs"
        }
    ]
}
```

### Step 6: Deploy to Appwrite Sites

**Option A: Via Appwrite CLI**
```bash
appwrite deploy site
```

**Option B: Via Appwrite Console (Recommended for First Time)**

1. Go to: https://cloud.appwrite.io/console/project-691e2b31003e6415bb4f
2. Click on **"Sites"** in the left sidebar
3. Click **"Create site"** button
4. Choose deployment method:

#### **Method 1: Git Integration (Recommended)**
   - Connect your GitHub/GitLab/Bitbucket repository
   - Select the repository containing your code
   - Configure:
     - **Branch**: main (or your default branch)
     - **Root Directory**: /
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`
   - Click **"Create"**

#### **Method 2: Manual Upload**
   - Choose "Manual deployment"
   - Upload your built files (.next folder and other necessary files)
   - Note: This requires building locally first

### Step 7: Configure Environment Variables in Appwrite Sites

After creating the site, add your environment variables:

1. Go to your site settings
2. Click on **"Environment Variables"**
3. Add all variables from your `.env.local`:

```
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

### Step 8: Trigger Deployment

If using Git integration:
- Push to your repository
- Appwrite will automatically build and deploy

If using manual:
- Run the deploy command or upload files through console

## Alternative: Deploy to Vercel (Easier Option)

Since Appwrite Sites is still in development, you might want to use Vercel:

### Vercel Deployment Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

Follow the prompts:
- Link to existing project? No
- Project name: aiml-club
- Directory: ./
- Override settings? No

4. **Add Environment Variables:**
```bash
vercel env add NEXT_PUBLIC_APPWRITE_ENDPOINT
vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID
# ... add all other env variables
```

Or add them via Vercel Dashboard:
- Go to https://vercel.com
- Select your project
- Go to Settings → Environment Variables
- Add all variables from `.env.local`

5. **Deploy to Production:**
```bash
vercel --prod
```

## Quick Start Command

I'll create a deployment script for you. Run this:

```bash
npm run deploy:vercel
```

Or for Appwrite Sites:
```bash
npm run deploy:appwrite
```

## Need Help?

1. **For Appwrite Sites**: https://appwrite.io/docs/products/sites
2. **For Vercel**: https://vercel.com/docs
3. **Check deployment status** in respective dashboards

## What to Do Now?

Choose your preferred deployment method:
- ✅ **Vercel** (Recommended - easier, faster, free tier)
- ✅ **Appwrite Sites** (Native integration, still in beta)

Would you like me to:
1. Create deployment scripts in package.json?
2. Create the appwrite.json configuration file?
3. Guide you through Vercel deployment specifically?
