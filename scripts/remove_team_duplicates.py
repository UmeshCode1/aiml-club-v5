import os
from appwrite.client import Client
from appwrite.services.database import Database

# Appwrite credentials
API_KEY = os.getenv('APPWRITE_API_KEY', 'standard_576696f64f09ff6c69be7bfb35e6d161592f20115185eae1a65f0a67ba05bfa0db5d2218a460b54e5bb7be726a6528bf34ed5d6d81b3a45cd0faeb1d760e233637162913d980e9300f488b28644195a24f82d5c095a9f2712bedd112febfd7a01dfb9c0ea1ec78d47f0defaa7d8b98a4adb5f6465a464f23088b1f4764403810')
PROJECT_ID = '691e2b31003e6415bb4f'
DATABASE_ID = '691e2d6e00131d7cccf1'
COLLECTION_ID = 'auto_1763586573960_ec75mk'

client = Client()
client.set_endpoint('https://fra.cloud.appwrite.io/v1')
client.set_project(PROJECT_ID)
client.set_key(API_KEY)

db = Database(client)

def remove_duplicates():
    # Fetch all documents
    result = db.list_documents(DATABASE_ID, COLLECTION_ID)
    docs = result['documents']
    seen = set()
    for doc in docs:
        unique_key = (doc.get('name'), doc.get('photoId'))  # Adjust fields as needed
        if unique_key in seen:
            db.delete_document(DATABASE_ID, COLLECTION_ID, doc['$id'])
            print(f"Deleted duplicate: {doc['$id']}")
        else:
            seen.add(unique_key)

if __name__ == "__main__":
    remove_duplicates()
    print("Duplicate removal complete.")
