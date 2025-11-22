'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Mock notification fetch or real implementation
    const fetchUnread = async () => {
      try {
        // const res = await fetch('/api/notifications/unread');
        // if (res.ok) {
        //   const data = await res.json();
        //   setUnreadCount(data.count || 0);
        // }
      } catch (error) {
        console.debug('Failed to fetch notification count');
      }
    };
    fetchUnread();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    {
      label: 'Resources',
      children: [
        { href: '/suggestions', label: 'Suggestion Box' },
        { href: 'https://drive.google.com', label: 'Media Drive', external: true },
        { href: '/constitution', label: 'Constitution' },
      ]
    },
    { href: '/contact', label: 'Contact Us' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/team', label: 'Team' },
    { href: '/admin/members', label: 'Members' },
    { href: '/admin/gallery', label: 'Gallery' },
  ];

  const links = isAdminRoute ? adminLinks : navLinks;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        scrolled
          ? 'bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/aiml-logo/view?project=691e2b31003e6415bb4f"
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
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <button
                    className={cn(
                      'flex items-center text-sm font-medium transition-colors duration-300 py-2',
                      'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    )}
                  >
                    {link.label}
                    <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-all duration-300 relative py-2 block',
                      pathname === link.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 group-hover:w-full',
                      pathname === link.href && 'w-full'
                    )} />
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.children && (
                  <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 group"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {!isAdminRoute && (
              <Link href="/notifications">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group">
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
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
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {user.name}
                </span>
                <Button size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              !isAdminRoute && (
                <Link href="/admin/login">
                  <Button size="sm" variant="primary" className="shadow-lg shadow-primary-500/20">
                    Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 h-screen overflow-y-auto pb-20">
          <div className="px-4 py-6 space-y-4">
            {links.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {link.label}
                      <ChevronDown className={cn("w-5 h-5 transition-transform", mobileResourcesOpen && "rotate-180")} />
                    </button>

                    {mobileResourcesOpen && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            target={child.external ? '_blank' : undefined}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-all',
                      pathname === link.href
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {resolvedTheme === 'dark' ? (
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs">Light Mode</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <span className="text-xs">Dark Mode</span>
                    </div>
                  )}
                </button>
              </div>

              {user ? (
                <div className="px-4 space-y-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Signed in as {user.name}
                  </p>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                !isAdminRoute && (
                  <div className="px-4">
                    <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-center" variant="primary">
                        Admin Login
                      </Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
