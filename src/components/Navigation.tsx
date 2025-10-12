'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from './atoms/ThemeToggle';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'What We\'ve Learned', href: '/what-weve-learned' },
  { label: 'Journey', href: '/blog' },
  { label: 'Get Involved', href: '/get-involved' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      style={{
        background: 'var(--background)',
        transition: 'background-color 0.2s'
      }}
      className="sticky top-0 z-50 border-0 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="site-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
              <Image
                src="/assets/pm-logo.png"
                alt="Piper Morgan Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              style={{ color: 'var(--text-dark)' }}
              className="text-xl font-bold"
            >
              Piper Morgan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-all duration-200 hover-lift ${
                  isActive(item.href)
                    ? 'text-primary-teal-text dark:text-primary-teal font-semibold'
                    : 'text-text-light dark:text-gray-400 hover:text-primary-teal-text dark:hover:text-primary-teal hover:font-semibold'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6 text-text-dark dark:text-dark-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-teal-text dark:text-primary-teal bg-primary-teal/10 dark:bg-primary-teal/20'
                      : 'text-text-light dark:text-gray-400 hover:text-text-dark dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
