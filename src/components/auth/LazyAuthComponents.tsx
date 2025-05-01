import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load non-critical components
const PasswordReset = dynamic(
  () => import('./PasswordReset').then(mod => mod.PasswordReset),
  { ssr: false }
);

const TwoFactorAuth = dynamic(
  () => import('./TwoFactorAuth').then(mod => mod.TwoFactorAuth),
  { ssr: false }
);

const BackupCodes = dynamic(
  () => import('./BackupCodes').then(mod => mod.BackupCodes),
  { ssr: false }
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Wrapper component for lazy-loaded auth components
export function LazyAuthWrapper({ 
  component,
  fallback = <LoadingFallback />
}: {
  component: 'password-reset' | '2fa' | 'backup-codes';
  fallback?: React.ReactNode;
}) {
  const Component = {
    'password-reset': PasswordReset,
    '2fa': TwoFactorAuth,
    'backup-codes': BackupCodes,
  }[component];

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

// Export individual components for direct use
export { PasswordReset, TwoFactorAuth, BackupCodes }; 