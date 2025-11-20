'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
// We will submit via server API to allow public submissions
import toast from 'react-hot-toast';

export default function SuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [formData, setFormData] = useState({
    content: '',
    userName: '',
    userEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error('Please enter your suggestion');
      return;
    }

    if (!anonymous && (!formData.userName || !formData.userEmail)) {
      toast.error('Please provide your name and email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          anonymous,
          name: anonymous ? undefined : formData.userName,
          email: anonymous ? undefined : formData.userEmail,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to submit suggestion');
      }

      toast.success('Suggestion submitted successfully!');

      // Reset form
      setFormData({
        content: '',
        userName: '',
        userEmail: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Suggestion <span className="gradient-text">Box</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your feedback helps us grow. Share your thoughts, ideas, or suggestions!
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {anonymous ? (
                    <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">
                      {anonymous ? 'Anonymous Submission' : 'Submit with Identity'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {anonymous
                        ? 'Your identity will be kept private'
                        : 'We can follow up with you'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAnonymous(!anonymous)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    anonymous ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      anonymous ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Name & Email (if not anonymous) */}
              {!anonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.userEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, userEmail: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* Suggestion */}
              <Textarea
                label="Your Suggestion"
                placeholder="Share your thoughts, ideas, or feedback..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={8}
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Suggestion
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Tip:</strong> All suggestions are reviewed by our team. We value
            your feedback and use it to improve our club activities and services.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
