import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages: `next build` writes plain files to ./out.
 * No server, so no image optimizer (images are served as-is) and no redirects.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
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
