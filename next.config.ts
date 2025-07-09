import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      // Tambahkan domain baru di sini
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
