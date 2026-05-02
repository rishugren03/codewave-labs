import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mergewell",
        destination: "/mergewell-static.html",
      },
    ];
  },
};

export default nextConfig;
