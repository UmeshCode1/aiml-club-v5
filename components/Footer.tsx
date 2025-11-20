'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Github, Mail, Phone } from 'lucide-react';

export default function Footer() {
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
    { name: 'Join Us', href: '/join' },
  ];

  const importantLinks = [
    { name: 'Suggestion Box', href: '/suggestions' },
    { name: 'Media Drive', href: 'https://drive.google.com/drive/folders/1-_byssQsFS1pw02iDxyt40_n2CdCBaOk' },
    { name: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VbAthv38V0tfulumuV1D' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo aiml.png"
                  alt="AIML Club Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-display font-bold text-xl">AIML Club</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Oriental College of Technology, Bhopal
            </p>
            <p className="text-gray-300 text-sm italic">
              Innovate • Implement • Inspire
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="space-y-3 mb-4">
              <a
                href="mailto:aimlcluboct@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>aimlcluboct@gmail.com</span>
              </a>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AI & ML Club - OCT. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ by AIML Club Tech Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
