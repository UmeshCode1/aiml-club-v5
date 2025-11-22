'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Calendar, User, Tag, ArrowLeft, Share2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface BlogPost {
    $id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    authorId?: string;
    category: string;
    tags: string[];
    publishedAt: string;
    coverImageId?: string;
    featured: boolean;
    views: number;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    COLLECTIONS.BLOG || '',
        [
            Query.equal('slug', slug),
            Query.equal('status', 'published'),
            Query.limit(1)
        ]
            );

    if (response.documents.length > 0) {
        const postData = response.documents[0] as unknown as BlogPost;
        setPost(postData);

        // Increment view count
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.BLOG || '',
            postData.$id,
            { views: (postData.views || 0) + 1 }
        );

        // Fetch related posts
        fetchRelatedPosts(postData.category, postData.$id);
    }
} catch (error) {
    console.error('Error fetching blog post:', error);
} finally {
    setLoading(false);
}
    };

const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.BLOG || '',
            [
                Query.equal('category', category),
                Query.equal('status', 'published'),
                Query.limit(3)
            ]
        );

        const filtered = response.documents.filter(doc => doc.$id !== currentPostId);
        setRelatedPosts(filtered.slice(0, 3) as unknown as BlogPost[]);
    } catch (error) {
        console.error('Error fetching related posts:', error);
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const sharePost = () => {
    if (navigator.share) {
        navigator.share({
            title: post?.title,
            text: post?.excerpt,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
};

if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

if (!post) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Post Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
                <Button variant="primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Button>
            </Link>
        </div>
    );
}

return (
    <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
            </Link>

            {/* Article Header */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Category & Featured Badge */}
                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium">
                        {post.category}
                    </span>
                    {post.featured && (
                        <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                            Featured
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        <span>{post.views} views</span>
                    </div>
                    <button
                        onClick={sharePost}
                        className="flex items-center gap-2 hover:text-primary-500 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-primary-500 hover:prose-a:text-primary-600
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-primary-600 dark:prose-code:text-primary-400
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
              prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </motion.article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-20 pt-12 border-t border-gray-200 dark:border-white/10"
                >
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Related Posts</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedPosts.map(relatedPost => (
                            <Link key={relatedPost.$id} href={`/blog/${relatedPost.slug}`}>
                                <Card className="h-full hover:scale-105 transition-transform duration-300">
                                    <CardContent className="p-6 space-y-3">
                                        <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium inline-block">
                                            {relatedPost.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(relatedPost.publishedAt)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            )}
        </div>
    </div>
);
}
