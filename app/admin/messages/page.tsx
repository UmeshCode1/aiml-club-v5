'use client';

import { useEffect, useState } from 'react';
import { messageService, Message } from '@/lib/database';
import { Mail, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const res = await messageService.list();
            setMessages(res.documents as unknown as Message[]);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await messageService.markAsRead(id);
            loadMessages(); // Reload to update UI
        } catch (error) {
            console.error('Failed to update message:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await messageService.delete(id);
            setMessages(messages.filter((m) => m.$id !== id));
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-gray-400">Total: </span>
                    <span className="text-white font-semibold">{messages.length}</span>
                </div>
            </div>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No messages found</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <motion.div
                            key={msg.$id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 rounded-xl border transition-all ${msg.status === 'unread'
                                    ? 'bg-purple-500/10 border-purple-500/30'
                                    : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-white text-lg">{msg.subject}</h3>
                                        {msg.status === 'unread' && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {msg.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(msg.$createdAt!).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-500">From: {msg.name}</span>
                                    </div>

                                    <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => handleMarkAsRead(msg.$id!)}
                                            className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                            title="Mark as Read"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(msg.$id!)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
