import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f5f1",
          color: "#16161a",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#55534e", letterSpacing: 3 }}>
          <span>PORTFOLIO</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 14, height: 14, background: "#2647e8" }} />
            {site.role.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 168, fontWeight: 800, lineHeight: 0.88, letterSpacing: -6 }}>
          {site.name
            .toUpperCase()
            .split(" ")
            .map((w) => (
              <span key={w}>{w}</span>
            ))}
        </div>
        <div style={{ display: "flex", height: 6, background: "#2647e8", width: 220 }} />
      </div>
    ),
    size,
  );
}
