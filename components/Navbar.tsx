'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDark(theme === 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifications/unread');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        // Silently fail - notification count is not critical
        console.debug('Failed to fetch notification count');
      }
    };
    
    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/highlights', label: 'Highlights' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/join', label: 'Join Us' },
    { href: '/health', label: 'Status' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/team', label: 'Team' },
    { href: '/admin/members', label: 'Members' },
    { href: '/admin/gallery', label: 'Gallery' },
    { href: '/admin/suggestions', label: 'Suggestions' },
  ];

  const links = isAdminRoute ? adminLinks : navLinks;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out',
        scrolled
          ? 'bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl shadow-xl shadow-primary-500/5 border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo aiml.png"
                alt="AIML Club Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AIML Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-all duration-300 relative group',
                  pathname === link.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110'
                )}
              >
                {link.label}
                <span className={cn(
                  'absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 group-hover:w-full',
                  pathname === link.href && 'w-full'
                )} />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 group"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {!isAdminRoute && (
              <Link href="/notifications">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group">
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <Button size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              !isAdminRoute && (
                <Link href="/admin/login">
                  <Button size="sm" variant="primary">
                    Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-200 dark:border-dark-border">
              {user ? (
                <>
                  <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {user.name}
                  </p>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full"
                    size="sm"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                !isAdminRoute && (
                  <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" size="sm" variant="primary">
                      Admin Login
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
