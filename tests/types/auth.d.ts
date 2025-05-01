import type { NextApiRequest, NextApiResponse } from 'next';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import type { AdapterUser } from '@auth/core/adapters';

declare module 'next-auth/jwt' {
  interface JWT extends JWT {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    name?: string | null;
    image?: string | null;
    role?: string;
  }
}

export interface TestAccount {
  provider: 'credentials';
  type: 'credentials';
  providerAccountId: string;
}

export interface MockRequest extends NextApiRequest {
  headers: Record<string, string>;
  method: string;
  query: Record<string, string>;
  cookies: Record<string, string>;
}

export interface MockResponse extends NextApiResponse {
  setHeader: (name: string, value: string) => void;
  getHeader: (name: string) => string | null;
  status: (code: number) => MockResponse;
}

export interface TestUser extends User {
  id: string;
  email: string;
  name: string;
  role?: string;
  emailVerified: Date | null;
}

export interface TestSession extends Session {
  user: TestUser;
}

export interface TestJWT extends JWT {
  id: string;
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  jti: string;
  role?: string;
}

declare module 'node-mocks-http' {
  export function createMocks(options?: {
    method?: string;
    headers?: Record<string, string>;
    query?: Record<string, string>;
    cookies?: Record<string, string>;
  }): {
    req: MockRequest;
    res: MockResponse;
  };
} 