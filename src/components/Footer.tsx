import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerLinks: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'What We\'ve Learned', href: '/what-weve-learned' },
  { label: 'Journey', href: '/blog' },
  { label: 'Get Involved', href: '/get-involved' },
];

const developerLinks: FooterLink[] = [
  { label: 'Technical Docs', href: 'https://pmorgan.tech', external: true },
  { label: 'GitHub', href: 'https://github.com/mediajunkie', external: true },
];

const socialLinks: FooterLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/mediajunkie',
    external: true
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mediajunkie',
    external: true
  },
  {
    label: 'Mastodon',
    href: 'https://xoxo.zone/@xian',
    external: true
  },
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/xianlandia.com',
    external: true
  },  
];

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white" role="contentinfo" aria-label="Site footer">
      <div className="site-container py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-xl font-bold">Piper Morgan</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              AI-powered Product Management Assistant demonstrating systematic
              excellence through building-in-public methodology.
            </p>
            <p className="text-gray-400 text-sm">
              Built with systematic verification, multi-agent coordination,
              and GitHub-first tracking.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-teal-text transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-primary-teal-text transition-colors py-1 inline-block"
                  >
                    {link.label}
                    {link.external && (
                      <span className="ml-1 text-xs">↗</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href="/get-involved"
                className="inline-block bg-primary-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>

          {/* Developer Resources */}
          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2">
              {developerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-primary-teal-text transition-colors py-1 inline-block"
                  >
                    {link.label}
                    {link.external && (
                      <span className="ml-1 text-xs">↗</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Piper Morgan. Building in public.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                made with systematic kindess
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-teal rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
