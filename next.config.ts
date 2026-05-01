import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mergewell",
        destination: "/mergewell.html",
      },
    ];
  },
};

export default nextConfig;
