import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'store.racquetsclubcommunity.com',
      },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
