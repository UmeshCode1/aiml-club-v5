'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Calendar, User, Tag, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface BlogPost {
    $id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    category: string;
    tags: string[];
    publishedAt: string;
    coverImageId?: string;
    featured: boolean;
    views: number;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');

    const categories = ['all', 'technical', 'event', 'tutorial', 'announcement', 'other'];
    COLLECTIONS.BLOG || '',
        [
            Query.equal('status', 'published'),
            Query.orderDesc('publishedAt'),
            Query.limit(100)
        ]
            );
    setPosts(response.documents as unknown as BlogPost[]);
} catch (error) {
    console.error('Error fetching blog posts:', error);
} finally {
    setLoading(false);
}
    };

const filterPosts = () => {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
        filtered = filtered.filter(post => post.tags?.includes(selectedTag));
    }

    setFilteredPosts(filtered);
};

const getAllTags = () => {
    const tagsSet = new Set<string>();
    posts.forEach(post => {
        post.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

return (
    <div className="min-h-screen py-20">
        <div className="container-width">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="text-gradient-blue">Blog</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Insights, tutorials, and updates from the AIML Club
                </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12 space-y-6"
            >
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 justify-center items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filters:</span>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 rounded-full glass border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* Tag Filter */}
                    {getAllTags().length > 0 && (
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="px-4 py-2 rounded-full glass border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Tags</option>
                            {getAllTags().map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    )}

                    {/* Clear Filters */}
                    {(searchQuery || selectedCategory !== 'all' || selectedTag !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedTag('all');
                            }}
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Blog Posts Grid */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No blog posts found.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.$id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <Card className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer">
                                    <CardContent className="p-6 space-y-4">
                                        {/* Category Badge */}
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                                                {post.category}
                                            </span>
                                            {post.featured && (
                                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(post.publishedAt)}</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Read More */}
                                        <div className="pt-4">
                                            <Button variant="ghost" className="text-primary-500 hover:text-primary-600">
                                                Read More →
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
}
