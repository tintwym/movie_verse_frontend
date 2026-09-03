import type { NextConfig } from "next";

// `standalone` is for Docker self-hosting. On Vercel it can break the platform
// start command, so only enable it when explicitly building for Docker.
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
