"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const STORAGE_KEY = "ga_consent";
const GA_ID = "G-2REWGYN1VB";

type Consent = "granted" | "denied" | null;

/* Laster Google Analytics først etter at brukeren har sagt ja. Valget
   huskes i localStorage, så banneret vises bare én gang. Inntil brukeren
   tar et valg lastes ingen GA-script og ingen cookies settes. */
export default function ConsentGate() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "granted" || stored === "denied") setConsent(stored);
    } catch {
      /* localStorage utilgjengelig (privat modus e.l.) — vis banneret */
    }
  }, []);

  function choose(value: "granted" | "denied") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignorer — valget gjelder uansett for denne økten */
    }
    setConsent(value);
  }

  // Unngå hydration-mismatch: ikke render noe før vi har lest localStorage
  if (!mounted) return null;

  if (consent === "granted") return <GoogleAnalytics gaId={GA_ID} />;
  if (consent === "denied") return null;

  return (
    <div
      role="dialog"
      aria-label="Samtykke til statistikk"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[1100] mx-auto max-w-md lg:inset-x-auto lg:right-4 lg:bottom-4 lg:mx-0 lg-glass-accent p-5"
      style={{ borderRadius: "var(--lg-r-xl)" }}
    >
      <p className="text-[14px] leading-relaxed text-slate-200">
        Vi bruker Google Analytics for anonym besøksstatistikk — kun for å se
        hvor mange som bruker siden. Er det greit?
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="lg-capsule flex-1 px-4 py-2.5 text-[14px] font-semibold text-white bg-red-500 hover:bg-red-400 transition-colors"
        >
          Ja, det er greit
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="lg-capsule px-4 py-2.5 text-[14px] text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-slate-100 transition-colors"
        >
          Nei takk
        </button>
      </div>
      <p className="mt-3 text-[12px] text-slate-400">
        Du kan lese mer i{" "}
        <a className="underline underline-offset-4 hover:text-slate-200" href="/personvern">
          personvern
        </a>
        .
      </p>
    </div>
  );
}
