'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { highlightService, Highlight } from '@/lib/database';
import { formatDate } from '@/lib/utils';

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const response = await highlightService.list();
      setHighlights(response.documents as any);
    } catch (error) {
      console.error('Error loading highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Club <span className="gradient-text">Highlights</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stories, insights, and updates from our journey
          </p>
        </div>

        {/* Highlights Grid */}
        {highlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <HighlightCard key={highlight.$id} highlight={highlight} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">
              No highlights available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HighlightCard({ highlight, index }: { highlight: Highlight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/highlights/${highlight.slug}`}>
        <Card hover className="h-full">
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(highlight.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{highlight.author}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3 line-clamp-2">
              {highlight.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
              {highlight.excerpt}
            </p>

            {/* Read More */}
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
              Read More
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
