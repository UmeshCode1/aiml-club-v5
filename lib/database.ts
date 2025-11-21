import { ID, Query } from 'appwrite';
import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKETS } from './appwrite';

// Re-export for convenience
export { BUCKETS, COLLECTIONS, DATABASE_ID };

// ==================== EVENTS ====================

export interface Event {
  $id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  posterUrl?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  slug: string;
  type: 'Talk' | 'Session' | 'Workshop' | 'Test' | 'Event' | 'Hackathon' | 'Guest Lecture' | 'Orientation';
  gallery?: string[];
  $createdAt?: string;
  $updatedAt?: string;
}

export const eventService = {
  create: async (data: Omit<Event, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.EVENTS,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<Event>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.EVENTS,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.EVENTS, id);
  },

  get: async (id: string) => {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.EVENTS, id);
  },

  list: async (queries?: string[]) => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EVENTS,
      queries
    );
  },

  getUpcoming: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
      Query.equal('status', 'Scheduled'),
      Query.orderDesc('startDate'),
      Query.limit(100),
    ]);
  },

  getPast: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
      Query.equal('status', 'Completed'),
      Query.orderDesc('startDate'),
      Query.limit(100),
    ]);
  },

  getBySlug: async (slug: string) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EVENTS,
      [Query.equal('slug', slug), Query.limit(1)]
    );
    return response.documents[0] || null;
  },
};

// ==================== HIGHLIGHTS/BLOGS ====================

export interface Highlight {
  $id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  createdAt?: string;
  coverImage?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export const highlightService = {
  create: async (data: Omit<Highlight, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.HIGHLIGHTS,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<Highlight>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.HIGHLIGHTS,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.HIGHLIGHTS,
      id
    );
  },

  list: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.HIGHLIGHTS, [
      Query.orderDesc('createdAt'),
      Query.limit(100),
    ]);
  },

  getBySlug: async (slug: string) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.HIGHLIGHTS,
      [Query.equal('slug', slug), Query.limit(1)]
    );
    return response.documents[0] || null;
  },
};

// ==================== TEAM ====================

export interface TeamMember {
  $id?: string;
  name: string;
  role: string;
  category: 'faculty' | 'leadership' | 'finance' | 'tech' | 'event_heads' | 'stage' | 'media' | 'editors' | 'pr' | 'discipline';
  photoId?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  order: number;
  $createdAt?: string;
  $updatedAt?: string;
}

export const teamService = {
  create: async (data: Omit<TeamMember, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TEAM,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<TeamMember>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TEAM,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TEAM, id);
  },

  list: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAM, [
      Query.orderAsc('order'),
      Query.limit(100),
    ]);
  },

  getByCategory: async (category: string) => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAM, [
      Query.equal('category', category),
      Query.orderAsc('order'),
    ]);
  },
};

// ==================== MEMBERS ====================

export interface Member {
  $id?: string;
  name: string;
  email: string;
  phone: string;
  semester: string;
  course: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  subscribe: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

export const memberService = {
  create: async (data: Omit<Member, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MEMBERS,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<Member>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEMBERS,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MEMBERS, id);
  },

  list: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERS, [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]);
  },

  getPending: async () => {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERS, [
      Query.equal('status', 'Pending'),
      Query.orderDesc('$createdAt'),
    ]);
  },
};

// ==================== SUGGESTIONS ====================

export interface Suggestion {
  $id?: string;
  content: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  response?: string;
  status: 'Pending' | 'Responded';
  $createdAt?: string;
  $updatedAt?: string;
}

export const suggestionService = {
  create: async (data: Omit<Suggestion, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUGGESTIONS,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<Suggestion>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SUGGESTIONS,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.SUGGESTIONS,
      id
    );
  },

  list: async () => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUGGESTIONS,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
  },

  getPending: async () => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUGGESTIONS,
      [Query.equal('status', 'Pending'), Query.orderDesc('$createdAt')]
    );
  },
};

// ==================== NOTIFICATIONS ====================

export interface Notification {
  $id?: string;
  title: string;
  message: string;
  type: 'Info' | 'Event' | 'Alert' | 'Success';
  read: boolean;
  link?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export const notificationService = {
  create: async (data: Omit<Notification, '$id'>) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      ID.unique(),
      data
    );
  },

  update: async (id: string, data: Partial<Notification>) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      id,
      data
    );
  },

  delete: async (id: string) => {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      id
    );
  },

  list: async () => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      [Query.orderDesc('$createdAt'), Query.limit(50)]
    );
  },

  getUnread: async () => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      [Query.equal('read', false), Query.orderDesc('$createdAt')]
    );
  },

  markAsRead: async (id: string) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      id,
      { read: true }
    );
  },
};

// ==================== SUBSCRIBERS ====================

export interface Subscriber {
  $id?: string;
  email: string;
  active: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

export const subscriberService = {
  create: async (email: string) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      ID.unique(),
      { email, active: true }
    );
  },

  list: async () => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      [Query.equal('active', true)]
    );
  },

  unsubscribe: async (id: string) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      id,
      { active: false }
    );
  },
};

// ==================== STORAGE ====================

export const storageService = {
  uploadFile: async (bucketId: string, file: File) => {
    return await storage.createFile(bucketId, ID.unique(), file);
  },

  deleteFile: async (bucketId: string, fileId: string) => {
    return await storage.deleteFile(bucketId, fileId);
  },

  getFileView: (bucketId: string, fileId: string) => {
    return storage.getFileView(bucketId, fileId);
  },

  getFilePreview: (
    bucketId: string,
    fileId: string,
    width?: number,
    height?: number
  ) => {
    return storage.getFilePreview(bucketId, fileId, width, height);
  },

  listFiles: async (bucketId: string) => {
    return await storage.listFiles(bucketId);
  },
};
