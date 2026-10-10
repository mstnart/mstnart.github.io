import fs from "node:fs";
import path from "node:path";
import { projects } from "@/content/projects";
import type { CategoryId, MediaItem, ResolvedMedia, ResolvedProject, TrackId } from "./types";

/** True for http(s) URLs. */
export function isExternal(src: string) {
  return /^https?:\/\//i.test(src);
}

/** Checks a /public path on disk. External URLs are trusted as-is. */
function fileExists(src?: string): boolean {
  if (!src) return false;
  if (isExternal(src)) return true;
  const clean = decodeURI(src.split("?")[0]).replace(/^\/+/, "");
  try {
    return fs.statSync(path.join(process.cwd(), "public", clean)).isFile();
  } catch {
    return false;
  }
}

function resolveMedia(item: MediaItem): ResolvedMedia {
  if (item.type === "embed") {
    const embedSrc = toEmbedUrl(item.url) ?? undefined;
    return { ...item, embedSrc, available: Boolean(embedSrc) };
  }
  if (item.type === "video") {
    return {
      ...item,
      poster: item.poster && fileExists(item.poster) ? item.poster : undefined,
      available: fileExists(item.src),
    };
  }
  return { ...item, available: fileExists(item.src) };
}

function resolve(p: (typeof projects)[number]): ResolvedProject {
  const hero = p.hero ? resolveMedia(p.hero) : null;
  const heroStill =
    hero?.available && hero.type === "image"
      ? hero.src
      : hero?.type === "video"
        ? (hero.poster ?? null)
        : null;
  return {
    ...p,
    cover: fileExists(p.thumbnail) ? p.thumbnail! : heroStill,
    hero,
    gallery: (p.gallery ?? []).map(resolveMedia),
    process: (p.process ?? []).map((s) => ({ ...s, media: s.media ? resolveMedia(s.media) : undefined })),
    comparisons: (p.comparisons ?? []).filter((c) =>
      c.type === "grade" ? fileExists(c.before) && fileExists(c.after) : fileExists(c.source) && fileExists(c.edit),
    ),
    downloads: (p.downloads ?? []).filter((d) => fileExists(d.href)),
  };
}

let cache: ResolvedProject[] | null = null;

/** All projects, sorted by `order`, with media availability checked. */
export function getProjects(): ResolvedProject[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) throw new Error(`Duplicate project slug: "${p.slug}"`);
    seen.add(p.slug);
  }
  cache = [...projects].sort((a, b) => a.order - b.order).map(resolve);
  return cache;
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug) ?? null;
}

export function getFeatured(limit = 5) {
  const all = getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

/** Projects in one track, in display order. */
export function getByTrack(track: TrackId) {
  return getProjects().filter((p) => p.track === track);
}

/** Previous / next within the same track, wrapping around. */
export function getNeighbours(slug: string) {
  const me = getProject(slug);
  if (!me) return { prev: null, next: null, list: [] as ResolvedProject[] };
  const list = getByTrack(me.track);
  const i = list.findIndex((p) => p.slug === slug);
  if (list.length < 2) return { prev: null, next: null, list };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
    list,
  };
}

/** Same-track projects first, then those sharing categories and tags. */
export function getRelated(slug: string, limit = 3) {
  const all = getProjects();
  const me = all.find((p) => p.slug === slug);
  if (!me) return [];
  const tags = new Set(me.tags ?? []);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score:
        (p.track === me.track ? 10 : 0) +
        p.categories.filter((c) => me.categories.includes(c)).length * 3 +
        (p.tags ?? []).filter((t) => tags.has(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.order - b.p.order)
    .slice(0, limit)
    .map((x) => x.p);
}

export function countByCategory() {
  const counts = {} as Record<CategoryId, number>;
  for (const p of getProjects()) for (const c of p.categories) counts[c] = (counts[c] ?? 0) + 1;
  return counts;
}

/** Converts a YouTube or Vimeo URL into an embeddable player URL. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.match(/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
    }
    return null;
  } catch {
    return null;
  }
}
