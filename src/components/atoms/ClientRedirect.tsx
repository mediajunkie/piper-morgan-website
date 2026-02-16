'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ClientRedirectProps {
  to: string;
  message?: string;
}

/**
 * Client-side redirect component for static export compatibility.
 * Since Next.js static export cannot use middleware redirects,
 * this component handles redirects on the client side.
 */
export function ClientRedirect({ to, message = 'Redirecting...' }: ClientRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal mx-auto mb-4"></div>
        <p className="text-text-light dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
