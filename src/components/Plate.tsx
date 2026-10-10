import { useId } from "react";
import type { PlateStyle } from "@/lib/types";

/**
 * Generative placeholder artwork. Deterministic per `seed`, so a project
 * always gets the same composition. Shown until real media is added.
 */

function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 1000;

interface PlateProps {
  style: PlateStyle;
  hue?: number;
  seed: string;
  className?: string;
  /** Text in the corner tag. Pass null to hide. */
  label?: string | null;
  animated?: boolean;
}

export const plateStyles: PlateStyle[] = ["rings", "contour", "bars", "grid", "strip", "scan", "sun", "stack"];

export function Plate({ style, hue = 18, seed, className = "", label = "Sample plate", animated = false }: PlateProps) {
  const uid = useId().replace(/:/g, "");
  const r = rng(seed + style);
  const accent = `hsl(${hue} 64% 54%)`;
  const accentDeep = `hsl(${hue} 45% 20%)`;
  const bone = "#ece6dc";
  const ink = "#0e0d0b";

  let art: React.ReactNode;

  switch (style) {
    case "rings": {
      const cx = W * (0.55 + r() * 0.2);
      const cy = H * (0.45 + r() * 0.15);
      art = (
        <>
          <circle cx={cx} cy={cy} r={H * 0.34} fill={`url(#g${uid})`} />
          {Array.from({ length: 18 }, (_, i) => (
            <circle
              key={i}
              cx={cx - i * 9}
              cy={cy + i * 3}
              r={H * 0.36 + i * 34}
              fill="none"
              stroke={bone}
              strokeOpacity={0.5 - i * 0.025}
              strokeWidth={i % 4 === 0 ? 2 : 0.8}
            />
          ))}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke={bone} strokeOpacity={0.2} />
        </>
      );
      break;
    }
    case "contour": {
      const lines = 26;
      const f1 = 1.5 + r() * 2;
      const f2 = 3 + r() * 3;
      const ph = r() * Math.PI * 2;
      art = (
        <>
          <rect width={W} height={H} fill={`url(#g${uid})`} opacity={0.55} />
          {Array.from({ length: lines }, (_, i) => {
            const base = (H / lines) * i + 20;
            let d = `M -20 ${base}`;
            for (let x = 0; x <= W + 40; x += 40) {
              const y =
                base +
                Math.sin((x / W) * Math.PI * f1 + ph + i * 0.18) * 60 +
                Math.sin((x / W) * Math.PI * f2 + i * 0.4) * 22 * Math.sin(i * 0.3);
              d += ` L ${x} ${y.toFixed(1)}`;
            }
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i === 13 ? accent : bone}
                strokeOpacity={i === 13 ? 1 : 0.32}
                strokeWidth={i === 13 ? 3 : 1.1}
              />
            );
          })}
        </>
      );
      break;
    }
    case "bars": {
      let x = 0;
      const bars: React.ReactNode[] = [];
      let k = 0;
      while (x < W) {
        const w = 18 + Math.floor(r() * 120);
        const lit = r() > 0.82;
        bars.push(
          <rect
            key={k++}
            x={x}
            y={lit ? H * 0.12 : H * (0.28 + r() * 0.3)}
            width={w - 6}
            height={H}
            fill={lit ? accent : bone}
            opacity={lit ? 1 : 0.08 + r() * 0.2}
          />,
        );
        x += w;
      }
      art = (
        <>
          {bars}
          <rect y={H * 0.82} width={W} height={H * 0.18} fill={ink} />
          <line x1={0} y1={H * 0.82} x2={W} y2={H * 0.82} stroke={bone} strokeOpacity={0.5} />
        </>
      );
      break;
    }
    case "grid": {
      const cols = 16;
      const rows = 10;
      const cw = W / cols;
      const ch = H / rows;
      const hot = new Set(Array.from({ length: 7 }, () => Math.floor(r() * cols * rows)));
      art = (
        <>
          {Array.from({ length: cols * rows }, (_, i) => {
            const cx = (i % cols) * cw;
            const cy = Math.floor(i / cols) * ch;
            return hot.has(i) ? (
              <rect key={i} x={cx + 6} y={cy + 6} width={cw * 2 - 12} height={ch - 12} fill={i % 2 ? accent : bone} opacity={i % 2 ? 0.95 : 0.85} />
            ) : (
              <circle key={i} cx={cx + cw / 2} cy={cy + ch / 2} r={2} fill={bone} opacity={0.35} />
            );
          })}
          <rect x={cw * 3} y={ch * 2} width={cw * 6} height={ch * 6} fill="none" stroke={bone} strokeOpacity={0.5} />
        </>
      );
      break;
    }
    case "strip": {
      const n = 5;
      const fw = W / (n - 0.6);
      art = (
        <g className={animated ? "[animation:plate-drift_14s_linear_infinite_alternate]" : undefined}>
          <rect y={H * 0.16} width={W * 1.2} height={H * 0.68} fill="#000" opacity={0.6} />
          {Array.from({ length: n + 1 }, (_, i) => (
            <g key={i} transform={`translate(${i * fw - fw * 0.2} 0)`}>
              <rect x={14} y={H * 0.24} width={fw - 28} height={H * 0.52} fill={`url(#g${uid})`} opacity={0.35 + ((i * 37) % 60) / 100} />
              <circle cx={fw * (0.3 + r() * 0.4)} cy={H * (0.4 + r() * 0.2)} r={40 + r() * 90} fill={bone} opacity={0.12 + r() * 0.2} />
              {Array.from({ length: 8 }, (_, j) => (
                <rect key={j} x={20 + j * ((fw - 40) / 8)} y={H * 0.18} width={14} height={20} rx={3} fill={bone} opacity={0.4} />
              ))}
              {Array.from({ length: 8 }, (_, j) => (
                <rect key={`b${j}`} x={20 + j * ((fw - 40) / 8)} y={H * 0.78} width={14} height={20} rx={3} fill={bone} opacity={0.4} />
              ))}
            </g>
          ))}
        </g>
      );
      break;
    }
    case "scan": {
      const peaks = Array.from({ length: 160 }, (_, i) => {
        const env = Math.sin((i / 160) * Math.PI) ** 0.6;
        // Round: Math.sin/pow can differ in the last bit between Node and browsers,
        // which would cause a hydration mismatch.
        return Math.round((0.15 + r() * 0.85) * env * 1000) / 1000;
      });
      const markers = [0.18 + r() * 0.1, 0.46 + r() * 0.1, 0.74 + r() * 0.1];
      art = (
        <>
          {Array.from({ length: 50 }, (_, i) => (
            <line key={i} x1={0} x2={W} y1={i * 20} y2={i * 20} stroke={bone} strokeOpacity={0.05} />
          ))}
          {peaks.map((p, i) => (
            <rect key={i} x={i * (W / 160) + 1} y={Math.round(H * 0.5 - p * H * 0.3)} width={W / 160 - 3} height={Math.round(p * H * 0.6)} fill={bone} opacity={0.55} />
          ))}
          {markers.map((m, i) => (
            <g key={i}>
              <line x1={W * m} x2={W * m} y1={H * 0.08} y2={H * 0.92} stroke={accent} strokeWidth={i === 1 ? 4 : 1.5} />
              <rect x={W * m - 7} y={H * 0.08} width={14} height={14} fill={accent} />
            </g>
          ))}
          <rect y={H * 0.86} width={W} height={2} fill={bone} opacity={0.3} />
        </>
      );
      break;
    }
    case "sun": {
      const cy = H * 0.66;
      art = (
        <>
          <circle cx={W * 0.5} cy={cy} r={H * 0.46} fill={`url(#g${uid})`} />
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} x={0} y={cy - 40 + i * (12 + i * 4)} width={W} height={4 + i * 2.6} fill={ink} />
          ))}
          <rect y={cy + H * 0.12} width={W} height={H} fill={ink} />
          <line x1={0} y1={cy + H * 0.12} x2={W} y2={cy + H * 0.12} stroke={bone} strokeOpacity={0.45} />
        </>
      );
      break;
    }
    case "stack": {
      art = (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <text
              key={i}
              x={-40 + i * 26}
              y={190 + i * 128}
              fontSize={240}
              fontWeight={800}
              fill={i === 3 ? accent : "none"}
              stroke={i === 3 ? "none" : bone}
              strokeOpacity={0.55 - Math.abs(3 - i) * 0.12}
              strokeWidth={1.5}
              style={{ fontFamily: "var(--font-bricolage)", fontStretch: "75%", letterSpacing: "-0.02em" }}
            >
              MOTION MOTION
            </text>
          ))}
        </>
      );
      break;
    }
  }

  return (
    <div className={`relative isolate overflow-hidden bg-ink-3 ${className}`} aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        <defs>
          <radialGradient id={`g${uid}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="70%" stopColor={accentDeep} />
            <stop offset="100%" stopColor={ink} />
          </radialGradient>
          <linearGradient id={`v${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ink} stopOpacity="0" />
            <stop offset="1" stopColor={ink} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="#151310" />
        {art}
        <rect width={W} height={H} fill={`url(#v${uid})`} />
      </svg>
      {label && (
        <span className="meta absolute left-3 top-3 border border-line-strong bg-ink/70 px-2 py-1 text-bone-dim backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
