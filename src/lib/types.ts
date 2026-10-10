/**
 * Content types for the portfolio.
 * You edit the data in /src/content — these types keep it consistent.
 */

/** The three main sections of the portfolio. */
export type TrackId = "gaming" | "brand" | "lab";

export type CategoryId =
  | "motion-video"
  | "graphic-design"
  | "campaigns"
  | "product-visualization"
  | "ecommerce"
  | "experiments";

/**
 * Original generative artwork shown when a project has no real media yet
 * (or when a media file is missing). Pick any style per project.
 */
export type PlateStyle =
  | "rings"
  | "contour"
  | "bars"
  | "grid"
  | "strip"
  | "scan"
  | "sun"
  | "stack";

/** An image file in /public/media (or any full URL you add to next.config). */
export interface ImageMedia {
  type: "image";
  /** e.g. "/media/images/my-project/01.jpg" */
  src: string;
  /** Describe what is in the image for screen readers. */
  alt: string;
  caption?: string;
  /** Aspect ratio as width / height, e.g. 16/9. Defaults to 16/9. */
  aspect?: number;
}

/** A local video file in /public/media/videos. */
export interface VideoMedia {
  type: "video";
  /** e.g. "/media/videos/my-project/edit.mp4" (.mp4 or .webm work everywhere) */
  src: string;
  /** Still frame shown before playback, e.g. "/media/posters/my-project.jpg" */
  poster?: string;
  /** Short description for screen readers. */
  alt: string;
  caption?: string;
  aspect?: number;
  /**
   * "player" shows controls (default).
   * "ambient" plays muted on loop with a pause button — for short loops only.
   */
  mode?: "player" | "ambient";
}

/** A YouTube or Vimeo link. Paste the normal watch URL. */
export interface EmbedMedia {
  type: "embed";
  url: string;
  /** Title of the video, used by screen readers. */
  title: string;
  caption?: string;
  aspect?: number;
}

export type MediaItem = ImageMedia | VideoMedia | EmbedMedia;

export interface ProcessStep {
  title: string;
  body: string;
  media?: MediaItem;
}

/**
 * Raw vs finished comparisons.
 * "grade": two stills of the same frame; the page shows a drag slider.
 * "edit": the source clips next to the finished edit.
 */
export type Comparison =
  | {
      type: "grade";
      title: string;
      /** Ungraded frame, e.g. "/media/images/my-project/before.jpg" */
      before: string;
      /** Finished frame at the same moment. */
      after: string;
      beforeLabel?: string;
      afterLabel?: string;
      caption?: string;
    }
  | {
      type: "edit";
      title: string;
      /** Video of the raw / source clips. */
      source: string;
      sourcePoster?: string;
      sourceLabel?: string;
      /** The finished edit. */
      edit: string;
      editPoster?: string;
      editLabel?: string;
      caption?: string;
    };

export interface Credit {
  /** e.g. "Footage", "Music" */
  label: string;
  detail: string;
  url?: string;
}

export interface Download {
  label: string;
  /** File in /public/media, e.g. "/media/other/deck.pdf" */
  href: string;
  /** Shown next to the link, e.g. "PDF · 6 MB" */
  meta?: string;
}

export interface Project {
  /** URL part: /work/<slug>. Lowercase, hyphens, unique. */
  slug: string;
  title: string;
  /** One or two sentences. Shown on cards and in search results. */
  summary: string;
  /** Main section: "gaming", "brand" (brand & commercial) or "lab" (3D & VFX). */
  track: TrackId;
  /** First category is the primary one. */
  categories: CategoryId[];
  tags?: string[];
  year?: number;
  role?: string;
  /** Leave empty unless the client agreed to be named. */
  client?: string;
  /**
   * Shown as a notice at the top of the project page, e.g.
   * "Self-initiated concept. Not commissioned by Titanic Hotels."
   */
  notice?: string;
  /** Short project type for the facts table, e.g. "Self-initiated concept". */
  kind?: string;

  /** Card image. Falls back to `hero`, then to the generative plate. */
  thumbnail?: string;
  hero?: MediaItem;
  gallery?: MediaItem[];

  overview?: string;
  objective?: string;
  /** Longer write-up, one string per paragraph. */
  description?: string[];
  process?: ProcessStep[];
  tools?: string[];
  /** Raw footage vs edit, before/after grade. */
  comparisons?: Comparison[];
  /** Stock footage, music, voice and other third-party sources. */
  credits?: Credit[];
  downloads?: Download[];

  featured?: boolean;
  /** Lower numbers come first. */
  order: number;

  /** Marks placeholder entries. Set to false (or delete) once the work is real. */
  sample?: boolean;
  /** Fallback artwork style + hue (0–360) used until real media exists. */
  plate: { style: PlateStyle; hue?: number };
}

/* ---------- Resolved shapes (after checking which files exist) ---------- */

export type ResolvedMedia = MediaItem & { available: boolean; /** Player URL for embeds. */ embedSrc?: string };

export interface ResolvedProject extends Omit<Project, "hero" | "gallery" | "process" | "comparisons" | "downloads"> {
  /** Thumbnail path that actually exists, or null → plate fallback. */
  cover: string | null;
  hero: ResolvedMedia | null;
  gallery: ResolvedMedia[];
  process: (Omit<ProcessStep, "media"> & { media?: ResolvedMedia })[];
  /** Only comparisons whose files all exist. */
  comparisons: Comparison[];
  /** Only downloads whose files exist. */
  downloads: Download[];
}
