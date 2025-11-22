'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, FolderOpen, Eye, Image as ImageIcon, Layers } from 'lucide-react';
import { client, databases, COLLECTIONS, BUCKETS, subscribeToCollection, getPreviewUrl } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Album {
  $id: string;
  title: string;
  date: string;
  cover_image_url: string;
  photo_count: number;
  link?: string;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();

    // Real-time subscription
    const unsubscribe = subscribeToCollection(COLLECTIONS.ALBUMS, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        setAlbums((prev) => [response.payload as Album, ...prev]);
      } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        setAlbums((prev) =>
          prev.map((album) => (album.$id === response.payload.$id ? (response.payload as Album) : album))
        );
      } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
        setAlbums((prev) => prev.filter((album) => album.$id !== response.payload.$id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.ALBUMS,
        [Query.orderDesc('date')]
      );
      setAlbums(response.documents as unknown as Album[]);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get image source (URL or File ID)
  const getImageSrc = (album: Album) => {
    if (!album.cover_image_url) return '/images/placeholder-album.jpg'; // Fallback
    if (album.cover_image_url.startsWith('http')) return album.cover_image_url;
    // If it's a file ID, use the album-covers bucket or images bucket
    // We'll try album-covers first, but getPreviewUrl defaults to IMAGES bucket in lib/appwrite.ts
    // So we might need to manually construct it if it's in a different bucket
    // For now, assuming user puts full URL or file ID in IMAGES bucket as per previous pattern
    return getPreviewUrl(album.cover_image_url, 800, 600, BUCKETS.ALBUM_COVERS);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Header & Actions */}
        <div className="flex flex-col items-center text-center mb-16 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore moments captured from our workshops, hackathons, and community events.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
                  <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
                  View on Drive
                </span>
              </div>
            </a>

            <a
              href="#"
              className="group"
            >
              <div className="relative overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
                  <FolderOpen className="w-5 h-5 mr-2 text-yellow-400" />
                  Media Records
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Albums Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Layers className="w-8 h-8 mr-3 text-primary-500" />
              Recent Albums
            </h2>
            <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-primary-500/20 to-transparent rounded-full"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <motion.div
                  key={album.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden border-0 bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500">
                    {/* Cover Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <Image
                        src={getImageSrc(album)}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">{album.title}</h3>
                        <div className="flex items-center text-gray-300 text-sm space-x-4">
                          <span>{format(new Date(album.date), 'MMMM yyyy')}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span className="flex items-center">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            {album.photo_count} photos
                          </span>
                        </div>
                      </div>

                      {/* View Button Overlay */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <a
                          href={album.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          <Button variant="primary" className="rounded-full px-8">
                            <Eye className="w-4 h-4 mr-2" />
                            View Album
                          </Button>
                        </a>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <Layers className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Albums Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We haven&apos;t uploaded any albums yet. Check back soon!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
