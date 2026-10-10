"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { tracks, trackByHash, trackById } from "@/content/tracks";
import { categoryById } from "@/content/categories";
import { coverName } from "@/lib/transitions";
import type { ResolvedProject, TrackId } from "@/lib/types";
import { Cover } from "../Media";
import { Reveal } from "../ui";

const pad = (n: number) => String(n).padStart(2, "0");

export function TrackTag({ track }: { track: TrackId }) {
  const t = trackById[track];
  return (
    <span className="tc inline-flex items-center gap-2 text-fg-muted">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: t.colorVar }} />
      {t.label}
    </span>
  );
}

/** Image-led card: cover with a slow zoom, slate-style caption underneath. */
export function ProjectCard({
  project,
  headingLevel = 3,
  index,
  size = "md",
}: {
  project: ResolvedProject;
  headingLevel?: 2 | 3;
  index?: number;
  size?: "md" | "lg";
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const lg = size === "lg";
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <ViewTransition name={coverName(project.slug)} share="morph" default="none">
        <div className={`relative overflow-hidden bg-surface-2 ${lg ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"}`}>
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <Cover
              src={project.cover}
              alt=""
              plate={project.plate}
              seed={project.slug}
              sizes={lg ? "(min-width: 1440px) 1360px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
          <span
            aria-hidden
            className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center bg-accent text-on-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </ViewTransition>
      <div className="mt-4 flex items-start justify-between gap-6 border-t border-line pt-4">
        <div className="min-w-0">
          <H className={`heading transition-colors group-hover:text-accent ${lg ? "text-[clamp(1.75rem,3.2vw,2.75rem)]" : "text-[clamp(1.4rem,2.2vw,1.9rem)]"}`}>
            {project.title}
          </H>
          <p className={`mt-2 max-w-xl text-fg-muted ${lg ? "" : "line-clamp-2"}`}>{project.summary}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          {index !== undefined && <span className="tc text-fg-faint">{pad(index)}</span>}
          <TrackTag track={project.track} />
          {project.year && <span className="tc text-fg-muted">{project.year}</span>}
        </div>
      </div>
    </Link>
  );
}

/** Featured work, then the full filterable index. */
export function Work({ projects }: { projects: ResolvedProject[] }) {
  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const [first, ...others] = featured;
  return (
    <section id="work" aria-labelledby="work-title" className="pb-8 pt-24 md:pt-36">
      <div className="shell">
        <SectionHead number="01" label="Selected work" id="work-title" title="Work that moves." note={`${featured.length} featured · ${projects.length} total`} />
        {first && (
          <Reveal className="mt-14 md:mt-20">
            <ProjectCard project={first} index={1} size="lg" />
          </Reveal>
        )}
        <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
          {others.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 0.08} className={i % 2 ? "md:mt-24" : ""}>
              <ProjectCard project={p} index={i + 2} />
            </Reveal>
          ))}
        </ul>
      </div>
      <Index projects={projects} />
    </section>
  );
}

/** Shared section header: mono slate number + big title. */
export function SectionHead({ number, label, title, id, note }: { number: string; label: string; title: string; id: string; note?: string }) {
  return (
    <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_2fr]">
      <p className="tc flex gap-4 text-fg-muted">
        <span className="text-accent">{number}</span>
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id={id} className="heading text-[clamp(2.5rem,6vw,5.5rem)]">
          {title}
        </h2>
        {note && <p className="tc text-fg-muted">{note}</p>}
      </div>
    </div>
  );
}

type Tab = TrackId | "all";

/** Editorial list of every project. Hover (fine pointers) shows a cover that follows the cursor. */
function Index({ projects }: { projects: ResolvedProject[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [hover, setHover] = useState<ResolvedProject | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 }), sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const list: { id: Tab; label: string; color?: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...tracks.map((t) => ({ id: t.id as Tab, label: t.label, color: t.colorVar, count: projects.filter((p) => p.track === t.id).length })),
  ];

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const set = () => setFinePointer(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Allow links like /#gaming or /#work-brand to open a tab.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "").replace(/^work-/, "");
      const id = trackByHash[h];
      if (id) {
        setTab(id);
        document.getElementById("index")?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const visible = tab === "all" ? projects : projects.filter((p) => p.track === tab);
  const description = tab === "all" ? "Everything, strongest first." : trackById[tab].blurb;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const j = (next + list.length) % list.length;
    setTab(list[j].id);
    tabRefs.current[j]?.focus();
  };

  return (
    <div id="index" className="shell mt-28 md:mt-40" onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY); }}>
      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
        <h3 className="heading text-[clamp(1.75rem,3vw,2.5rem)]">Index</h3>
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-2">
          {list.map((t, i) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls="index-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`tc inline-flex min-h-11 items-center gap-2 border-b transition-colors ${
                  selected ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                {t.color && <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />}
                {t.label}
                <sup className="text-fg-faint">{t.count}</sup>
              </button>
            );
          })}
        </div>
      </div>

      <div id="index-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <p className="tc mt-4 text-fg-muted" aria-live="polite">
          {description} {visible.length} {visible.length === 1 ? "project" : "projects"}.
        </p>
        <ul className="mt-8 border-b border-line" onPointerLeave={() => setHover(null)}>
          {visible.map((p) => {
            const n = projects.indexOf(p) + 1;
            return (
              <li key={p.slug} className="border-t border-line">
                <Link
                  href={`/work/${p.slug}`}
                  onPointerEnter={() => setHover(p)}
                  onFocus={() => setHover(null)}
                  className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[3.5rem_1fr_14rem_8rem_4rem_1.5rem] md:gap-6 md:py-7"
                >
                  <span className="relative aspect-[4/3] overflow-hidden bg-surface-2 md:hidden">
                    <Cover src={p.cover} alt="" plate={p.plate} seed={p.slug} sizes="72px" />
                  </span>
                  <span className="tc hidden text-fg-faint transition-colors group-hover:text-accent md:block">{pad(n)}</span>
                  <span className="min-w-0">
                    <span className="heading block truncate text-[clamp(1.25rem,2.6vw,2.25rem)] transition-transform duration-500 group-hover:translate-x-2">
                      {p.title}
                    </span>
                    <span className="tc mt-1 block text-fg-muted md:hidden">
                      {trackById[p.track].label}
                      {p.year ? ` · ${p.year}` : ""}
                    </span>
                  </span>
                  <span className="tc hidden truncate text-fg-muted md:block">{p.categories.map((c) => categoryById[c].label).join(" / ")}</span>
                  <span className="hidden md:block">
                    <TrackTag track={p.track} />
                  </span>
                  <span className="tc hidden text-fg-muted md:block">{p.year ?? "—"}</span>
                  <ArrowUpRight size={18} aria-hidden className="text-fg-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {finePointer && (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-40" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {hover && (
              <motion.div
                key={hover.slug}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-6 top-6 aspect-[16/10] w-80 overflow-hidden bg-surface-2 shadow-2xl shadow-black/60"
              >
                <Cover src={hover.cover} alt="" plate={hover.plate} seed={hover.slug} sizes="320px" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
