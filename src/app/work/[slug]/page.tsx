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
    <Suspense fallback={<div className="shell py-16 text-fg-muted">Loading project…</div>}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-14">
      <div className="shell">
        <h2 id={id} className="heading mb-6 text-[clamp(1.6rem,3vw,2.2rem)]">
          {title}
        </h2>
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
        <header className="shell pb-8 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-fg-muted">
            <Link href="/#work" className="inline-flex min-h-10 items-center gap-1.5 font-medium hover:text-fg">
              <ArrowLeft size={16} aria-hidden /> Back to work
            </Link>
            <span aria-hidden>·</span>
            <Link href={`/#${project.track === "brand" ? "brands" : project.track === "lab" ? "3d" : "gaming"}`} className="hover:text-fg">
              {track.title}
            </Link>
            <span aria-hidden>·</span>
            <span>
              {index + 1} of {list.length}
            </span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <TrackTag track={project.track} />
            {project.kind && <span className="rounded-full border border-line px-2.5 py-1 text-sm">{project.kind}</span>}
            {project.year && <span className="rounded-full border border-line px-2.5 py-1 text-sm">{project.year}</span>}
          </div>
          <h1 className="heading mt-4 max-w-4xl text-[clamp(2.4rem,6vw,4.25rem)]">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-xl text-fg-muted text-pretty">{project.summary}</p>
          {project.notice && (
            <p className="mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-line bg-surface p-4 text-fg-muted">
              <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              {project.notice}
            </p>
          )}
        </header>

        <Hero project={project} />

        {/* Overview + facts */}
        <div className="shell grid gap-10 py-14 md:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            {project.overview && (
              <div>
                <h2 className="heading mb-3 text-2xl">Overview</h2>
                <p className="text-lg text-pretty">{project.overview}</p>
              </div>
            )}
            {project.objective && (
              <div>
                <h2 className="heading mb-3 text-2xl">Goal</h2>
                <p className="text-lg text-fg-muted text-pretty">{project.objective}</p>
              </div>
            )}
            {project.description && project.description.length > 0 && (
              <div className="space-y-4 text-lg text-fg-muted">
                <h2 className="heading mb-3 text-2xl text-fg">Notes</h2>
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
                    <div className="max-w-4xl overflow-hidden rounded-xl">
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
            <ol className="grid gap-4 md:grid-cols-2">
              {project.process.map((s, i) => (
                <li key={i} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="text-sm font-semibold text-accent">Step {i + 1}</span>
                  <h3 className="heading mt-1 text-xl">{s.title}</h3>
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
                <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
                  {project.credits.map((c, i) => (
                    <div key={i} className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="font-semibold">{c.label}</dt>
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
                      <a href={d.href} download className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-fg">
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
        <nav aria-label={`More in ${track.title}`} className="border-t border-line py-10">
          <div className="shell grid gap-4 sm:grid-cols-2">
            {[
              { p: prev, label: "Previous", Icon: ArrowLeft },
              { p: next, label: "Next", Icon: ArrowRight },
            ].map(({ p, label, Icon }) => (
              <Link
                key={label}
                href={`/work/${p.slug}`}
                prefetch
                className={`group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 hover:border-fg ${label === "Next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
              >
                <Icon size={20} aria-hidden className="shrink-0 transition-transform group-hover:scale-110" />
                <span>
                  <span className="block text-sm text-fg-muted">
                    {label} in {track.label}
                  </span>
                  <span className="heading block text-xl">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <Section id="related" title="You might also like">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          className={`overflow-hidden rounded-[1.5rem] border border-line bg-dark ${portrait ? "mx-auto" : ""}`}
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
      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {rows.map(([k, v]) => (
          <div key={k} className="p-4">
            <dt className="text-sm text-fg-muted">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {project.tags && project.tags.length > 0 && (
        <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface-2 px-3 py-1 text-sm">
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
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
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
