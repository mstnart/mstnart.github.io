import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70dvh] flex-col items-start justify-center py-16">
      <p className="eyebrow">Error 404</p>
      <h1 className="heading mt-2 text-[clamp(2.4rem,6vw,4rem)]">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-md text-lg text-fg-muted">The link may be old, or the project was renamed.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-5 font-semibold text-on-accent"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to the homepage
      </Link>
    </section>
  );
}
