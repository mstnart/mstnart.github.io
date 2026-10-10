"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Before/after slider. The range input does the work, so it is keyboard
 * and screen-reader accessible; dragging anywhere on the image moves it.
 */
export function GradeSlider({
  before,
  after,
  beforeLabel = "Source",
  afterLabel = "Graded",
  alt,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      <div
        ref={box}
        className="relative aspect-video w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-ink-3"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image src={after} alt={`${alt}, ${afterLabel.toLowerCase()}`} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={`${alt}, ${beforeLabel.toLowerCase()}`} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" draggable={false} />
        </div>
        <span className="meta absolute left-3 top-3 bg-ink/80 px-2 py-1 text-bone backdrop-blur-sm">{beforeLabel}</span>
        <span className="meta absolute right-3 top-3 bg-signal px-2 py-1 text-signal-ink">{afterLabel}</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-bone" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-bone bg-ink/70 text-bone backdrop-blur-sm">
            ⇆
          </span>
        </div>
      </div>
      <label htmlFor={id} className="sr-only">
        Compare {beforeLabel} and {afterLabel}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${Math.round(pos)}% ${beforeLabel}`}
        className="mt-3 w-full accent-[var(--accent)]"
      />
    </div>
  );
}

/** Source clips and finished edit side by side, with a button that plays both from the start. */
export function EditCompare({
  source,
  sourcePoster,
  sourceLabel = "Source",
  edit,
  editPoster,
  editLabel = "Edit",
}: {
  source: string;
  sourcePoster?: string;
  sourceLabel?: string;
  edit: string;
  editPoster?: string;
  editLabel?: string;
}) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [both, setBoth] = useState(false);

  const toggleBoth = () => {
    const vids = [a.current, b.current].filter(Boolean) as HTMLVideoElement[];
    if (both) {
      vids.forEach((v) => v.pause());
      setBoth(false);
      return;
    }
    vids.forEach((v) => {
      v.currentTime = 0;
      v.play().catch(() => {});
    });
    setBoth(true);
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            [a, source, sourcePoster, sourceLabel, true],
            [b, edit, editPoster, editLabel, false],
          ] as const
        ).map(([ref, src, poster, label, muted], i) => (
          <figure key={i}>
            <div className="relative aspect-video overflow-hidden bg-black">
              <video
                ref={ref}
                src={src}
                poster={poster}
                controls
                playsInline
                muted={muted}
                preload="metadata"
                onPause={() => setBoth(false)}
                className="absolute inset-0 h-full w-full object-contain"
                aria-label={label}
              />
            </div>
            <figcaption className={`meta mt-2 ${i === 1 ? "text-signal" : "text-bone-dim"}`}>{label}</figcaption>
          </figure>
        ))}
      </div>
      <button
        type="button"
        onClick={toggleBoth}
        className="meta mt-4 inline-flex min-h-11 items-center gap-2 border border-line-strong px-4 text-bone transition-colors hover:border-signal hover:text-signal"
      >
        {both ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
        {both ? "Pause both" : "Play both from the start"}
      </button>
    </div>
  );
}
