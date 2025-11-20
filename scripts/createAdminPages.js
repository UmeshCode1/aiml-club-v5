const fs = require('fs');
const path = require('path');

// Create notifications directory
const notificationsDir = path.join(__dirname, '..', 'app', 'admin', 'notifications');
if (!fs.existsSync(notificationsDir)) {
  fs.mkdirSync(notificationsDir, { recursive: true });
  console.log('✅ Created notifications directory');
}

// Create highlights directory if needed
const highlightsDir = path.join(__dirname, '..', 'app', 'admin', 'highlights');
if (!fs.existsSync(highlightsDir)) {
  fs.mkdirSync(highlightsDir, { recursive: true });
  console.log('✅ Created highlights directory');
}

// Create notifications page.tsx
const notificationsPage = path.join(notificationsDir, 'page.tsx');
const notificationsContent = `'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Send, Check, X } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { notificationService } from '@/lib/database';
import toast from 'react-hot-toast';

interface Notification {
  $id: string;
  title: string;
  message: string;
  type: 'Info' | 'Event' | 'Alert' | 'Success';
  read: boolean;
  link?: string;
  $createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Info' as 'Info' | 'Event' | 'Alert' | 'Success',
    link: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.list();
      setNotifications(response.documents as Notification[]);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      await notificationService.create({
        title: formData.title,
        message: formData.message,
        type: formData.type,
        read: false,
        link: formData.link || undefined,
      });

      toast.success('Notification created successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', message: '', type: 'Info', link: '' });
      loadNotifications();
    } catch (error: any) {
      console.error('Error creating notification:', error);
      toast.error(error.message || 'Failed to create notification');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationService.delete(id);
      toast.success('Notification deleted');
      loadNotifications();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      toast.success('Marked as read');
      loadNotifications();
    } catch (error: any) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      Info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      Event: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      Alert: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      Success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    };
    return colors[type] || colors.Info;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      Info: '💡',
      Event: '📅',
      Alert: '⚠️',
      Success: '✅',
    };
    return icons[type] || '💡';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Bell className="text-primary-600" />
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system notifications and announcements
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">
          <Plus size={20} />
          Create Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter((n) => !n.read).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Read</div>
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter((n) => n.read).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Alerts</div>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter((n) => n.type === 'Alert').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24 rounded-lg" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Create your first notification to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.$id}
                  className={\`p-4 rounded-lg border transition-all \${
                    notification.read
                      ? 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-gray-800/50'
                      : 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10'
                  }\`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h3>
                          <span
                            className={\`px-2 py-1 text-xs font-medium rounded-full \${getTypeColor(
                              notification.type
                            )}\`}
                          >
                            {notification.type}
                          </span>
                          {!notification.read && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {notification.link}
                          </a>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.$createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.$id)}
                          variant="outline"
                          size="sm"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(notification.$id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Notification"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter notification title"
          />

          <Textarea
            label="Message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter notification message"
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Info">Info</option>
              <option value="Event">Event</option>
              <option value="Alert">Alert</option>
              <option value="Success">Success</option>
            </select>
          </div>

          <Input
            label="Link (Optional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://example.com"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" disabled={creating} className="flex-1">
              <Send size={20} />
              {creating ? 'Creating...' : 'Create Notification'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={creating}
            >
              <X size={20} />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
`;

fs.writeFileSync(notificationsPage, notificationsContent);
console.log('✅ Created notifications/page.tsx');

console.log('\n✨ Admin pages created successfully!');
