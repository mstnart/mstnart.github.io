"use client";

import { Download, Mail, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { CopyButton } from "../ui";

export function Skills() {
  const groups = [
    { title: "What I do", items: site.expertise },
    { title: "Tools", items: site.tools },
  ];
  return (
    <section aria-labelledby="skills-title" className="border-t border-line bg-surface/60 py-20">
      <div className="shell">
        <p className="eyebrow">Skills</p>
        <h2 id="skills-title" className="heading mt-2 text-[clamp(2rem,4.5vw,3rem)]">
          Skills and tools
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="heading text-xl">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-full bg-surface-2 px-3 py-1.5 font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="heading text-xl">Languages</h3>
            <ul className="mt-4 space-y-3">
              {site.languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-fg-muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20">
      <div className="shell">
        <div className="rounded-[2rem] bg-dark px-6 py-12 text-on-dark md:px-12 md:py-16">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-on-dark/80">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#4ade80]" />
            {site.availability}
          </p>
          <H id="contact-title" className="heading mt-4 max-w-3xl text-[clamp(2rem,5vw,3.5rem)]">
            Hiring, or have a project in mind? Let&apos;s talk.
          </H>
          <p className="mt-4 max-w-2xl text-lg text-on-dark/80">
            Email is the fastest way to reach me. Tell me about the role or the project and when you need it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-on-dark px-5 font-semibold text-dark transition-transform hover:-translate-y-0.5"
            >
              <Mail size={18} aria-hidden />
              {site.email}
            </a>
            <CopyButton
              value={site.email}
              label="Copy email"
              className="inline-flex min-h-12 items-center rounded-xl border border-on-dark/30 px-5 font-semibold transition-colors hover:border-on-dark"
            />
            <a
              href={site.cv}
              download
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-on-dark/30 px-5 font-semibold transition-colors hover:border-on-dark"
            >
              <Download size={18} aria-hidden />
              Download CV
            </a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-on-dark/80">
            <MapPin size={16} aria-hidden />
            {site.location}
          </p>
        </div>
      </div>
    </section>
  );
}
