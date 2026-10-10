import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80dvh] flex-col items-start justify-center pb-16 pt-32">
      <p className="tc flex items-center gap-3 text-fg-muted">
        <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
        Error 404 · No signal
      </p>
      <h1 className="display mt-6 text-[clamp(3rem,9vw,8rem)]">
        Missing
        <br />
        <span className="text-fg-muted">frame.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-fg-muted">The link may be old, or the project was renamed.</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center gap-2 bg-accent px-5 font-semibold text-on-accent transition-colors hover:bg-fg"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to the homepage
      </Link>
    </section>
  );
}
