import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://wsucqpunleplgyrrroae.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdWNxcHVubGVwbGd5cnJyb2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzI3NjksImV4cCI6MjA5MDAwODc2OX0.u82WmoJh-S8eGSrZXCb3XCbSueRkqUskyT_M0TrnVcY',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
