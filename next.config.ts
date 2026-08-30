import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Photo uploads (≤5 MB) travel through server actions to Supabase Storage.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
