"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown, Play } from "lucide-react";
import { site } from "@/content/site";
import { AmbientVideo } from "../Media";
import { MaskedLines, usePrefersReducedMotion } from "../ui";

const ease = [0.22, 1, 0.36, 1] as const;
const FPS = 25;

/** Running SMPTE-style timecode. Decorative; frozen under reduced motion. */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = (now: number) => {
      const total = Math.floor(((now - start) / 1000) * FPS);
      const f = total % FPS, s = Math.floor(total / FPS) % 60, m = Math.floor(total / (FPS * 60)) % 60, h = Math.floor(total / (FPS * 3600));
      if (ref.current) ref.current.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      00:00:00:00
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
});

/** Full-bleed reel with the headline set over it, like a title card. */
export function Hero() {
  const [lead, rest] = site.role.split(" & ");
  return (
    <section aria-labelledby="hello" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-dark">
      <div className="absolute inset-0">
        <AmbientVideo src={site.reel.video} poster={site.reel.poster} label="Highlights from my work" controlClassName="right-[var(--gutter)] top-24 md:top-28" />
        {/* Legibility: darken top for the bar, bottom for the title */}
        {/* Bright reel frames must never wash out the type: base dim + strong lower ramp */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/25" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_10_11/0.75)_0%,rgb(10_10_11/0.1)_24%,rgb(10_10_11/0.45)_46%,rgb(10_10_11/0.88)_68%,var(--bg)_100%)] md:bg-[linear-gradient(to_bottom,rgb(10_10_11/0.7)_0%,rgb(10_10_11/0.05)_26%,rgb(10_10_11/0.35)_52%,rgb(10_10_11/0.9)_82%,var(--bg)_100%)]" />
      </div>

      <div className="shell relative flex flex-1 flex-col pb-8 pt-24 md:pb-10 md:pt-28">
        <motion.p {...fade(0.2)} aria-hidden className="tc flex items-center gap-3 text-fg">
          <span className="inline-flex items-center gap-2 text-accent">
            <span className="h-2 w-2 rounded-full bg-accent [animation:blink_1.2s_steps(2)_infinite]" />
            Rec
          </span>
          <Timecode />
        </motion.p>

        <div className="mt-auto">
          <motion.p {...fade(0.35)} className="tc text-fg/80">
            {site.name} — {site.location}
          </motion.p>
          <MaskedLines
            as="h1"
            delay={0.15}
            className="display mt-4 text-[clamp(3.25rem,11vw,10.5rem)]"
            lines={[lead, rest ? <span key="r" className="text-fg-muted">&amp; {rest}</span> : null].filter(Boolean)}
          />
          <span id="hello" className="sr-only">
            {site.name}, {site.role}
          </span>

          <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
            <motion.p {...fade(0.55)} className="max-w-md text-lg text-fg-muted text-pretty">
              {site.intro}
            </motion.p>
            <motion.div {...fade(0.65)} className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={site.reel.link}
                className="group inline-flex min-h-12 items-center gap-3 bg-accent pl-4 pr-5 font-semibold text-on-accent transition-colors hover:bg-fg"
              >
                <Play size={16} aria-hidden className="fill-current" />
                Watch showreel
              </Link>
              <Link href="#work" className="tc link-line inline-flex items-center gap-2 py-1 text-fg">
                Selected work
                <ArrowDown size={14} aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <Disciplines />
    </section>
  );
}

const disciplines = ["Brand films", "Social content", "Video editing", "Motion graphics", "Colour", "Gaming edits", "Visual effects", "3D in Blender"];

/** Slow ticker of disciplines along the bottom edge of the reel. Decorative; the list is in About. */
function Disciplines() {
  const row = disciplines.map((d) => (
    <span key={d} className="flex items-center gap-8 pr-8">
      {d}
      <span className="text-accent">✦</span>
    </span>
  ));
  return (
    <div aria-hidden className="relative border-y border-line bg-bg/60 backdrop-blur-md">
      <div className="tc flex w-max py-4 text-fg-muted [animation:marquee_40s_linear_infinite]">
        {row}
        {row}
      </div>
    </div>
  );
}
