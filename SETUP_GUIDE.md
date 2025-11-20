# Complete Setup Guide - AIML Club Website

## 🚀 Quick Setup (Automated)

Run this single command to set up everything:

```bash
npm run setup:complete
```

This will:
1. Create all missing API routes
2. Set up all Appwrite collections and buckets
3. Automatically update your `.env.local` file with the correct IDs
4. Verify the connection

After running this, **restart your development server**:
```bash
npm run dev
```

---

## 📋 Prerequisites

Before running the setup, ensure you have:

1. **Appwrite Project** created at https://cloud.appwrite.io
2. **API Key** with the following permissions:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `documents.read`
   - `documents.write`
   - `files.read`
   - `files.write`

3. **Environment variables** in `.env.local`:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT` (e.g., https://fra.cloud.appwrite.io/v1)
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID` (from your Appwrite project)
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID` (from your Appwrite database)
   - `APPWRITE_API_KEY` (your API key with proper permissions)

---

## 🔧 What Gets Created

### Collections
- **Events** - Club events, workshops, and sessions
- **Highlights** - Blog posts and achievements
- **Team** - Core team member profiles
- **Members** - Membership applications
- **Suggestions** - User feedback and suggestions
- **Notifications** - System notifications
- **Subscribers** - Newsletter subscribers
- **Gallery** - Photo gallery items

### Storage Buckets
- **gallery** - Gallery images
- **events** - Event posters
- **team** - Team member photos

### API Routes
- `/api/events` - Fetch events data
- `/api/highlights` - Fetch highlights/blog posts
- `/api/team` - Fetch team members
- `/api/gallery` - Fetch gallery images

---

## 🐛 Troubleshooting

### Issue: "Missing required env vars"
**Solution:** Check that your `.env.local` file has all required variables set correctly.

### Issue: "Collection not configured"
**Solution:** Run `npm run setup:complete` to automatically configure all collections.

### Issue: "Failed to fetch data"
**Solutions:**
1. Verify your Appwrite endpoint is correct
2. Check that your API key has proper permissions
3. Ensure collections have been created (run setup script)
4. Check Appwrite console for any permission errors

### Issue: "TBD" in .env.local
**Solution:** This means collections haven't been created yet. Run `npm run setup:complete`.

---

## 📊 Verify Setup

After running the setup, you can verify everything works:

1. **Check .env.local** - All collection IDs should be populated (no "TBD" values)
2. **Start dev server** - `npm run dev`
3. **Visit homepage** - http://localhost:3000
4. **Check Appwrite Console** - Verify all collections and buckets exist

---

## 🔄 Re-running Setup

The setup script is safe to re-run. It will:
- Skip existing collections/buckets
- Update `.env.local` with any missing IDs
- Not duplicate or delete existing data

---

## 📝 Manual Setup (Alternative)

If you prefer manual setup:

1. Create collections in Appwrite Console following `APPWRITE_SCHEMA.md`
2. Copy each collection ID into `.env.local`
3. Create storage buckets: `gallery`, `events`, `team`
4. Set proper permissions on all collections and buckets
5. Run `node scripts/createMissingFiles.js` to create API routes

---

## 🎯 Next Steps

After successful setup:

1. **Add Sample Data** - Run seed scripts to populate with sample data
2. **Create Admin User** - Run `npm run create:admin` to create an admin account
3. **Test Features** - Test events, gallery, team pages
4. **Deploy** - Follow `DEPLOYMENT.md` for production deployment

---

## 🆘 Still Having Issues?

Check these files for more information:
- `APPWRITE_SCHEMA.md` - Database structure
- `QUICKSTART.md` - Quick start guide
- `PROJECT_OVERVIEW.md` - Overall project structure
- `QUICK_REFERENCE.md` - Command reference

Or check the Appwrite console logs for specific error messages.
