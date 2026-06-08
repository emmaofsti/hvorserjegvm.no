import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://hvorserjegvm.no";
const TITLE = "hvorserjegvm.no — Hvor kan du se Fotball-VM 2026 i Oslo?";
const DESCRIPTION =
  "Komplett oversikt over fan zones, sportsbarer og puber i Oslo som viser Fotball-VM 2026. Filtrer på gratis, alkohol, familievennlig, uteservering og avstand fra deg.";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
          <div className="mx-auto max-w-7xl px-4 space-y-1">
            <p>
              hvorserjegvm.no — uavhengig guide til VM 2026 i Oslo. Data hentet fra venuers nettsider og
              offentlige kilder per juni 2026.
            </p>
            <p>
              Ølpriser via{" "}
              <a className="underline hover:text-slate-200" href="https://www.pilsguiden.no/oslo" target="_blank" rel="noreferrer">
                pilsguiden.no
              </a>
              {" "}— 0,5 L pils, vanlig pris.
            </p>
            <p className="mt-3 border-t border-[var(--border)] pt-3 text-[11px] text-slate-500">
              ⚠️ Denne siden er laget med hjelp av AI. Feil eller endringer kan forekomme.
              Er det noe kritisk — dobbeltsjekk selv.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
