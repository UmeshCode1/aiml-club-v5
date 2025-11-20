# Place your images in this directory

## Required Images

### Club Logos
- `logo aiml.png` - Main AIML Club logo
- `oriental college image_edited.jpg` - College logo

### Gallery Images (from your folder)
- `group photo.JPG`
- `IMG_4003.JPG`
- `IMG_4004.JPG`
- `IMG_4009.JPG`
- `IMG_9100.JPG`
- `IMG_20251013_152618991.jpg`
- `IMG-20251014-WA0085.jpg`
- `IMG20250826140734.jpg`
- `IMG20250826151704.jpg`

## Image Guidelines

### Recommended Sizes
- **Logos:** 512x512px (square)
- **Event Posters:** 1200x630px (landscape)
- **Gallery Photos:** 1920x1080px max
- **Team Photos:** 800x800px (square)

### Format
- Use JPG for photos
- Use PNG for logos with transparency
- Use WebP for better compression (optional)

### Optimization
- Compress images to reduce file size
- Use tools like:
  - TinyPNG (https://tinypng.com)
  - Squoosh (https://squoosh.app)
  - ImageOptim (Mac)

### Naming Convention
- Use lowercase
- Replace spaces with hyphens
- Example: `event-poster-workshop.jpg`

## Current Image Structure

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

## Alternative: Use Appwrite Storage

Instead of storing images locally, you can upload them directly to Appwrite Storage:

1. Go to Appwrite Console → Storage
2. Select bucket (gallery, events, or team)
3. Upload files
4. Copy File ID
5. Use in your documents

**Advantage:** Better for large image collections and easier management
