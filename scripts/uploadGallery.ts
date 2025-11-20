/**
 * Upload all images from local folder to Appwrite gallery bucket and
 * create gallery collection documents referencing each file.
 * Usage: npx ts-node scripts/uploadGallery.ts
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const bucketId = process.env.NEXT_PUBLIC_BUCKET_GALLERY; // gallery
const rawGalleryCollectionId = process.env.NEXT_PUBLIC_COLLECTION_GALLERY;
const galleryCollectionId = rawGalleryCollectionId === 'TBD' ? 'auto_1763586583858_5bdqms' : rawGalleryCollectionId; // fallback
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!endpoint || !project || !apiKey || !bucketId || !galleryCollectionId || !databaseId) {
  console.error('Missing required env vars for upload.');
  process.exit(1);
}
if (galleryCollectionId === 'TBD') {
  console.error('Gallery collection ID still TBD. Update .env.local.');
  process.exit(1);
}

const SOURCE_DIR = path.join(process.cwd(), 'Images', 'Gallary preview');
if (!fs.existsSync(SOURCE_DIR)) {
  console.error('Source directory not found:', SOURCE_DIR);
  process.exit(1);
}

async function api(method: string, subPath: string, formData?: FormData, jsonBody?: any) {
  const url = endpoint + subPath;
  const init: any = {
    method,
    headers: {
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey
    }
  };
  if (formData) {
    init.body = formData;
  } else if (jsonBody) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(jsonBody);
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${subPath} ${res.status}: ${text}`);
  return data;
}

async function uploadFile(filePath: string) {
  const fileName = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer]);
  const form = new FormData();
  form.append('file', blob, fileName);
  form.append('fileId', 'unique()');
  form.append('permissions[]', 'read("any")');
  const fileData = await api('POST', `/storage/buckets/${bucketId}/files`, form);
  return fileData; // contains $id
}

async function createGalleryDoc(file: any, order: number) {
  const title = file.name || file.filename || file.$id;
  const docBody = {
    documentId: 'unique()',
    data: {
      fileId: file.$id,
      title
    },
    permissions: ['read("any")']
  };
  await api('POST', `/databases/${databaseId}/collections/${galleryCollectionId}/documents`, undefined, docBody);
}

(async () => {
  try {
    const files = fs.readdirSync(SOURCE_DIR).filter(f => /\.(png|jpg|jpeg|gif|webp|JPG)$/i.test(f));
    if (files.length === 0) {
      console.log('No image files found to upload.');
      return;
    }
    console.log('Uploading', files.length, 'images...');
    let order = 1;
    for (const fileName of files) {
      const full = path.join(SOURCE_DIR, fileName);
      console.log('Uploading:', fileName);
      const uploaded = await uploadFile(full);
      console.log('Uploaded file ID:', uploaded.$id);
      await createGalleryDoc(uploaded, order++);
      console.log('Created gallery doc for file:', uploaded.$id);
    }
    console.log('Upload complete.');
  } catch (e: any) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
})();
