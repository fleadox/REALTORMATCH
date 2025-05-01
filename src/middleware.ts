import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, isAdminRoute, isProtectedRoute } from './config/routes';
import { UserSession } from './types/middleware';

// Helper function to get user role from session
const getUserRole = (session: any): string => {
  return session?.user?.user_metadata?.role || 'user';
};

// Cache configuration
const CACHE_DURATION = 5 * 60; // 5 minutes in seconds
const PUBLIC_PATHS = ['/auth/login', '/auth/signup', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  try {
    // Create Supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Check if path is public
    const isPublicPath = PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (!isPublicPath) {
      // Get session from cache or Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session and not on public path, redirect to login
      if (!session) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Add session to response headers for client-side caching
      res.headers.set('x-session-user', session.user.id);
      res.headers.set('x-session-expires', String(Date.now() + CACHE_DURATION * 1000));
    }

    // Add security headers
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );

    return res;
  } catch (error) {
    // Log error and redirect to error page
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 