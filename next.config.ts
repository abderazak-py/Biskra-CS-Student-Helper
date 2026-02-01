/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.welledge.tech/api/v1/:path*', // proxy to backend API
      },
    ];
  },
};

module.exports = nextConfig;
