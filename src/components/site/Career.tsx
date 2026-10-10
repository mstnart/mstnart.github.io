"use client";

import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "../ui";
import { SectionHead } from "./Work";

function startYear() {
  return Math.min(...site.timeline.map((e) => Number(e.years.split(/[–-]/)[0])));
}

/** About: portrait + bio, experience as a ruled table, capabilities in columns. */
export function About() {
  const since = startYear();
  // Newest first reads better in a table.
  const entries = [...site.timeline].reverse();
  const facts = [
    { k: "Based in", v: site.location },
    { k: "Editing since", v: String(since) },
    { k: "Languages", v: site.languages.map((l) => `${l.name} (${l.level})`).join(", ") },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 md:py-36">
      <div className="shell">
        <SectionHead number="02" label="About" id="about-title" title="Story first, then the cut." />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1fr_2fr] md:gap-16">
          <Reveal>
            <div className="group relative aspect-[4/5] max-w-sm overflow-hidden bg-surface-2">
              <Image
                src={site.photo}
                alt={`Portrait of ${site.name}`}
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
              />
              <span className="tc absolute bottom-3 left-3 bg-bg/70 px-2 py-1 text-fg-muted backdrop-blur-sm">{site.name}</span>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.35] tracking-[-0.01em] text-pretty">{site.about}</p>
            </Reveal>
            <dl className="mt-12 grid gap-px border-y border-line sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.k} className="py-5 sm:pr-6">
                  <dt className="tc text-fg-muted">{f.k}</dt>
                  <dd className="mt-2 text-lg">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <h3 className="tc flex gap-4 text-fg-muted">
            <span className="text-accent">—</span>Experience &amp; education
          </h3>
          <ol className="mt-6 border-b border-line">
            {entries.map((e, i) => (
              <Reveal as="li" key={e.title} delay={i * 0.04} className="border-t border-line">
                <article className="grid gap-3 py-7 md:grid-cols-[10rem_1fr_16rem] md:gap-8 md:py-9">
                  <p className="tc pt-1 text-fg-muted">{e.years}</p>
                  <div>
                    <h4 className="heading text-[clamp(1.4rem,2.4vw,2rem)]">{e.title}</h4>
                    <ul className="mt-3 max-w-2xl space-y-1.5 text-fg-muted">
                      {e.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="md:pt-1 md:text-right">
                    <span className="block">{e.place}</span>
                    <span className="tc mt-1 block text-fg-muted">{e.type === "school" ? "Education" : "Work"}</span>
                  </p>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-3">
          {[
            { title: "Capabilities", items: site.expertise as readonly string[] },
            { title: "Tools", items: site.tools as readonly string[] },
            { title: "Languages", items: site.languages.map((l) => `${l.name} — ${l.level}`) },
          ].map((g) => (
            <div key={g.title}>
              <h3 className="tc flex gap-4 border-b border-line pb-4 text-fg-muted">
                <span className="text-accent">—</span>
                {g.title}
              </h3>
              <ul className="mt-2">
                {g.items.map((s) => (
                  <li key={s} className="border-b border-line py-3 text-lg">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
