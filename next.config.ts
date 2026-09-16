import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gear-site-backend.runasp.net",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
};

export default nextConfig;