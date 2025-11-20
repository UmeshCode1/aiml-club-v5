# Appwrite Database Schema

This document provides the complete database schema for the AIML Club website.

## Collections

### 1. events

Stores information about club events (workshops, talks, hackathons, etc.)

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| title | string | ✓ | ✗ | 255 |
| description | string | ✓ | ✗ | 5000 |
| startDate | datetime | ✓ | ✗ | - |
| endDate | datetime | ✓ | ✗ | - |
| location | string | ✓ | ✗ | 255 |
| posterUrl | string | ✗ | ✗ | 500 |
| status | enum | ✓ | ✗ | Scheduled, Completed, Cancelled |
| slug | string | ✓ | ✗ | 255 |
| type | enum | ✓ | ✗ | Talk, Session, Workshop, Test, Event, Hackathon, Guest Lecture, Orientation |
| gallery | string | ✗ | ✓ | 100 |

**Indexes:**
- slug (unique)
- status
- startDate
- type

---

### 2. highlights

Blog posts and club highlights

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| title | string | ✓ | ✗ | 255 |
| slug | string | ✓ | ✗ | 255 |
| excerpt | string | ✓ | ✗ | 500 |
| content | string | ✓ | ✗ | 50000 |
| author | string | ✓ | ✗ | 100 |
| createdAt | datetime | ✓ | ✗ | - |
| coverImage | string | ✗ | ✗ | 500 |

**Indexes:**
- slug (unique)
- createdAt
- author

---

### 3. team

Core team member profiles

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| name | string | ✓ | ✗ | 100 |
| role | string | ✓ | ✗ | 100 |
| category | enum | ✓ | ✗ | Faculty, President, Vice President, Event Head, Media, Tech, Discipline, Editor, Stage |
| photo | string | ✗ | ✗ | 500 |
| email | string | ✗ | ✗ | 255 |
| phone | string | ✗ | ✗ | 15 |
| instagram | string | ✗ | ✗ | 255 |
| linkedin | string | ✗ | ✗ | 255 |
| github | string | ✗ | ✗ | 255 |
| order | integer | ✓ | ✗ | - |

**Indexes:**
- category
- order

---

### 4. members

Club membership applications

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| name | string | ✓ | ✗ | 100 |
| email | string | ✓ | ✗ | 255 |
| phone | string | ✓ | ✗ | 15 |
| semester | string | ✓ | ✗ | 10 |
| course | string | ✓ | ✗ | 100 |
| reason | string | ✓ | ✗ | 1000 |
| status | enum | ✓ | ✗ | Pending, Approved, Rejected |
| subscribe | boolean | ✓ | ✗ | - |

**Indexes:**
- email (unique)
- status
- $createdAt

---

### 5. suggestions

Anonymous and named suggestions from users

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| content | string | ✓ | ✗ | 5000 |
| anonymous | boolean | ✓ | ✗ | - |
| userName | string | ✗ | ✗ | 100 |
| userEmail | string | ✗ | ✗ | 255 |
| response | string | ✗ | ✗ | 5000 |
| status | enum | ✓ | ✗ | Pending, Responded |

**Indexes:**
- status
- $createdAt

---

### 6. notifications

System notifications for users

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| title | string | ✓ | ✗ | 255 |
| message | string | ✓ | ✗ | 1000 |
| type | enum | ✓ | ✗ | Info, Event, Alert, Success |
| read | boolean | ✓ | ✗ | - |
| link | string | ✗ | ✗ | 500 |

**Indexes:**
- read
- $createdAt
- type

---

### 7. subscribers

Email subscribers for newsletters

| Field | Type | Required | Array | Size/Values |
|-------|------|----------|-------|-------------|
| email | string | ✓ | ✗ | 255 |
| active | boolean | ✓ | ✗ | - |

**Indexes:**
- email (unique)
- active

---

## Storage Buckets

### 1. gallery
- **Purpose:** Event photos and gallery images
- **Max File Size:** 10 MB
- **Allowed Extensions:** jpg, jpeg, png, webp
- **Permissions:** Read: Anyone, Write: Users

### 2. events
- **Purpose:** Event posters and promotional materials
- **Max File Size:** 5 MB
- **Allowed Extensions:** jpg, jpeg, png, webp
- **Permissions:** Read: Anyone, Write: Users

### 3. team
- **Purpose:** Team member profile photos
- **Max File Size:** 2 MB
- **Allowed Extensions:** jpg, jpeg, png, webp
- **Permissions:** Read: Anyone, Write: Users

---

## Permissions Guide

### Collection Permissions

**Public Read Access:**
All collections should have read access set to "Any" so visitors can view content.

**Write Access:**

| Collection | Create | Update | Delete |
|------------|--------|--------|--------|
| events | Admin only | Admin only | Admin only |
| highlights | Admin only | Admin only | Admin only |
| team | Admin only | Admin only | Admin only |
| members | Any (for forms) | Admin only | Admin only |
| suggestions | Any (for forms) | Admin only | Admin only |
| notifications | Admin only | Users (own) | Admin only |
| subscribers | Any (for forms) | Admin only | Admin only |

### Setting Up Roles

1. Create a Team called "Admins" in Appwrite
2. Add admin users to this team
3. Set collection permissions to allow team:admins for write operations

---

## Relationships

```
events → gallery (array of image IDs)
highlights → author (string, not relational)
team → category (enum grouping)
members → status (workflow: Pending → Approved/Rejected)
suggestions → status (workflow: Pending → Responded)
```

---

## Migration Notes

If you're migrating from an existing system:

1. Export data in JSON format
2. Transform to match the schema above
3. Use Appwrite SDK or REST API to import
4. Run validation queries to ensure data integrity

---

## Backup Strategy

- Enable Appwrite's automatic backups
- Export collections monthly
- Store backups in separate cloud storage
- Test restore procedures quarterly
