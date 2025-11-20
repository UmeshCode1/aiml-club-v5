# Deployment Guide

Complete guide to deploy the AIML Club website to production.

---

## Prerequisites

- [x] Appwrite project set up with all collections and buckets
- [x] Environment variables configured
- [x] Seed data imported
- [x] Appwrite Functions deployed
- [x] GitHub repository created
- [x] Vercel account

---

## Part 1: Prepare for Deployment

### 1. Update Environment Variables

Create `.env.local` with production values:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_SITE_URL=https://aimlcluboct.vercel.app

# Add all other environment variables from .env.example
```

### 2. Build and Test Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the production build
npm start
```

Verify:
- ✓ No build errors
- ✓ All pages load correctly
- ✓ Images display properly
- ✓ Forms submit successfully
- ✓ Admin login works

### 3. Optimize Images

Place your actual images in the `public/images/` folder:

```
public/images/
  ├── logo aiml.png
  ├── oriental college image_edited.jpg
  ├── group photo.JPG
  ├── IMG_4003.JPG
  ├── IMG_4004.JPG
  ├── IMG_4009.JPG
  ├── IMG_9100.JPG
  ├── IMG_20251013_152618991.jpg
  ├── IMG-20251014-WA0085.jpg
  ├── IMG20250826140734.jpg
  └── IMG20250826151704.jpg
```

**Optimize images:**
```bash
# Using imagemagick or online tools
# Resize to reasonable dimensions (max 1920px width)
# Compress to reduce file size
# Convert to WebP format for better performance (optional)
```

---

## Part 2: GitHub Setup

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: AIML Club website"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Create new repository: `aimlcluboct-website`
3. Don't initialize with README (we already have one)

### 3. Push to GitHub

```bash
git remote add origin https://github.com/aimlcluboct/aimlcluboct-website.git
git branch -M main
git push -u origin main
```

---

## Part 3: Vercel Deployment

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:

**Framework Preset:** Next.js

**Build Command:** (leave default)
```bash
npm run build
```

**Output Directory:** (leave default)
```
.next
```

**Install Command:** (leave default)
```bash
npm install
```

5. **Add Environment Variables:**

Click "Environment Variables" and add all variables from `.env.local`:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_COLLECTION_EVENTS=events
NEXT_PUBLIC_COLLECTION_GALLERY=gallery
NEXT_PUBLIC_COLLECTION_MEMBERS=members
NEXT_PUBLIC_COLLECTION_SUGGESTIONS=suggestions
NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_COLLECTION_TEAM=team
NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=subscribers
NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=highlights
NEXT_PUBLIC_BUCKET_GALLERY=gallery
NEXT_PUBLIC_BUCKET_EVENTS=events
NEXT_PUBLIC_BUCKET_TEAM=team
NEXT_PUBLIC_SITE_URL=https://aimlcluboct.vercel.app
```

6. Click "Deploy"

7. Wait for deployment (2-3 minutes)

8. Your site will be live at: `https://your-project.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

---

## Part 4: Custom Domain Setup (Optional)

### 1. Purchase Domain

Buy a domain from:
- Namecheap
- GoDaddy
- Google Domains
- Hostinger

Example: `aimlcluboct.in` or `aimlclub.oct.ac.in`

### 2. Configure DNS in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Vercel will provide DNS records

### 3. Update DNS Provider

Add these records to your domain's DNS:

**For root domain (aimlcluboct.in):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait for DNS propagation (5-30 minutes)**

### 4. Enable HTTPS

Vercel automatically provisions SSL certificate via Let's Encrypt.

---

## Part 5: Appwrite Configuration Updates

### 1. Update Platform URLs

In Appwrite Console → Your Project → Settings → Platforms

Add your Vercel URL:
```
https://aimlcluboct.vercel.app
```

If using custom domain:
```
https://aimlcluboct.in
https://www.aimlcluboct.in
```

### 2. Update CORS Origins

In Appwrite Console → Your Project → Settings:

Add origins:
```
https://aimlcluboct.vercel.app
https://aimlcluboct.in
```

### 3. Update OAuth Redirect URLs

If using OAuth in the future:
```
https://aimlcluboct.vercel.app/auth/callback
```

---

## Part 6: Post-Deployment Checklist

### Functionality Testing

- [ ] Home page loads correctly
- [ ] All navigation links work
- [ ] Events page displays events
- [ ] Team page shows team members
- [ ] Gallery loads images
- [ ] Join form submits successfully
- [ ] Suggestions form works
- [ ] Admin login functions
- [ ] Admin dashboard loads
- [ ] Dark mode toggle works
- [ ] Mobile responsive design works
- [ ] Images load properly
- [ ] No console errors

### Performance Testing

Use tools:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### SEO Setup

1. **Add sitemap.xml**

Create `app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://aimlcluboct.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://aimlcluboct.vercel.app/team',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://aimlcluboct.vercel.app/events',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Add more pages
  ];
}
```

2. **Add robots.txt**

Create `app/robots.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://aimlcluboct.vercel.app/sitemap.xml',
  };
}
```

3. **Submit to Search Engines**
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Part 7: Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel Dashboard → Your Project → Analytics

Features:
- Page view tracking
- Performance metrics
- Core Web Vitals

### 2. Google Analytics (Optional)

1. Create GA4 property
2. Add tracking code to `app/layout.tsx`:

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- Vercel's built-in error logging

---

## Part 8: Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update: Add new event"
git push origin main

# Vercel will automatically deploy
```

### Branch Previews

Push to a different branch for preview:
```bash
git checkout -b feature/new-design
# Make changes
git push origin feature/new-design

# Vercel creates preview URL
```

---

## Part 9: Backup & Recovery

### 1. Database Backups

**Manual Export:**
```javascript
// Script to export all collections
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('your_project_id')
  .setKey('your_api_key');

const databases = new sdk.Databases(client);

async function exportCollection(collectionId) {
  const docs = await databases.listDocuments('your_db_id', collectionId);
  // Save to file
}
```

**Automated Backups:**
- Use Appwrite's built-in backup feature (Enterprise plan)
- Or schedule weekly exports via cron job

### 2. Code Backups

- GitHub serves as version control
- Download repository regularly
- Keep local copies of `.env.local`

---

## Part 10: Maintenance

### Regular Tasks

**Weekly:**
- Check for broken links
- Review error logs
- Update content (events, highlights)

**Monthly:**
- Review performance metrics
- Update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`

**Quarterly:**
- Full backup of database
- Review and optimize images
- Update team member information

---

## Troubleshooting

### Build Fails on Vercel

**Check:**
1. Build logs for errors
2. Environment variables are set
3. Dependencies are correct
4. No TypeScript errors locally

**Common Issues:**
```bash
# Missing dependencies
npm install

# TypeScript errors
npm run type-check

# Build locally to test
npm run build
```

### Images Not Loading

**Check:**
1. Image paths are correct
2. Images exist in `public/images/`
3. File names match exactly (case-sensitive)
4. Appwrite storage is configured correctly

### Admin Login Not Working

**Check:**
1. Appwrite credentials are correct
2. User exists in Appwrite Auth
3. User has correct role in preferences
4. CORS is configured in Appwrite

---

## Support

If you encounter issues:

1. Check documentation
2. Review error logs
3. Search GitHub Issues
4. Contact: aimlcluboct@gmail.com

---

**Congratulations! Your website is now live! 🎉**
