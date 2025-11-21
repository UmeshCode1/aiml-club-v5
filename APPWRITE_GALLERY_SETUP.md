# Appwrite Collection Setup Instructions

## ⚠️ IMPORTANT: Manual Configuration Required

The `gallery_albums` collection has been created but needs attributes to be manually configured in the Appwrite console.

## Steps to Configure Collection

### 1. Navigate to Appwrite Console
Go to: https://cloud.appwrite.io/console/project-691e2b31003e6415bb4f/databases/database-691e2d6e00131d7cccf1/collection-gallery_albums

### 2. Add Attributes

Click on "Attributes" tab and add the following attributes:

#### String Attributes
| Key | Size | Required | Default | Array |
|-----|------|----------|---------|-------|
| `name` | 255 | ✅ Yes | - | No |
| `description` | 5000 | No | - | No |
| `date` | 50 | ✅ Yes | - | No |
| `coverPhotoId` | 255 | No | - | No |
| `photoIds` | 255 | No | - | ✅ **Yes** |
| `eventLink` | 1000 | No | - | No |
| `photographerName` | 255 | No | - | No |

#### Enum Attribute
| Key | Elements | Required | Default |
|-----|----------|----------|---------|
| `category` | `workshop`, `hackathon`, `seminar`, `team`, `project`, `inauguration`, `test`, `other` | ✅ Yes | - |

#### Boolean Attribute
| Key | Required | Default |
|-----|----------|---------|
| `isPublished` | ✅ Yes | `true` |

#### Integer Attribute
| Key | Min | Max | Required | Default |
|-----|-----|-----|----------|---------|
| `order` | 0 | 9999 | No | `0` |

### 3. Create Indexes

Click on "Indexes" tab and create:

| Index Key | Type | Attributes | Order |
|-----------|------|------------|-------|
| `category_index` | Key | `category` | ASC |
| `date_index` | Key | `date` | DESC |
| `published_index` | Key | `isPublished` | ASC |

### 4. Set Permissions

In "Settings" tab, ensure permissions are:
- **Read**: `any` (public can read)
- **Create**: `users` (authenticated users can create)
- **Update**: `users` (authenticated users can update)
- **Delete**: `users` (authenticated users can delete)

### 5. Create Storage Bucket

Navigate to Storage and create a bucket named `gallery`:
- **Bucket ID**: `gallery`
- **Permissions**: 
  - Read: `any`
  - Create: `users`
  - Update: `users`
  - Delete: `users`
- **File Size Limit**: 50MB
- **Allowed Extensions**: `jpg`, `jpeg`, `png`, `gif`, `webp`

## After Configuration

Once all attributes are configured, run:

```bash
node scripts/upload-gallery-albums.js
```

This will create the initial 4 albums with all uploaded photos.

## Verification

Test the API by visiting:
- http://localhost:3000/api/gallery-albums
- Should return empty array or albums if created successfully
