// Team Member Types
export type TeamCategory =
    | 'faculty'
    | 'leadership'
    | 'finance'
    | 'tech'
    | 'event_heads'
    | 'stage'
    | 'media'
    | 'editors'
    | 'pr'
    | 'discipline';

export interface TeamMember {
    $id?: string;
    name: string;
    role: string;
    category: TeamCategory;
    photoId?: string;
    email?: string;
    phone?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    order: number;
    imageUrl?: string;
    $createdAt?: string;
    $updatedAt?: string;
}

// Event Types
export interface Event {
    $id?: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string;
    imageId?: string;
    registrationLink?: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    $createdAt?: string;
    $updatedAt?: string;
}

// Highlight Types
export interface Highlight {
    $id?: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    slug: string;
    imageId?: string;
    $createdAt?: string;
    $updatedAt?: string;
}

// Gallery Types
export interface GalleryImage {
    $id?: string;
    title: string;
    description?: string;
    imageId: string;
    category?: string;
    eventId?: string;
    uploadedBy?: string;
    $createdAt?: string;
    $updatedAt?: string;
}
