/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In production Vercel injects NEXT_PUBLIC_API_URL (Railway). Locally falls back to localhost:4000
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || 'http://localhost:4000';
    return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }];
  },
};
module.exports = nextConfig;
