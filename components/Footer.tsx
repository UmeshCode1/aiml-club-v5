'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Github, Mail, Send, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubscribing(false);
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://tr.ee/hJjcCHWnGT',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/aimlcluboct',
      icon: Linkedin,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/aimlcluboct',
      icon: Github,
    },
    {
      name: 'Email',
      href: 'mailto:aimlcluboct@gmail.com',
      icon: Mail,
    },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Events', href: '/events' },
    { name: 'Highlights', href: '/highlights' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Admin Login', href: '/admin/login' },
  ];

  const importantLinks = [
    { name: 'Suggestion Box', href: '/suggestions' },
    { name: 'Media Drive', href: 'https://drive.google.com/drive/folders/1-_byssQsFS1pw02iDxyt40_n2CdCBaOk' },
    { name: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VbAthv38V0tfulumuV1D' },
  ];

  return (
    <footer className="relative bg-gray-950 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/aiml-logo/view?project=691e2b31003e6415bb4f"
                  alt="AIML Club Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="font-display font-bold text-2xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                AIML Club
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm leading-relaxed">
                Oriental College of Technology, Bhopal
              </p>
              <p className="text-gray-300 text-sm font-medium italic">
                Innovate • Implement • Inspire
              </p>
            </div>

            {/* Subscribe Form */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold mb-3 text-gray-200">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all group-hover:bg-white/10"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={subscribing}
                  className="!px-4 rounded-xl shadow-lg shadow-primary-500/20"
                >
                  {subscribing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Resources</h4>
            <ul className="space-y-3">
              {importantLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    className="group flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Connect With Us</h4>
            <div className="space-y-4 mb-6">
              <a
                href="mailto:aimlcluboct@gmail.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors text-sm group"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>aimlcluboct@gmail.com</span>
              </a>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AI & ML Club - OCT. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse-glow text-lg">❤️</span>
              <span>by AIML Club Tech Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
