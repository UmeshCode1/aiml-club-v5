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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {highlights.map((highlight, index) => (
              <HighlightCard key={highlight.$id} highlight={highlight} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 mb-6">
              <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z\" />\n              </svg>\n            </div>\n            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">\n              No Highlights Yet\n            </h3>\n            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto\">\n              We&apos;ll be sharing exciting stories, insights, and updates from our journey soon!\n            </p>\n          </motion.div>
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
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link href={`/highlights/${highlight.slug}`}>
        <Card hover className="h-full group">
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>{formatDate(highlight.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-secondary-500" />
                <span>{highlight.author}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {highlight.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
              {highlight.excerpt}
            </p>

            {/* Read More */}
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
