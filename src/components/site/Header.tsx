"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { site } from "@/content/site";

/** Three anchors on the home page. Simple on purpose. */
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#career", label: "Career" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on Escape, and when this route is hidden by navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useLayoutEffect(() => () => setOpen(false), []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled || open ? "border-line bg-bg/90 backdrop-blur-md" : "border-transparent bg-bg"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" onNavigate={() => setOpen(false)} className="heading text-xl" aria-label={`${site.name}, home`}>
          {site.name}
          {pathname !== "/" && <span className="sr-only"> (home)</span>}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-4 py-2 font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
              {l.label}
            </Link>
          ))}
          <a
            href={site.cv}
            download
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-dark px-4 py-2 font-medium text-on-dark transition-colors hover:bg-accent"
          >
            <Download size={16} aria-hidden />
            Download CV
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong px-3 font-medium md:hidden"
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          Menu
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-bg md:hidden">
          <ul className="shell flex flex-col py-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onNavigate={() => setOpen(false)} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-lg font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a href={site.cv} download className="inline-flex items-center gap-2 rounded-lg bg-dark px-4 py-3 font-medium text-on-dark">
                <Download size={16} aria-hidden />
                Download CV
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
