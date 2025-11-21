'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storageService, BUCKETS } from '@/lib/database';
import Image from 'next/image';

export default function GalleryAdmin() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await storageService.listFiles(BUCKETS.GALLERY_FILES);
            setImages(res.files);
        } catch (err: any) {
            setError(err.message || 'Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        setError(null);
        const file = e.target.files[0];

        try {
            await storageService.uploadFile(BUCKETS.GALLERY_FILES, file);
            await loadImages(); // Refresh list
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await storageService.deleteFile(BUCKETS.GALLERY_FILES, fileId);
            setImages(images.filter(img => img.$id !== fileId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete image');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">Gallery Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Upload and manage gallery images</p>
                </div>
                <button
                    onClick={loadImages}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload New Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4"></div>
                                ) : (
                                    <Upload className="w-10 h-10 mb-4 text-gray-400" />
                                )}
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, WEBP (MAX. 10MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading && images.length === 0 ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    ))
                ) : images.length > 0 ? (
                    images.map((file) => {
                        const previewUrl = storageService.getFilePreview(BUCKETS.GALLERY_FILES, file.$id, 400, 400).href;

                        return (
                            <div key={file.$id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <Image
                                    src={previewUrl}
                                    alt={file.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(file.$id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm text-white text-xs truncate">
                                    {file.name}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No images uploaded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
