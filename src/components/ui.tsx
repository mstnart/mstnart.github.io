"use client";

import { motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const rmQuery = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(rmQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Reduced-motion preference that is safe during hydration:
 * false on the server and on the first client render, then the real value.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeRM,
    () => window.matchMedia(rmQuery).matches,
    () => false,
  );
}

/** Fades + lifts content once when it scrolls into view. Static under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Headline that rises line by line from behind a mask.
 * Each string in `lines` renders as its own line; the full text stays in the DOM for screen readers.
 */
export function MaskedLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  as: Tag = "h1",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.06em] ${lineClassName}`}>
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Copy-to-clipboard button with a polite live announcement. */
export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard blocked (e.g. insecure context): select-able text remains on screen.
        }
      }}
      className={className ?? "meta inline-flex min-h-11 items-center gap-2 border border-line-strong px-4 text-bone transition-colors hover:border-bone"}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Current year, rendered on the client so prerendered pages stay static. */
const noop = () => () => {};

export function Year() {
  const y = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{y ?? ""}</span>;
}
