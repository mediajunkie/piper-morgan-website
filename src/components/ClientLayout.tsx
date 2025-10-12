'use client';

import { ThemeProvider } from './ThemeProvider';
import Navigation from './Navigation';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <div style={{
        background: 'var(--background)',
        color: 'var(--text-dark)',
        minHeight: '100vh',
        transition: 'background-color 0.2s, color 0.2s'
      }}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
