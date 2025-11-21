'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Image as ImageIcon, RefreshCw } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryAlbum {
    $id: string;
    name: string;
    description: string;
    date: string;
    category: string;
    photoIds: string[];
    coverPhotoId: string;
    eventLink: string;
    photographerName: string;
    isPublished: boolean;
    order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    workshop: 'Workshop',
    hackathon: 'Hackathon',
    seminar: 'Seminar',
    team: 'Team',
    project: 'Project',
    inauguration: 'Inauguration',
    test: 'Test',
    other: 'Other'
};

const CATEGORY_COLORS: Record<string, string> = {
    workshop: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    hackathon: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    seminar: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    team: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    project: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    inauguration: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    test: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
};

export default function AlbumsAdmin() {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/gallery-albums?published=false');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load albums');
            }

            setAlbums(data.albums || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load albums');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const response = await fetch(`/api/gallery-albums/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete album');
            }

            setAlbums(albums.filter(album => album.$id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete album');
        }
    };

    const togglePublished = async (album: GalleryAlbum) => {
        try {
            const response = await fetch(`/api/gallery-albums/${album.$id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !album.isPublished })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update album');
            }

            const data = await response.json();
            setAlbums(albums.map(a => a.$id === album.$id ? data.album : a));
        } catch (err: any) {
            setError(err.message || 'Failed to update album');
        }
    };

    const getImageUrl = (fileId: string) => {
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/gallery/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    };

    const filteredAlbums = filter === 'all'
        ? albums
        : albums.filter(a => a.category === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">Album Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage gallery albums and events</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadAlbums}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        href="/admin/albums/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Album</span>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                >
                    All ({albums.length})
                </button>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                    const count = albums.filter(a => a.category === key).length;
                    if (count === 0) return null;

                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === key
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Albums Grid */}
            {loading && albums.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse h-80" />
                    ))}
                </div>
            ) : filteredAlbums.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlbums.map((album) => (
                        <Card key={album.$id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Cover Image */}
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                                {album.coverPhotoId ? (
                                    <Image
                                        src={getImageUrl(album.coverPhotoId)}
                                        alt={album.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${album.isPublished
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}>
                                        {album.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                {/* Category Badge */}
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${CATEGORY_COLORS[album.category]}`}>
                                    {CATEGORY_LABELS[album.category]}
                                </span>

                                {/* Album Info */}
                                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{album.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                    {album.description || 'No description'}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(album.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" />
                                        <span>{album.photoIds?.length || 0} photos</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => togglePublished(album)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                        title={album.isPublished ? 'Unpublish' : 'Publish'}
                                    >
                                        {album.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        <span>{album.isPublished ? 'Hide' : 'Show'}</span>
                                    </button>
                                    <Link
                                        href={`/admin/albums/${album.$id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(album.$id, album.name)}
                                        className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No albums found</p>
                        <p className="text-sm">
                            {filter === 'all'
                                ? 'Create your first album to get started'
                                : 'No albums in this category'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-primary-500">{albums.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Albums</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-500">
                            {albums.filter(a => a.isPublished).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-500">
                            {albums.filter(a => !a.isPublished).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-500">
                            {albums.reduce((sum, a) => sum + (a.photoIds?.length || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Photos</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
