"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useSpring } from "motion/react";
import { Briefcase, GraduationCap } from "lucide-react";
import { site, type TimelineEntry } from "@/content/site";
import { usePrefersReducedMotion } from "../ui";

const ease = [0.22, 1, 0.36, 1] as const;

function span(e: TimelineEntry) {
  const [a, b] = e.years.split(/[–-]/).map((x) => x.trim());
  const start = Number(a);
  const end = /now|present/i.test(b) ? site.timelineUntil : Number(b);
  return { start, end };
}

/** Number that counts up once it scrolls into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {reduce ? to : value}
      {suffix}
    </span>
  );
}

/** Years on a ruler; each entry's bar grows when the chart comes into view. Decorative summary of the list below. */
function YearsChart() {
  const entries = site.timeline.map((e) => ({ ...e, ...span(e) }));
  const min = Math.min(...entries.map((e) => e.start));
  const max = site.timelineUntil + 1;
  const years = Array.from({ length: max - min }, (_, i) => min + i);
  const pct = (y: number) => ((y - min) / (max - min)) * 100;

  return (
    <figure aria-hidden className="rounded-2xl border border-line bg-surface p-5 md:p-7">
      <div className="relative ml-0 md:ml-56">
        <div className="flex justify-between text-xs font-medium text-fg-muted">
          {years.map((y) => (
            <span key={y} className="w-0 whitespace-nowrap" style={{ transform: "translateX(-50%)" }}>
              <span className={y % 2 && years.length > 8 ? "hidden sm:inline" : ""}>{y}</span>
            </span>
          ))}
          <span className="w-0" />
        </div>
      </div>
      <div className="mt-3 space-y-3">
        {entries.map((e, i) => (
          <div key={e.title} className="md:flex md:items-center md:gap-4">
            <p className="mb-1 truncate text-sm font-semibold md:mb-0 md:w-52 md:shrink-0 md:text-right">
              {e.place}
            </p>
            <div className="relative h-7 flex-1 rounded-full bg-surface-2">
              <motion.div
                className="absolute inset-y-0 flex items-center overflow-hidden rounded-full px-3 text-xs font-semibold text-white"
                style={{
                  left: `${pct(e.start)}%`,
                  width: `${pct(e.end + 1) - pct(e.start)}%`,
                  background: e.type === "school" ? "var(--track-lab)" : "var(--accent)",
                  transformOrigin: "left center",
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.12 }}
              >
                <span className="truncate">{e.years}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-5 flex flex-wrap gap-4 text-sm text-fg-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" /> Work
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: "var(--track-lab)" }} /> Education
        </span>
      </figcaption>
    </figure>
  );
}

export function Career() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const first = Math.min(...site.timeline.map((e) => span(e).start));
  const jobs = site.timeline.filter((e) => e.type === "work").length;
  const schools = site.timeline.filter((e) => e.type === "school").length;

  return (
    <section id="career" aria-labelledby="career-title" className="overflow-x-clip border-t border-line py-20">
      <div className="shell">
        <p className="eyebrow">Career</p>
        <h2 id="career-title" className="heading mt-2 text-[clamp(2rem,4.5vw,3rem)]">
          From {first} to today
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-fg-muted">{site.about}</p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { n: site.timelineUntil - first, suffix: "+", label: "years editing video" },
            { n: jobs, suffix: "", label: jobs === 1 ? "workplace" : "workplaces" },
            { n: schools, suffix: "", label: schools === 1 ? "university" : "universities" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="heading block text-5xl text-accent">
                  <CountUp to={s.n} suffix={s.suffix} />
                </span>
                <span className="mt-1 block text-fg-muted" aria-hidden>
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <YearsChart />
        </div>

        <ol ref={listRef} className="relative mt-14 space-y-6 pl-12 md:pl-16">
          {/* Track and the line that draws itself while you scroll */}
          <span aria-hidden className="absolute bottom-2 left-[1.15rem] top-2 w-0.5 rounded bg-line md:left-[1.65rem]" />
          <motion.span
            aria-hidden
            className="absolute bottom-2 left-[1.15rem] top-2 w-0.5 origin-top rounded bg-accent md:left-[1.65rem]"
            style={{ scaleY: line }}
          />
          {site.timeline.map((e, i) => {
            const Icon = e.type === "school" ? GraduationCap : Briefcase;
            return (
              <motion.li
                key={e.title}
                className="relative"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.6, ease, delay: 0.05 * i }}
              >
                <motion.span
                  aria-hidden
                  className="absolute -left-12 top-4 grid h-10 w-10 place-items-center rounded-full border-2 bg-surface md:-left-16"
                  style={{ borderColor: e.type === "school" ? "var(--track-lab)" : "var(--accent)", color: e.type === "school" ? "var(--track-lab)" : "var(--accent)" }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 + 0.05 * i }}
                >
                  <Icon size={18} />
                </motion.span>
                <article className="rounded-2xl border border-line bg-surface p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-sm font-semibold">{e.years}</span>
                    <span className="text-sm font-medium text-fg-muted">{e.type === "school" ? "Education" : "Work"}</span>
                  </div>
                  <h3 className="heading mt-3 text-2xl">{e.title}</h3>
                  <p className="font-medium text-accent">{e.place}</p>
                  <ul className="mt-3 space-y-1.5 text-fg-muted">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
