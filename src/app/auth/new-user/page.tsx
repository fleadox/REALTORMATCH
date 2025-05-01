'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewUser() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to AI Agents!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been created successfully. You will be redirected to the dashboard shortly.
          </p>
        </div>
        <div className="mt-6">
          <div className="animate-pulse flex justify-center">
            <div className="h-4 w-4 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 