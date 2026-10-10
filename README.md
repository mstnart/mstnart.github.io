# Burak Mestan · Portfolio

Personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion and Lucide icons.
Everything runs locally. No accounts, API keys, CMS or backend.

## Run it

```bash
cd C:\Users\Soraa\burak-mestan-portfolio
npm install        # only needed the first time
npm run dev        # http://localhost:3000, live reload while you edit
```

Production check:

```bash
npm run build      # type-check + build every page
npm run start      # serve the built site at http://localhost:3000
npm run lint
```

## How the site is organised

One page at `/`: intro → highlight video → Work (tabs: All / Gaming / Brands / 3D & VFX) → Career timeline → Skills → Contact.
Each project has its own page at `/work/<slug>`. Old addresses (`/work`, `/gaming`, `/about`…) redirect to the matching part of the home page.

- Your text, CV timeline, skills, tools, languages, email, social links, photo and CV file: `src/content/site.ts`
- Section names and colours: `src/content/tracks.ts`
- Projects: `src/content/projects.ts` (set `track: "gaming" | "brand" | "lab"` to place a project)
- To update the CV download, replace `public/media/other/burak-mestan-cv.pdf`.

## Where things live

```
src/content/site.ts        ← your name, intro, email, social links, about text, tools, experience
src/content/projects.ts    ← every project (text, categories, media paths, order)
src/content/categories.ts  ← the six disciplines used by the filters
public/media/
  images/                  ← gallery and hero images
  videos/                  ← .mp4 / .webm files
  thumbnails/              ← card images used on Home and Work
  posters/                 ← still frames shown before a video plays
  other/                   ← anything else (PDFs, etc.)
```

You should not need to touch anything in `src/components` or `src/app` to add work.

## Add a project

1. Make a folder for its media, e.g. `public/media/images/neon-campaign/`, and copy files in.
2. Open `src/content/projects.ts` and add an entry (copy an existing one):

```ts
{
  slug: "neon-campaign",               // URL: /work/neon-campaign (lowercase, hyphens, unique)
  title: "Neon Campaign",
  summary: "One or two sentences for the card.",
  categories: ["campaigns", "graphic-design"],   // first = main category
  tags: ["Key visual", "Social"],
  year: 2026,
  role: "Designer",
  featured: true,                      // show on the home page (first 5 featured)
  order: 3,                            // lower numbers appear first
  plate: { style: "sun", hue: 18 },    // fallback artwork while media is missing
  thumbnail: "/media/thumbnails/neon-campaign.jpg",
  hero: { type: "image", src: "/media/images/neon-campaign/hero.jpg", alt: "Key visual on a billboard" },
  gallery: [
    { type: "image", src: "/media/images/neon-campaign/01.jpg", alt: "Story format", aspect: 9 / 16 },
  ],
  overview: "What the brief was.",
  objective: "What it had to achieve.",
  description: ["Paragraph one.", "Paragraph two."],
  process: [{ title: "Sketches", body: "Short description." }],
  tools: ["Photoshop", "Illustrator"],
},
```

3. Save. The dev server reloads. The project appears on `/work`, in its filters, and at `/work/neon-campaign`.

Category ids: `motion-video`, `graphic-design`, `campaigns`, `product-visualization`, `ecommerce`, `experiments`.
Plate styles: `rings`, `contour`, `bars`, `grid`, `strip`, `scan`, `sun`, `stack`.

The four current projects are self-initiated concepts. Each has a `notice` line that the page shows at the top
("Self-initiated concept. Not commissioned by …"). Keep it unless a brand actually commissions the work.

### Raw footage vs. edit

Add `comparisons` to a project:

```ts
comparisons: [
  { type: "edit", title: "Source clips → finished film",
    source: "/media/videos/my-film/source-clips.mp4", edit: "/media/videos/my-film/film.mp4" },
  { type: "grade", title: "Grade · pool",
    before: "/media/images/my-film/before.jpg", after: "/media/images/my-film/after.jpg" },
],
```

`edit` shows the two videos side by side with a "Play both" button. `grade` shows a drag slider (works with arrow keys too);
use two stills of the exact same frame. Comparisons with missing files are skipped automatically.

### Credits and downloads

`credits` lists stock footage, music and voice sources (required for CC BY music). `downloads` adds file links such as a PDF deck.

## Replace a thumbnail

Copy the image into `public/media/thumbnails/` and set `thumbnail: "/media/thumbnails/<file>.jpg"`.
If there is no thumbnail, the card uses the hero image, then the video poster, then the generative plate.
JPG, PNG, WebP and AVIF are resized and converted automatically. GIF and SVG are served as-is.
Use landscape images of about 2000px wide for heroes and 1600px for cards.

## Add a video

Local file (recommended: H.264 `.mp4`, or `.webm`, which play in every browser; `.mov` does not play everywhere):

```ts
hero: {
  type: "video",
  src: "/media/videos/neon-campaign/edit.mp4",
  poster: "/media/posters/neon-campaign.jpg",   // optional still frame
  alt: "Thirty second campaign edit",
  mode: "player",          // "player" = controls; "ambient" = muted loop with a pause button
},
```

YouTube or Vimeo: paste the normal link.

```ts
{ type: "embed", url: "https://www.youtube.com/watch?v=XXXXXXXX", title: "Campaign edit" }
```

Hero showreel: put a short loop in `public/media/videos/` and set `hero.reelVideo` in `src/content/site.ts`.

**Missing files never break the page.** If a path is wrong or the file isn't there yet, the site shows the
generative plate with an "Image pending" / "Video pending" tag. In `npm run dev` it also prints the
exact path it expected. The *Gameplay Highlight Edit* sample does this on purpose so you can see it.

## Edit text, email and social links

All in `src/content/site.ts`:

- `email`: **replace `hello@example.com` with your real address.** Contact buttons use `mailto:`, so messages open in the visitor's mail app.
- `socials`: paste full URLs. Entries with an empty `url` stay hidden, so you never ship a dead link.
- `hero`, `about`, `capabilities`, `tools`, `experience`: plain text. Experience has optional `period` and `org` fields; they stay hidden while empty.

## Design notes

- Palette: warm near-black (`#0c0b0a`), bone text (`#ece6dc`), one sodium accent (`#ff5b1f`). Tokens live in `src/app/globals.css`.
- Type: Archivo (variable width; condensed for display), Instrument Serif italic for accents, JetBrains Mono for metadata.
- Motion: route fade/rise and a card-to-hero morph via React `<ViewTransition>`, masked headline reveals,
  scroll reveals, and a cursor-following preview on the discipline/index lists (mouse only).
  `prefers-reduced-motion` turns off movement, the reel and ambient video autoplay.

## Deploying later

Not deployed. When you want to: push the folder to a GitHub repo and import it on Vercel (free tier works,
no config needed). Then set the environment variable `NEXT_PUBLIC_SITE_URL=https://your-domain.com` so
sitemap, canonical URLs and social previews use your domain. Any Node host that runs `npm run build && npm run start` also works.
