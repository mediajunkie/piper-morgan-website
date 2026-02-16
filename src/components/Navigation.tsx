'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ThemeToggle } from './atoms/ThemeToggle';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
  emphasized?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'Try Piper', href: '/try', emphasized: true },
  { label: 'Get Involved', href: '/get-involved' },
  {
    label: 'Journey',
    href: '/blog',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Methodology', href: '/methodology' },
    ]
  },
  { label: 'About', href: '/about' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Check if any child is active (for dropdown parent highlighting)
  const hasActiveChild = (item: NavigationItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
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
          <div className="hidden md:flex items-center space-x-6" ref={dropdownRef}>
            {navigationItems.map((item) => {
              // Emphasized button (Try Piper)
              if (item.emphasized) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 bg-primary-teal text-white font-semibold rounded-lg hover:bg-primary-teal/90 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {item.label}
                  </Link>
                );
              }

              // Dropdown item
              if (item.children) {
                const isDropdownActive = isActive(item.href) || hasActiveChild(item);
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleDropdown(item.label);
                        }
                      }}
                      className={`font-medium transition-all duration-200 flex items-center gap-1 ${
                        isDropdownActive
                          ? 'text-primary-teal-text dark:text-primary-teal font-semibold'
                          : 'text-text-light dark:text-gray-400 hover:text-primary-teal-text dark:hover:text-primary-teal'
                      }`}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {openDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        role="menu"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(child.href)
                                ? 'text-primary-teal-text dark:text-primary-teal bg-primary-teal/10'
                                : 'text-text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link
              return (
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
              );
            })}
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
              {navigationItems.map((item) => {
                // Emphasized button (Try Piper) - mobile
                if (item.emphasized) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-4 py-3 bg-primary-teal text-white font-semibold rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Dropdown item - mobile (expand inline)
                if (item.children) {
                  const isExpanded = openDropdown === item.label;
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`w-full px-2 py-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                          hasActiveChild(item)
                            ? 'text-primary-teal-text dark:text-primary-teal bg-primary-teal/10 dark:bg-primary-teal/20'
                            : 'text-text-light dark:text-gray-400 hover:text-text-dark dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        aria-expanded={isExpanded}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-2 py-2 rounded-lg text-sm transition-colors ${
                                isActive(child.href)
                                  ? 'text-primary-teal-text dark:text-primary-teal bg-primary-teal/10'
                                  : 'text-text-light dark:text-gray-400 hover:text-text-dark dark:hover:text-dark-text'
                              }`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular link - mobile
                return (
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
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
