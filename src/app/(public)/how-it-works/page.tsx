import { ClientRedirect } from '@/components';

export const metadata = {
  title: 'Redirecting... | Piper Morgan',
  robots: 'noindex',
};

export default function HowItWorksRedirect() {
  return <ClientRedirect to="/methodology" message="Redirecting to methodology..." />;
}
