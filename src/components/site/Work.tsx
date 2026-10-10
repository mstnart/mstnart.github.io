"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { ArrowRight } from "lucide-react";
import { tracks, trackById } from "@/content/tracks";
import { coverName } from "@/lib/transitions";
import type { ResolvedProject, TrackId } from "@/lib/types";
import { Cover } from "../Media";

export function TrackTag({ track }: { track: TrackId }) {
  const t = trackById[track];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-sm font-medium">
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: t.colorVar }} />
      {t.label}
    </span>
  );
}

export function ProjectCard({ project, headingLevel = 3 }: { project: ResolvedProject; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      href={`/work/${project.slug}`}
      prefetch
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-xl hover:shadow-black/5"
    >
      <ViewTransition name={coverName(project.slug)} share="morph" default="none">
        <div className="relative aspect-video overflow-hidden bg-surface-2">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
            <Cover src={project.cover} alt="" plate={project.plate} seed={project.slug} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
          </div>
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <TrackTag track={project.track} />
          {project.year && <span className="text-sm text-fg-muted">{project.year}</span>}
        </div>
        <H className="heading mt-1 text-xl">{project.title}</H>
        <p className="line-clamp-2 text-fg-muted">{project.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-accent">
          View project
          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

type Tab = TrackId | "all";

/** Tabs follow the WAI-ARIA tabs pattern: arrow keys move between them. */
export function Work({ projects }: { projects: ResolvedProject[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const list: { id: Tab; label: string; color?: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...tracks.map((t) => ({ id: t.id as Tab, label: t.label, color: t.colorVar, count: projects.filter((p) => p.track === t.id).length })),
  ];

  // Allow links like /#gaming or /#work-brand to open a tab.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "").replace(/^work-/, "");
      const id = h === "brands" ? "brand" : h === "3d" ? "lab" : h;
      if (id in trackById) {
        setTab(id as TrackId);
        document.getElementById("work")?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const visible = tab === "all" ? projects : projects.filter((p) => p.track === tab);
  const description = tab === "all" ? "Everything, newest and strongest first." : trackById[tab].blurb;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const j = (next + list.length) % list.length;
    setTab(list[j].id);
    tabRefs.current[j]?.focus();
  };

  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-line bg-surface/60 py-20">
      <div className="shell">
        <p className="eyebrow">My work</p>
        <h2 id="work-title" className="heading mt-2 text-[clamp(2rem,4.5vw,3rem)]">
          Gaming, brands and 3D
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-fg-muted">
          Pick a section to filter. Every card opens a page with the video, the process and the credits.
        </p>

        <div role="tablist" aria-label="Work sections" className="mt-8 flex flex-wrap gap-2">
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
                aria-controls="work-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-medium transition-colors ${
                  selected ? "border-fg bg-fg text-bg" : "border-line-strong bg-surface hover:border-fg"
                }`}
              >
                {t.color && <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />}
                {t.label}
                <span className={selected ? "text-bg/70" : "text-fg-muted"}>{t.count}</span>
              </button>
            );
          })}
        </div>

        <div id="work-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6">
          <p className="mb-6 text-fg-muted" aria-live="polite">
            {description} {visible.length} {visible.length === 1 ? "project" : "projects"}.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
