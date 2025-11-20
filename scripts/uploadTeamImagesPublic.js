const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_KEY = process.env.APPWRITE_API_KEY || 'standard_576696f64f09ff6c69be7bfb35e6d161592f20115185eae1a65f0a67ba05bfa0db5d2218a460b54e5bb7be726a6528bf34ed5d6d81b3a45cd0faeb1d760e233637162913d980e9300f488b28644195a24f82d5c095a9f2712bedd112febfd7a01dfb9c0ea1ec78d47f0defaa7d8b98a4adb5f6465a464f23088b1f4764403810';
const PROJECT_ID = '691e2b31003e6415bb4f';
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const BUCKET_ID = 'team';
const IMAGE_DIR = 'D:/AIML CLUB V5/Team members';

async function uploadImage(filePath, fileName, fileId) {
  const form = new FormData();
  form.append('fileId', fileId);
  form.append('file', fs.createReadStream(filePath), fileName);
  form.append('permissions[]', 'read("any")');

  const res = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    },
    body: form
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

async function main() {
  const files = fs.readdirSync(IMAGE_DIR);
  for (const file of files) {
    const filePath = path.join(IMAGE_DIR, file);
    const fileName = path.parse(file).name;
    const fileId = fileName.replace(/\s+/g, '').toLowerCase();
    try {
      const result = await uploadImage(filePath, fileName + path.extname(file), fileId);
      const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${result.$id}/view?project=${PROJECT_ID}`;
      console.log(`${fileName}: ${url}`);
    } catch (err) {
      console.error(`Error uploading ${file}:`, err.message);
    }
  }
}

main();
