'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const bucketId = process.env.NEXT_PUBLIC_BUCKET_GALLERY!;

interface Doc { id: string; title: string; fileId: string; }

function previewUrl(fileId: string, w = 800) {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${project}&width=${w}&quality=80`;
}

export default function GalleryPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setDocs(data.docs || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <>
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Event <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Moments captured from our workshops, events, and activities
            </p>
          </div>

          {/* Gallery Grid */}
          {docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {docs.map((doc, index) => (
                <GalleryImage
                  key={doc.id}
                  doc={doc}
                  index={index}
                  onClick={() => setSelectedImage(previewUrl(doc.fileId, 1600))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">
                No images in gallery yet. Stay tuned for event photos!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
}

function GalleryImage({ doc, index, onClick }: { doc: Doc; index: number; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = previewUrl(doc.fileId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={onClick}
      className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className={`relative w-full h-full ${loaded ? '' : 'animate-pulse bg-gradient-to-br from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900'}`}>
        <Image
          src={imageUrl}
          alt={doc.title || 'Gallery image'}
          fill
          className={`object-cover group-hover:scale-110 transition-all duration-300 ${loaded ? 'blur-0' : 'blur-sm'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
          View
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
        <Image
          src={image}
          alt="Gallery Image"
          fill
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
