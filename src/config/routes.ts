import { MiddlewareConfig } from '../types/middleware';

export const routeConfig: MiddlewareConfig = {
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/auth/verify',
    '/api/public',
    '/api/auth/*',
  ],
  
  protectedRoutes: [
    {
      pattern: '/dashboard/*',
      requireAuth: true,
    },
    {
      pattern: '/profile/*',
      requireAuth: true,
    },
    {
      pattern: '/settings/*',
      requireAuth: true,
    },
    {
      pattern: '/api/protected/*',
      requireAuth: true,
    },
    {
      pattern: '/api/user/*',
      requireAuth: true,
    },
  ],
  
  adminRoutes: [
    '/admin/*',
    '/api/admin/*',
  ],
};

// Helper function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
  return routeConfig.publicRoutes.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern;
  });
};

// Helper function to check if a route requires admin access
export const isAdminRoute = (path: string): boolean => {
  return routeConfig.adminRoutes.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern;
  });
};

// Helper function to check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
  return routeConfig.protectedRoutes.some(route => {
    if (route.pattern.endsWith('*')) {
      return path.startsWith(route.pattern.slice(0, -1));
    }
    return path === route.pattern;
  });
}; 