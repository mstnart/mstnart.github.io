import type { TrackId } from "@/lib/types";

/**
 * TRACKS
 * The three main sections of the site. Each project belongs to one
 * (set `track` in projects.ts). Order here = order in the menu and on Home.
 */
export interface Track {
  id: TrackId;
  /** Short name used in the menu and on badges. */
  label: string;
  /** Longer name used as the page heading. */
  title: string;
  href: string;
  /** One sentence shown on the track card and page. */
  blurb: string;
  /** Track colour, defined in globals.css. Always shown next to the label. */
  colorVar: string;
}

/** The id stays stable ("brand", "lab") so old data and links keep working; labels can change freely. */
export const tracks: Track[] = [
  {
    id: "brand",
    label: "Business",
    title: "Business & brands",
    href: "/#business",
    blurb: "Hotel films, social content systems and campaign visuals for businesses.",
    colorVar: "var(--track-brand)",
  },
  {
    id: "gaming",
    label: "Gaming",
    title: "Gaming & esports",
    href: "/#gaming",
    blurb: "Showreels, cinematic edits and vertical ads built from game footage.",
    colorVar: "var(--track-gaming)",
  },
  {
    id: "lab",
    label: "Personal",
    title: "Personal work",
    href: "/#personal",
    blurb: "Personal films, Blender studies and animation practice.",
    colorVar: "var(--track-lab)",
  },
];

export const trackById = Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<TrackId, Track>;

/** URL hashes that open a track tab on the home page (current names plus older ones). */
export const trackByHash: Record<string, TrackId> = { gaming: "gaming", business: "brand", brands: "brand", brand: "brand", personal: "lab", "3d": "lab", lab: "lab" };
