import type { NextApiRequest, NextApiResponse } from 'next';

export function createMocks(options: {
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  cookies?: Record<string, string>;
} = {}) {
  const req = {
    method: options.method || 'GET',
    headers: options.headers || {},
    query: options.query || {},
    cookies: options.cookies || {},
    body: {},
    url: '/',
  } as NextApiRequest;

  const res = {
    setHeader: (name: string, value: string) => {
      res.headers[name] = value;
    },
    getHeader: (name: string) => res.headers[name] || null,
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    headers: {} as Record<string, string>,
    statusCode: 200,
  } as NextApiResponse;

  return { req, res };
} 