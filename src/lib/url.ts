/**
 * Base URL for metadata, sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL when you deploy (e.g. https://burakmestan.com).
 * Locally it falls back to http://localhost:3000.
 */
export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (raw && raw.replace(/\/+$/, "")) || "http://localhost:3000";
}
