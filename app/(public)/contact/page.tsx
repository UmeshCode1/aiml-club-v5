'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, UserPlus, ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Have questions about the AI/ML Club? Want to collaborate? Send us a message and we&apos;ll get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side: Contact Form */}
        <Card className="p-8 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                placeholder="What is this about?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Your message here..."
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg"
              disabled={loading}
              variant="primary"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Right Side: Info & Recruitment */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-colors">
              <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">For general inquiries and collaborations</p>
                <a href="mailto:aimlcluboct@gmail.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  aimlcluboct@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-colors">
              <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600 dark:text-secondary-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Oriental College of Technology,<br />
                  Raisen Road, Bhopal, Madhya Pradesh
                </p>
              </div>
            </div>
          </div>

          {/* Recruitment Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 p-8 text-white shadow-2xl shadow-primary-500/20 transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <UserPlus className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-3">Want to be a core member?</h3>
              <p className="text-white/90 mb-8 leading-relaxed">
                Join our team of passionate developers, designers, and AI enthusiasts. We&apos;re always looking for new talent to help us grow.
              </p>

              <a
                href="https://forms.gle/recruitment-form-link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Apply Here
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
