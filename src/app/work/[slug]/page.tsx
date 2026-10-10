import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Info } from "lucide-react";
import { categoryById } from "@/content/categories";
import { trackById } from "@/content/tracks";
import { getNeighbours, getProject, getProjects, getRelated } from "@/lib/projects";
import { coverName } from "@/lib/transitions";
import type { ResolvedMedia, ResolvedProject } from "@/lib/types";
import { MediaFrame } from "@/components/Media";
import { EditCompare, GradeSlider } from "@/components/Compare";
import { plateStyles } from "@/components/Plate";
import { ProjectCard, TrackTag } from "@/components/site/Work";
import { Contact } from "@/components/site/Contact";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, type: "article", ...(p.cover ? { images: [{ url: p.cover }] } : {}) },
  };
}

export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<div className="shell tc pb-16 pt-36 text-fg-muted">Loading project…</div>}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="py-16 md:py-24">
      <div className="shell">
        <div className="mb-10 grid gap-4 border-t border-line pt-6 md:grid-cols-[1fr_2fr]">
          <p className="tc text-accent">—</p>
          <h2 id={id} className="heading text-[clamp(1.9rem,3.6vw,3rem)]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next, list } = getNeighbours(slug);
  const index = list.findIndex((p) => p.slug === slug);
  const related = getRelated(slug, 3);
  const track = trackById[project.track];

  return (
    <ViewTransition enter="page" exit="page" default="none">
      <article>
        {/* Header */}
        <header className="shell pb-10 pt-28 md:pb-14 md:pt-36">
          <nav aria-label="Breadcrumb" className="tc flex flex-wrap items-center gap-x-3 gap-y-2 text-fg-muted">
            <Link href="/#work" className="inline-flex min-h-10 items-center gap-1.5 hover:text-fg">
              <ArrowLeft size={16} aria-hidden /> Back to work
            </Link>
            <span aria-hidden>·</span>
            <Link href={track.href} className="hover:text-fg">
              {track.title}
            </Link>
            <span aria-hidden>·</span>
            <span>
              {index + 1} of {list.length}
            </span>
          </nav>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
            <TrackTag track={project.track} />
            {project.kind && <span className="tc text-fg-muted">{project.kind}</span>}
            {project.year && <span className="tc text-fg-muted">{project.year}</span>}
          </div>
          <h1 className="display mt-5 max-w-6xl text-[clamp(2.75rem,8vw,7.5rem)]">{project.title}</h1>
          <p className="mt-6 max-w-3xl text-xl text-fg-muted text-pretty">{project.summary}</p>
          {project.notice && (
            <p className="mt-8 flex max-w-3xl items-start gap-3 border-l-2 border-accent bg-surface py-3 pl-4 pr-4 text-fg-muted">
              <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              {project.notice}
            </p>
          )}
        </header>

        <Hero project={project} />

        {/* Overview + facts */}
        <div className="shell grid gap-12 py-16 md:grid-cols-[1fr_22rem] md:gap-20 md:py-24">
          <div className="space-y-8">
            {project.overview && (
              <div>
                <h2 className="tc mb-4 text-fg-muted">Overview</h2>
                <p className="text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.4] text-pretty">{project.overview}</p>
              </div>
            )}
            {project.objective && (
              <div>
                <h2 className="tc mb-4 text-fg-muted">Goal</h2>
                <p className="text-lg text-fg-muted text-pretty">{project.objective}</p>
              </div>
            )}
            {project.description && project.description.length > 0 && (
              <div className="space-y-4 text-lg text-fg-muted">
                <h2 className="tc mb-4 text-fg-muted">Notes</h2>
                {project.description.map((d, i) => (
                  <p key={i} className="text-pretty">
                    {d}
                  </p>
                ))}
              </div>
            )}
          </div>
          <Facts project={project} />
        </div>

        {project.comparisons.length > 0 && (
          <Section id="source-edit" title="Source vs. final edit">
            <p className="-mt-3 mb-8 max-w-2xl text-fg-muted">Raw material next to the finished piece, so you can see what the edit, grade and sound changed.</p>
            <div className="space-y-12">
              {project.comparisons.map((c, i) => (
                <div key={i}>
                  <h3 className="mb-3 text-lg font-semibold">{c.title}</h3>
                  {c.type === "grade" ? (
                    <div className="max-w-5xl overflow-hidden">
                      <GradeSlider before={c.before} after={c.after} beforeLabel={c.beforeLabel ?? "Source"} afterLabel={c.afterLabel ?? "Graded"} alt={`${project.title}, ${c.title}`} />
                    </div>
                  ) : (
                    <EditCompare source={c.source} sourcePoster={c.sourcePoster} sourceLabel={c.sourceLabel} edit={c.edit} editPoster={c.editPoster} editLabel={c.editLabel} />
                  )}
                  {c.caption && <p className="mt-3 max-w-2xl text-fg-muted">{c.caption}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {project.gallery.length > 0 && (
          <Section id="gallery" title={`Gallery (${project.gallery.length})`}>
            <Gallery project={project} />
          </Section>
        )}

        {project.process.length > 0 && (
          <Section id="process" title="Process">
            <ol className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              {project.process.map((s, i) => (
                <li key={i} className="border-t border-line pt-5">
                  <span className="tc text-accent">Step {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="heading mt-3 text-2xl">{s.title}</h3>
                  <p className="mt-1 text-fg-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {((project.credits?.length ?? 0) > 0 || project.downloads.length > 0) && (
          <Section id="credits" title="Credits and files">
            <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
              {project.credits && project.credits.length > 0 && (
                <dl className="divide-y divide-line border-y border-line">
                  {project.credits.map((c, i) => (
                    <div key={i} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                      <dt className="tc pt-1 text-fg-muted">{c.label}</dt>
                      <dd className="text-fg-muted">
                        {c.url ? (
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 underline underline-offset-4 hover:text-fg">
                            {c.detail}
                            <ExternalLink size={14} aria-hidden className="mt-1 shrink-0" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          c.detail
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {project.downloads.length > 0 && (
                <ul className="space-y-3">
                  {project.downloads.map((d) => (
                    <li key={d.href}>
                      <a href={d.href} download className="flex items-center justify-between gap-4 border border-line-strong p-4 transition-colors hover:border-accent">
                        <span>
                          <span className="block font-semibold">{d.label}</span>
                          {d.meta && <span className="text-sm text-fg-muted">{d.meta}</span>}
                        </span>
                        <Download size={18} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        )}
      </article>

      {prev && next && (
        <nav aria-label={`More in ${track.title}`} className="py-10">
          <div className="shell grid border-y border-line sm:grid-cols-2">
            {[
              { p: prev, label: "Previous", Icon: ArrowLeft },
              { p: next, label: "Next", Icon: ArrowRight },
            ].map(({ p, label, Icon }) => (
              <Link
                key={label}
                href={`/work/${p.slug}`}
                className={`group flex items-center gap-5 py-8 transition-colors hover:text-accent ${label === "Next" ? "border-t border-line sm:flex-row-reverse sm:border-l sm:border-t-0 sm:pl-8 sm:text-right" : "sm:pr-8"}`}
              >
                <Icon size={20} aria-hidden className="shrink-0 transition-transform group-hover:scale-110" />
                <span>
                  <span className="tc block text-fg-muted">
                    {label} in {track.label}
                  </span>
                  <span className="heading mt-2 block text-[clamp(1.5rem,3vw,2.5rem)]">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <Section id="related" title="You might also like">
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Contact />
    </ViewTransition>
  );
}

function Hero({ project }: { project: ResolvedProject }) {
  const media: ResolvedMedia | null =
    project.hero ?? (project.cover ? { type: "image", src: project.cover, alt: project.title, available: true } : null);
  const aspect = media?.aspect ?? 16 / 9;
  const portrait = aspect < 1;
  return (
    <div className="shell">
      <ViewTransition name={coverName(project.slug)} share="morph" default="none">
        <div
          className={`overflow-hidden bg-dark ${portrait ? "mx-auto" : ""}`}
          style={portrait ? { maxWidth: `calc(80svh * ${aspect})` } : undefined}
        >
          <MediaFrame media={media} plate={project.plate} seed={project.slug} priority sizes={portrait ? "50vw" : "(min-width: 1200px) 1150px, 100vw"} aspect={aspect} />
        </div>
      </ViewTransition>
    </div>
  );
}

function Facts({ project }: { project: ResolvedProject }) {
  const rows: [string, React.ReactNode][] = [["Section", trackById[project.track].title]];
  rows.push(["Type", project.categories.map((c) => categoryById[c].label).join(", ")]);
  if (project.role) rows.push(["My role", project.role]);
  if (project.year) rows.push(["Year", project.year]);
  if (project.client) rows.push(["Client", project.client]);
  if (project.tools?.length) rows.push(["Tools", project.tools.join(", ")]);
  return (
    <aside aria-label="Project facts">
      <dl className="divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="py-4">
            <dt className="tc text-fg-muted">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>
      {project.tags && project.tags.length > 0 && (
        <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li key={t} className="tc border border-line px-2.5 py-1 text-fg-muted">
              {t}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Gallery({ project }: { project: ResolvedProject }) {
  const items = project.gallery;
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {items.map((m, i) => {
        const portrait = (m.aspect ?? 16 / 9) < 1;
        const wide = !portrait && items.length > 2 && i % 5 === 0;
        return (
          <li key={i} className={`${wide ? "sm:col-span-2" : ""}`}>
            <div className="overflow-hidden bg-surface">
              <MediaFrame
                media={m}
                plate={{ style: plateStyles[(plateStyles.indexOf(project.plate.style) + i + 1) % plateStyles.length], hue: project.plate.hue }}
                seed={`${project.slug}-g${i}`}
                sizes={wide ? "(min-width: 1200px) 1150px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
