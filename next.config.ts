import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
      },
       {
        protocol: "https",
        hostname: "lwbsoqcolneigvvoaspn.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
