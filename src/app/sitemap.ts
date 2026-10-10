import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...[""].map((p) => ({ url: `${base}${p}` })),
    ...getProjects().map((p) => ({ url: `${base}/work/${p.slug}` })),
  ];
}
