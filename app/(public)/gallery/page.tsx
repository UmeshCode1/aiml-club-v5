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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 mb-6">
                <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                Gallery Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We'll be adding photos from our events and activities soon. Check back later!
              </p>
            </motion.div>
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
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className={`relative w-full h-full ${loaded ? '' : 'animate-pulse bg-gradient-to-br from-primary-200 via-secondary-200 to-primary-300 dark:from-primary-900 dark:via-secondary-900 dark:to-primary-800 animate-gradient-xy'}`}>
        <Image
          src={imageUrl}
          alt={doc.title || 'Gallery image'}
          fill
          className={`object-cover group-hover:scale-110 transition-all duration-500 ${loaded ? 'blur-0' : 'blur-sm'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6">
        <div className="text-white font-semibold text-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {doc.title || 'View Image'}
        </div>
        <div className="w-12 h-1 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300" />
      </div>
    </motion.div>
  );
}

function Lightbox({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 group"
      >
        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative max-w-6xl max-h-[90vh] w-full h-full"
      >
        <Image
          src={image}
          alt="Gallery Image"
          fill
          className="object-contain drop-shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </motion.div>
  );
}
