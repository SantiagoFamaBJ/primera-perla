import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [{ source: "/admin", destination: "/ADMIN", permanent: false }];
  },
};

export default nextConfig;
