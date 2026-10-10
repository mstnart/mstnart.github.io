"use client";

import { usePauseWhenHidden, usePrefersReducedMotion, useUnloadWhenHidden } from "./ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Plate } from "./Plate";
import type { PlateStyle, ResolvedMedia } from "@/lib/types";

const isDev = process.env.NODE_ENV !== "production";

/** next/image can't optimize SVG or animated GIF; serve those as-is. */
const passthrough = (src: string) => /\.(svg|gif)(\?|$)/i.test(src);

interface FallbackProps {
  plate: { style: PlateStyle; hue?: number };
  seed: string;
}

function Fallback({ plate, seed, kind, src }: FallbackProps & { kind: string; src?: string }) {
  return (
    <div className="absolute inset-0">
      <Plate style={plate.style} hue={plate.hue} seed={seed} className="h-full w-full" label={null} />
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2">
        <span className="meta border border-line-strong bg-ink/80 px-2 py-1 text-bone-dim backdrop-blur-sm">
          {kind} pending
        </span>
        {isDev && src && (
          <code className="meta truncate bg-ink/80 px-2 py-1 normal-case tracking-normal text-bone-faint">
            add file: public{src}
          </code>
        )}
      </div>
    </div>
  );
}

interface MediaFrameProps extends FallbackProps {
  media: ResolvedMedia | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Overrides the media's own aspect ratio. */
  aspect?: number;
}

export function MediaFrame({ media, plate, seed, className = "", sizes = "100vw", priority, aspect }: MediaFrameProps) {
  const [failed, setFailed] = useState(false);
  const ratio = aspect ?? media?.aspect ?? 16 / 9;
  const ok = media?.available && !failed;

  let body: React.ReactNode;
  if (!media) {
    body = <Plate style={plate.style} hue={plate.hue} seed={seed} className="absolute inset-0" />;
  } else if (!ok) {
    body = (
      <Fallback
        plate={plate}
        seed={seed}
        kind={media.type === "image" ? "Image" : "Video"}
        src={media.type === "embed" ? undefined : media.src}
      />
    );
  } else if (media.type === "image") {
    body = (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized={passthrough(media.src)}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    );
  } else if (media.type === "video") {
    body =
      media.mode === "ambient" ? (
        <AmbientVideo src={media.src} poster={media.poster} label={media.alt} onError={() => setFailed(true)} />
      ) : (
        <PlayerVideo src={media.src} poster={media.poster} label={media.alt} onError={() => setFailed(true)} />
      );
  } else {
    body = <Embed src={media.embedSrc} title={media.title} />;
  }

  return (
    <figure className={className}>
      <div className="relative w-full overflow-hidden bg-ink-3" style={{ aspectRatio: ratio }}>
        {body}
      </div>
      {media?.caption && <figcaption className="meta mt-3 text-bone-dim">{media.caption}</figcaption>}
    </figure>
  );
}

/** Video with native controls. Stops when the page is navigated away from. */
function PlayerVideo({ src, poster, label, onError }: { src: string; poster?: string; label: string; onError: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  usePauseWhenHidden(ref);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full bg-black object-contain"
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
      onError={onError}
    />
  );
}

/** YouTube/Vimeo player. Unloaded when the page is navigated away from, so it can't keep playing. */
function Embed({ src, title }: { src?: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useUnloadWhenHidden(ref, src);
  return (
    <iframe
      ref={ref}
      className="absolute inset-0 h-full w-full"
      src={src}
      title={title}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

/** Muted looping video with an accessible pause control. Paused when off-screen or reduced motion is on. */
export function AmbientVideo({
  src,
  poster,
  label,
  onError,
  className = "absolute inset-0 h-full w-full object-cover",
  controlClassName = "bottom-3 right-3",
}: {
  src: string;
  poster?: string;
  label: string;
  onError?: () => void;
  className?: string;
  /** Position classes for the pause button. */
  controlClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = usePrefersReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  usePauseWhenHidden(ref);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduce || userPaused) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, userPaused]);

  return (
    <>
      <video
        ref={ref}
        className={className}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={onError}
      />
      <button
        type="button"
        onClick={() => setUserPaused(playing)}
        className={`meta absolute ${controlClassName} z-10 flex min-h-11 items-center gap-2 border border-line-strong bg-ink/60 px-3 text-bone backdrop-blur-sm transition-colors hover:border-signal hover:text-signal`}
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
        {playing ? "Pause" : "Play"}
      </button>
    </>
  );
}

/** Card cover: real image if one exists, generative plate otherwise. */
export function Cover({
  src,
  alt,
  plate,
  seed,
  sizes,
  sample,
  className = "",
}: FallbackProps & { src: string | null; alt: string; sizes: string; sample?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <Plate style={plate.style} hue={plate.hue} seed={seed} label={sample ? "Sample plate" : null} className={`h-full w-full ${className}`} />
    );
  }
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={passthrough(src)}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
