import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security configuration
export const securityConfig = {
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Rate limiting configuration
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },

  // Security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // SSL/TLS configuration
  ssl: {
    enabled: process.env.NODE_ENV === 'production',
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH,
  },

  // Session configuration
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Password policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // 2FA configuration
  twoFactor: {
    enabled: true,
    issuer: 'Your App Name',
    window: 30, // seconds
  },
};

// Security middleware
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CORS headers
  const origin = request.headers.get('origin');
  if (origin && securityConfig.cors.origin.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', securityConfig.cors.methods.join(','));
    response.headers.set('Access-Control-Allow-Headers', securityConfig.cors.allowedHeaders.join(','));
    response.headers.set('Access-Control-Max-Age', securityConfig.cors.maxAge.toString());
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Rate limiting middleware
export function rateLimitMiddleware(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  // Implement rate limiting logic here
  // This is a placeholder - you should use a proper rate limiting solution
  // like Redis or a dedicated rate limiting service
  
  return NextResponse.next();
}

// Password validation
export function validatePassword(password: string): boolean {
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = securityConfig.passwordPolicy;
  
  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/\d/.test(password)) return false;
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  return true;
}

// Session validation
export function validateSession(session: any): boolean {
  if (!session) return false;
  
  const now = Date.now();
  const sessionAge = now - new Date(session.created_at).getTime();
  
  return sessionAge < securityConfig.session.maxAge * 1000;
} 