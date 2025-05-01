import { Session, User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  user_metadata: {
    role?: string;
    full_name?: string;
  };
}

export interface UserSession extends Session {
  user: ExtendedUser;
}

export type RoutePattern = string;

export interface RouteConfig {
  pattern: RoutePattern;
  roles?: string[];
  requireAuth?: boolean;
}

export interface MiddlewareConfig {
  publicRoutes: RoutePattern[];
  protectedRoutes: RouteConfig[];
  adminRoutes: RoutePattern[];
} 