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

export const tracks: Track[] = [
  {
    id: "gaming",
    label: "Gaming",
    title: "Gaming & esports",
    href: "/gaming",
    blurb: "Showreels, cinematic edits and vertical ads built from game footage.",
    colorVar: "var(--track-gaming)",
  },
  {
    id: "brand",
    label: "Brands",
    title: "Brands & commercial",
    href: "/brands",
    blurb: "Hotel films, social content systems and campaign visuals for brands.",
    colorVar: "var(--track-brand)",
  },
  {
    id: "lab",
    label: "3D & VFX",
    title: "3D, VFX & studies",
    href: "/3d",
    blurb: "Blender studies, VFX breakdowns and animation practice.",
    colorVar: "var(--track-lab)",
  },
];

export const trackById = Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<TrackId, Track>;
