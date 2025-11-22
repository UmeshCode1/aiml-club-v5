// @ts-nocheck
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

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Close mobile Resources dropdown when menu closes
  useEffect(() => {
    if (!isOpen) {
      setMobileResourcesOpen(false);
    }
  }, [isOpen]);

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
        { href: '/blog', label: 'Blog' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || isOpen
          ? 'glass border-b border-white/10 shadow-lg py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative z-50">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/aiml-logo/view?project=691e2b31003e6415bb4f"
                alt="AIML Club Logo"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AIML Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className="flex items-center text-sm font-medium px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                    >
                      {link.label}
                      <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="glass-card rounded-xl overflow-hidden p-1 shadow-xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            target={child.external ? '_blank' : undefined}
                            rel={child.external ? 'noopener noreferrer' : undefined}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm font-medium px-4 py-2 rounded-full transition-all',
                      pathname === link.href
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {!isAdminRoute && (
              <Link href="/notifications">
                <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all relative">
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden lg:block">
                  {user.name}
                </span>
                <Button size="sm" onClick={logout} variant="outline" className="rounded-full">
                  Logout
                </Button>
              </div>
            ) : (
              !isAdminRoute && (
                <Link href="/admin/login">
                  <Button size="sm" variant="primary" className="rounded-full px-6">
                    Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 relative z-50"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white dark:bg-gray-950 md:hidden z-40 transform transition-transform duration-300 ease-out shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 pb-6 overflow-y-auto">
          {/* Mobile Links */}
          <div className="flex-1 px-6 space-y-2">
            {links.map((link, idx) => (
              <div key={link.label} style={{ animationDelay: `${idx * 50}ms` }}>
                {link.children ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                      className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={cn("w-5 h-5 transition-transform", mobileResourcesOpen && "rotate-180")} />
                    </button>
                    <div className={cn(
                      "space-y-1 overflow-hidden transition-all duration-300",
                      mobileResourcesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          onClick={() => {
                            setIsOpen(false);
                            setMobileResourcesOpen(false);
                          }}
                          className="block px-8 py-3 text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-4 rounded-xl text-lg font-medium transition-all',
                      pathname === link.href
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer */}
          <div className="px-6 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-3"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span className="text-sm font-medium">Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* User Section */}
            {user ? (
              <div className="space-y-4">
                <div className="px-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full justify-center py-4 rounded-xl"
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            ) : (
              !isAdminRoute && (
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center py-4 rounded-xl" variant="primary">
                    Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
