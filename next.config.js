/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Important for redirects to work properly
  trailingSlash: true,

  // Required for Netlify deployments
  target: process.env.NETLIFY ? 'serverless' : undefined,
  
  // App Router and Server Actions
  experimental: {
    appDir: true,
    serverActions: true,
  },
  
  // Add image domains for Supabase storage
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },

  // CORS headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 