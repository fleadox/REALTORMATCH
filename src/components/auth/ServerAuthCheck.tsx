import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function ServerAuthCheck() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return null;
}

export async function ServerAuthGuard({ children }: { children: React.ReactNode }) {
  await ServerAuthCheck();
  return <>{children}</>;
} 