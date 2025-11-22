const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const currentEnv = fs.readFileSync(envPath, 'utf8');

// Extract API key from current env
const apiKeyMatch = currentEnv.match(/APPWRITE_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const newEnv = `NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=691e2b31003e6415bb4f
NEXT_PUBLIC_APPWRITE_DATABASE_ID=692136c3001bf41a6dfa
NEXT_PUBLIC_COLLECTION_TEAM=692136c400350f96d61e
APPWRITE_API_KEY=${apiKey}
`;

fs.writeFileSync(envPath, newEnv);
console.log('✅ Updated .env.local to use only new database');
