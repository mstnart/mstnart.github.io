// Writes public/robots.txt and public/sitemap.xml before `next build`.
// (The static export can't serve app/robots.ts / app/sitemap.ts while cacheComponents is on.)
// Base URL comes from NEXT_PUBLIC_SITE_URL, same as src/lib/url.ts.
import { writeFileSync } from "node:fs";
import { projects } from "../src/content/projects.ts";

const base = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/+$/, "");
const urls = ["", ...projects.map((p) => `/work/${p.slug}`)];

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join("\n")}
</urlset>
`,
);
writeFileSync(new URL("../public/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`gen-seo: ${urls.length} URLs for ${base}`);
