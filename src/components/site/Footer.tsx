import { site } from "@/content/site";
import { Year } from "../ui";

export function activeSocials() {
  return site.socials.filter((s) => s.url.trim() !== "");
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="shell flex flex-col gap-4 py-8 text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <Year /> {site.name} · {site.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={`mailto:${site.email}`} className="hover:text-fg">
              Email
            </a>
          </li>
          {activeSocials().map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                {s.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={site.cv} download className="hover:text-fg">
              CV (PDF)
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
