"use client";

import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { CopyButton } from "../ui";
import { activeSocials } from "./Footer";

/** Closing call to action: one huge line, the email as the main link. */
export function Contact({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  const socials = activeSocials();
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[70vw] w-[70vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="shell relative">
        <p className="tc flex items-center gap-3 text-fg-muted">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#4ade80]" />
          {site.availability}
        </p>
        <H id="contact-title" className="display mt-8 text-[clamp(3.25rem,10vw,9.5rem)]">
          Let&apos;s make
          <br />
          <span className="text-fg-muted">something</span> <span className="text-accent">good.</span>
        </H>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:mt-20 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="tc text-fg-muted">Email is the fastest way to reach me</p>
            <a
              href={`mailto:${site.email}`}
              className="heading link-line group mt-4 inline-flex items-center gap-3 break-all text-[clamp(1.5rem,4vw,3.25rem)] hover:text-accent"
            >
              {site.email}
              <ArrowUpRight aria-hidden className="h-[0.8em] w-[0.8em] shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <CopyButton
                value={site.email}
                label="Copy email"
                className="tc inline-flex min-h-12 items-center border border-line-strong px-5 text-fg transition-colors hover:border-fg"
              />
              <a
                href={site.cv}
                download
                className="tc inline-flex min-h-12 items-center gap-2 border border-line-strong px-5 text-fg transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
              >
                Download CV
                <ArrowDownToLine size={14} aria-hidden />
              </a>
            </div>
          </div>
          <dl className="grid content-start gap-6">
            <div>
              <dt className="tc text-fg-muted">Location</dt>
              <dd className="mt-1 text-lg">{site.location}</dd>
            </div>
            {socials.length > 0 && (
              <div>
                <dt className="tc text-fg-muted">Elsewhere</dt>
                <dd className="mt-1">
                  <ul>
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-lg">
                          {s.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
