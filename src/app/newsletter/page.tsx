import { ClientRedirect } from '@/components';

export const metadata = {
  title: 'Redirecting... | Piper Morgan',
  robots: 'noindex',
};

export default function NewsletterRedirect() {
  return <ClientRedirect to="/try/beta" message="Redirecting to waitlist..." />;
}
