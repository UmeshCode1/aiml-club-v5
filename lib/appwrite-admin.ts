import { Client, Account, Databases, Users } from 'node-appwrite';

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const API_KEY = process.env.APPWRITE_API_KEY;

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID);

    if (API_KEY) {
        client.setKey(API_KEY);
    }

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        }
    };
}
