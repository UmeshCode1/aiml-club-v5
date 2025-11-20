# AIML Club Website - Quick Start Guide

Get your website running in 5 minutes!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd "d:\AIML CLUB V5"
npm install
```

### Step 2: Configure Appwrite

1. Go to https://cloud.appwrite.io
2. Create a new project
3. Copy your **Project ID**

### Step 3: Setup Environment

Create `.env.local` file:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=paste_your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Use these collection names exactly
NEXT_PUBLIC_COLLECTION_EVENTS=events
NEXT_PUBLIC_COLLECTION_GALLERY=gallery
NEXT_PUBLIC_COLLECTION_MEMBERS=members
NEXT_PUBLIC_COLLECTION_SUGGESTIONS=suggestions
NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_COLLECTION_TEAM=team
NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=subscribers
NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=highlights

# Use these bucket names exactly
NEXT_PUBLIC_BUCKET_GALLERY=gallery
NEXT_PUBLIC_BUCKET_EVENTS=events
NEXT_PUBLIC_BUCKET_TEAM=team
```

### Step 4: Create Database in Appwrite

1. In Appwrite Console → **Databases** → Create Database
2. Copy the **Database ID** and update `.env.local`

### Step 5: Create Collections

Run this command to see collection schemas:
```bash
cat APPWRITE_SCHEMA.md
```

Or create them manually following `APPWRITE_SCHEMA.md`

**Quick collection list:**
- events
- highlights  
- team
- members
- suggestions
- notifications
- subscribers

### Step 6: Create Storage Buckets

1. In Appwrite Console → **Storage**
2. Create 3 buckets:
   - `gallery`
   - `events`
   - `team`

### Step 7: Enable Authentication

1. Appwrite Console → **Auth** → Email/Password
2. **Enable** Email/Password authentication

### Step 8: Create Admin User

1. Appwrite Console → **Auth** → Create User
2. Fill in:
   - Email: your-email@example.com
   - Password: your-secure-password
   - Name: Your Name
3. After creating, click the user → **Preferences**
4. Add this JSON:
```json
{
  "role": "President"
}
```

### Step 9: Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ Verify Everything Works

### Public Pages
- ✓ Home: http://localhost:3000
- ✓ Team: http://localhost:3000/team
- ✓ Events: http://localhost:3000/events
- ✓ Highlights: http://localhost:3000/highlights
- ✓ Gallery: http://localhost:3000/gallery
- ✓ Join: http://localhost:3000/join
- ✓ Suggestions: http://localhost:3000/suggestions

### Admin Panel
- ✓ Login: http://localhost:3000/admin/login
- ✓ Dashboard: http://localhost:3000/admin

**Login with the credentials you created in Step 8**

---

## 📦 Add Sample Data

### Method 1: Manual Entry (Easiest)

1. Go to http://localhost:3000/admin/login
2. Login with your admin credentials
3. Navigate to each section (Events, Team, Highlights)
4. Click "Create New" and add sample data

### Method 2: Import from Seed Files

Copy data from these files:
- `seed-data/events.ts` - Sample events
- `seed-data/highlights.ts` - Sample blog posts
- `seed-data/team.ts` - Core team members

Paste into Appwrite Console → Databases → Your Collection → Create Document

---

## 🖼️ Add Your Images

Copy your actual images to `public/images/`:

**Required images:**
```
public/images/logo aiml.png
public/images/oriental college image_edited.jpg
```

**Gallery images (from your folder):**
```
public/images/group photo.JPG
public/images/IMG_4003.JPG
public/images/IMG_4004.JPG
... (all your images)
```

Or upload directly to Appwrite Storage via Console.

---

## 🎨 Customize Content

### Update Social Links

Edit `components/Footer.tsx`:
```typescript
const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://tr.ee/hJjcCHWnGT', // Update this
    icon: Instagram,
  },
  // ... more links
];
```

### Update Tagline

Edit `app/(public)/page.tsx`:
```typescript
<p className="text-2xl md:text-3xl font-display italic">
  <span className="text-primary-600">Innovate</span> •{' '}
  <span className="text-secondary-600">Implement</span> •{' '}
  <span className="text-accent-neon">Inspire</span>
</p>
```

---

## 🔧 Common Issues

### "Cannot connect to Appwrite"
**Fix:** Check your Project ID in `.env.local` is correct

### "Unauthorized" error
**Fix:** 
1. Verify user exists in Appwrite Auth
2. Check user has `role` in Preferences
3. Clear browser cache and cookies

### Images not showing
**Fix:**
1. Verify images are in `public/images/`
2. Check file names match exactly (case-sensitive)
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Page is blank
**Fix:**
1. Check browser console for errors (F12)
2. Ensure all collections are created in Appwrite
3. Check `.env.local` has all required variables

---

## 📚 Next Steps

1. **Import Data:** Add events, team members, highlights
2. **Upload Photos:** Add event photos to gallery
3. **Test Forms:** Try join and suggestion forms
4. **Customize Design:** Modify colors in `tailwind.config.ts`
5. **Deploy:** Follow `DEPLOYMENT.md` when ready

---

## 🆘 Need Help?

**Documentation:**
- Full setup: `README.md`
- Database schema: `APPWRITE_SCHEMA.md`
- Functions: `APPWRITE_FUNCTIONS.md`
- Deployment: `DEPLOYMENT.md`

**Contact:**
- Email: aimlcluboct@gmail.com
- GitHub: https://github.com/aimlcluboct

---

## 🎯 Project Structure

```
AIML CLUB V5/
├── app/                    # Next.js pages
│   ├── (public)/          # Public website
│   │   ├── page.tsx       # Home
│   │   ├── team/          # Team page
│   │   ├── events/        # Events
│   │   └── ...
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── ui/               # UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/                   # Utilities
│   ├── appwrite.ts       # Appwrite config
│   ├── database.ts       # DB services
│   └── utils.ts          # Helpers
├── public/images/         # Static images
├── seed-data/            # Sample data
├── .env.local            # Environment vars (create this)
├── package.json          # Dependencies
└── README.md             # Full documentation
```

---

## ⚡ Development Tips

### Auto-reload on save
Changes to files automatically refresh the page

### View errors
Press `F12` to open browser console

### Stop server
Press `Ctrl + C` in terminal

### Restart server
```bash
npm run dev
```

### Format code (optional)
```bash
npm run lint
```

---

## 🎉 You're All Set!

Your website should now be running at http://localhost:3000

**What's working:**
- ✅ Beautiful homepage with animations
- ✅ Team member profiles
- ✅ Event listings  
- ✅ Join form (connects to Appwrite)
- ✅ Admin panel with login
- ✅ Dark mode toggle
- ✅ Fully responsive design

**Happy building! 🚀**
