import type { Metadata } from "next";
import MatchesClient from "@/components/MatchesClient";
import { getMatches } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alle VM-kamper 2026 i norsk tid",
  description:
    "Komplett oversikt over alle 104 kamper i Fotball-VM 2026 i norsk tid. Søk på land, filtrer på gruppe og kommende kamper.",
  alternates: { canonical: "https://hvorserjegvm.no/kamper" },
};

export default function KamperPage() {
  return (
    <>
      <MatchesClient matches={getMatches()} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: "FIFA Fotball-VM 2026",
            startDate: "2026-06-11",
            endDate: "2026-07-19",
            sport: "Football",
            location: { "@type": "Place", name: "USA / Canada / Mexico" },
          }),
        }}
      />
    </>
  );
}
