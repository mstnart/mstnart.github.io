import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });
const display = Inter_Tight({ variable: "--font-display-face", subsets: ["latin", "latin-ext"], weight: ["500", "600"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono-face", subsets: ["latin", "latin-ext"], weight: ["400", "500"], display: "swap" });

const defaultTitle = `${site.name} · ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: defaultTitle, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: { type: "website", siteName: site.name, title: defaultTitle, description: site.description, locale: "en_US" },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable} antialiased`}>
      <body className="grain flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed left-3 top-3 z-[70] -translate-y-24 bg-accent px-4 py-3 font-semibold text-on-accent transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
