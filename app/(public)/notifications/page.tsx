'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Info, AlertCircle } from 'lucide-react';
import Loader from '@/components/ui/Loader';

interface Notification {
    $id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: string;
    read: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching notifications for now since we don't have a backend for it yet
        // In a real app, this would fetch from Appwrite
        setTimeout(() => {
            setNotifications([
                {
                    $id: '1',
                    title: 'Welcome to AIML Club!',
                    message: 'Thanks for joining our community. Stay tuned for upcoming events.',
                    type: 'success',
                    date: new Date().toISOString(),
                    read: false,
                },
                {
                    $id: '2',
                    title: 'Upcoming Workshop',
                    message: 'Don\'t miss our DSPL Workshop on Sept 11th.',
                    type: 'info',
                    date: '2024-09-05T10:00:00Z',
                    read: true,
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <Loader fullscreen />;

    return (
        <div className="py-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                            Notifications
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Stay updated with the latest club announcements
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-card p-2 rounded-full shadow-sm">
                        <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                </div>

                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <motion.div
                                key={notification.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border-l-4 ${notification.type === 'success' ? 'border-green-500' :
                                        notification.type === 'warning' ? 'border-yellow-500' :
                                            notification.type === 'error' ? 'border-red-500' :
                                                'border-primary-500'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                notification.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        }`}>
                                        {notification.type === 'success' ? <Bell className="w-5 h-5" /> :
                                            notification.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                                                notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                                    <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(notification.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No notifications
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            You're all caught up! Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
