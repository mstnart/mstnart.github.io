// Runs after `next build` (static export).
// The export writes nested segment prefetch files like
//   out/work/<slug>/__next.work/$d$slug/__PAGE__.txt
// but the client requests the flat, dot-joined name
//   out/work/<slug>/__next.work.$d$slug.__PAGE__.txt
// On a plain static host (GitHub Pages) that 404s and every link prefetch falls back to a slower full fetch.
// This writes the flat copies next to the nested ones.
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const out = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
let copied = 0;

function filesUnder(dir, prefix = []) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p, [...prefix, name]) : [[p, [...prefix, name]]];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const [file, parts] of filesUnder(p)) {
        copyFileSync(file, join(dir, [name, ...parts].join(".")));
        copied++;
      }
    } else if (name !== "media" && name !== "_next") {
      walk(p);
    }
  }
}

walk(out);
console.log(`flatten-segments: ${copied} files`);
