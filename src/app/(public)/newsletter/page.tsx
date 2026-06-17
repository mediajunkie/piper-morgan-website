import { ClientRedirect } from '@/components';

export const metadata = {
  title: 'Redirecting... | Piper Morgan',
  robots: 'noindex',
};

export default function NewsletterRedirect() {
  return <ClientRedirect to="/blog" message="Redirecting to the blog..." />;
}
