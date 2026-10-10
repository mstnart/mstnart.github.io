import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Only files inside /public/media can be optimized.
    localPatterns: [{ pathname: "/media/**", search: "" }],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  // Older page addresses now live on the one-page home.
  async redirects() {
    return [
      { source: "/work", destination: "/#work", permanent: false },
      { source: "/gaming", destination: "/#gaming", permanent: false },
      { source: "/brands", destination: "/#brands", permanent: false },
      { source: "/3d", destination: "/#3d", permanent: false },
      { source: "/about", destination: "/#career", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
