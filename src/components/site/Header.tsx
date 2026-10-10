"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { site } from "@/content/site";

/** Three anchors on the home page. Simple on purpose. */
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

/** Fixed bar: transparent over the home reel, solid once you scroll. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on Escape, lock page scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  useLayoutEffect(() => () => setOpen(false), []);

  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        solid ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" onNavigate={() => setOpen(false)} className="group inline-flex items-center gap-2.5" aria-label={`${site.name}, home`}>
          <span aria-hidden className="h-2 w-2 rounded-full bg-accent [animation:blink_2.4s_ease-in-out_infinite]" />
          <span className="tc text-[0.8125rem] tracking-[0.14em] text-fg">{site.name}</span>
          {pathname !== "/" && <span className="sr-only"> (home)</span>}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="tc link-line py-1 text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
          <a
            href={site.cv}
            download
            className="tc inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 text-fg transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            CV
            <ArrowDownToLine size={14} aria-hidden />
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="tc inline-flex h-11 items-center gap-3 px-1 text-fg md:hidden"
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative block h-3 w-5">
            <span className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
            <span className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="fixed inset-x-0 bottom-0 top-16 bg-bg md:hidden">
          <ul className="shell flex h-full flex-col pb-10 pt-6">
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onNavigate={() => setOpen(false)}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="heading text-5xl">{l.label}</span>
                  <span className="tc text-fg-muted">0{i + 1}</span>
                </Link>
              </li>
            ))}
            <li className="mt-auto">
              <a href={site.cv} download className="tc inline-flex items-center gap-2 border border-line-strong px-5 py-4">
                Download CV
                <ArrowDownToLine size={14} aria-hidden />
              </a>
              <p className="tc mt-6 text-fg-muted">{site.email}</p>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
