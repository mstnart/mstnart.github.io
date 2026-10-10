"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { site } from "@/content/site";
import { AmbientVideo } from "../Media";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/** Small labels that float around the photo. Decorative: the same facts appear in the Career section. */
const chips = [
  { text: "After Effects", className: "left-[-6%] top-[12%]", delay: 0.5 },
  { text: "Blender", className: "right-[-8%] top-[30%]", delay: 0.65 },
  { text: "Editing since 2017", className: "left-[-10%] bottom-[18%]", delay: 0.8 },
  { text: "Antalya", className: "right-[-4%] bottom-[6%]", delay: 0.95 },
];

export function Hero() {
  return (
    <section aria-labelledby="hello" className="shell pb-12 pt-10 md:pb-16 md:pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#16a34a] [animation:blink_2s_ease-in-out_infinite]" />
            {site.availability}
          </motion.p>
          <motion.h1 {...rise(0.1)} id="hello" className="heading mt-6 text-[clamp(2.75rem,7vw,5rem)]">
            Hi, I&apos;m {site.firstName}.
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-5 max-w-xl text-xl text-fg-muted text-pretty">
            {site.intro}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#work"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-5 font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
            >
              See my work
              <ArrowDown size={18} aria-hidden />
            </Link>
            <a
              href={site.cv}
              download
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 font-semibold transition-colors hover:border-fg"
            >
              <Download size={18} aria-hidden />
              Download CV
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-2 shadow-xl shadow-black/10">
            <Image src={site.photo} alt={`Portrait of ${site.name}`} fill preload sizes="(min-width: 768px) 384px, 80vw" className="object-cover" />
          </div>
          {chips.map((c) => (
            <motion.span
              key={c.text}
              aria-hidden
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: c.delay }}
              className={`absolute ${c.className} hidden sm:block`}
            >
              <span className="block rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold shadow-lg shadow-black/5 [animation:float_5s_ease-in-out_infinite]">
                {c.text}
              </span>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** The muted highlight loop with a link to the full showreel. */
export function Reel() {
  return (
    <section aria-label="Highlights" className="shell pb-20">
      <div className="overflow-hidden rounded-[1.5rem] border border-line bg-dark">
        <div className="relative aspect-video">
          <AmbientVideo src={site.reel.video} poster={site.reel.poster} label="Highlights from my work" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-on-dark">
          <p className="font-medium">Highlights: gaming edits, VFX and brand films</p>
          <Link href={site.reel.link} className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            Watch the full showreel
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
