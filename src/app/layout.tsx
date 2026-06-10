import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://hvorserjegvm.no";
const TITLE = "hvorserjegvm.no — Hvor kan du se Fotball-VM 2026 i Oslo?";
const DESCRIPTION =
  "Komplett oversikt over fan zones, sportsbarer og puber i Oslo som viser Fotball-VM 2026. Filtrer på gratis, alkohol, familievennlig, uteservering og avstand fra deg.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · hvorserjegvm.no" },
  description: DESCRIPTION,
  applicationName: "hvorserjegvm.no",
  authors: [{ name: "hvorserjegvm.no" }],
  keywords: [
    "VM 2026", "Fotball-VM 2026", "Oslo", "storskjerm", "fan zone",
    "Norge", "fotballpub", "sportsbar", "VM-fest", "Lekter'n",
    "Fotball i Parken", "Jordal Amfi",
  ],
  openGraph: {
    type: "website",
    siteName: "hvorserjegvm.no",
    title: TITLE,
    description: DESCRIPTION,
    locale: "nb_NO",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "hvorserjegvm.no",
  },
  // Icons håndteres av Next.js sin file-convention (src/app/icon.jpg,
  // apple-icon.jpg, opengraph-image.jpg) — den setter <link rel=…>
  // automatisk basert på filer i app-mappa.
};

// Schema.org Organization — gjør at Google viser logoen i søkeresultater
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "hvorserjegvm.no",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.jpg`,
  description: DESCRIPTION,
  sameAs: ["https://hvorserjegvm.no"],
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Pre-hydration theme setter — runs synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Schema.org Organization — for Google search result logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/[0.06] py-6 lg:py-8 text-[12px] text-[var(--text-muted)] bottom-safe hidden lg:block">
          <div className="mx-auto max-w-7xl px-4 space-y-2">
            <p className="leading-relaxed">
              hvorserjegvm.no — uavhengig hobbyprosjekt. Ikke tilknyttet FIFA eller NFF.
              Data hentet fra venuers nettsider og offentlige kilder per juni 2026.{" "}
              <a className="underline underline-offset-4 hover:text-slate-200" href="/om">
                Om siden
              </a>
              {" · "}
              <a className="underline underline-offset-4 hover:text-slate-200" href="/guide">
                Alle guider
              </a>
              {" · "}
              <a className="underline underline-offset-4 hover:text-slate-200" href="/endre">
                Endre eller fjerne info
              </a>
              {" · "}
              <a className="underline underline-offset-4 hover:text-slate-200" href="/personvern">
                Personvern
              </a>
            </p>
            <p className="leading-relaxed">
              Ølpriser via{" "}
              <a className="underline underline-offset-4 hover:text-slate-200" href="https://www.pilsguiden.no/oslo" target="_blank" rel="noreferrer">
                pilsguiden.no
              </a>
              {" "}— 0,5 L pils, vanlig pris.
            </p>
            <p className="mt-4 inline-flex items-start gap-1.5 border-t border-white/[0.06] pt-4 text-[11px] text-slate-500 leading-relaxed">
              <span className="mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              Denne siden er laget med hjelp av AI. Feil eller endringer kan forekomme — er det noe kritisk, dobbeltsjekk selv.
            </p>
          </div>
        </footer>
        {/* Mobil-footer: kun nødvendige lenker, plass for bottom-nav */}
        <div className="lg:hidden border-t border-white/[0.06] px-4 py-5 pb-24 text-center text-[11px] text-slate-500 space-y-1.5 bottom-safe">
          <p>
            <a className="underline underline-offset-4 hover:text-slate-300" href="/om">
              Om
            </a>
            {" · "}
            <a className="underline underline-offset-4 hover:text-slate-300" href="/guide">
              Guider
            </a>
            {" · "}
            <a className="underline underline-offset-4 hover:text-slate-300" href="/endre">
              Endre info
            </a>
            {" · "}
            <a className="underline underline-offset-4 hover:text-slate-300" href="/personvern">
              Personvern
            </a>
          </p>
          <p className="text-slate-600">
            Kilde for ølpriser:{" "}
            <a className="underline underline-offset-4 hover:text-slate-400" href="https://www.pilsguiden.no/oslo" target="_blank" rel="noreferrer">
              pilsguiden.no
            </a>
          </p>
          <p>Laget med hjelp av AI. Verifiser kritisk info selv.</p>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
