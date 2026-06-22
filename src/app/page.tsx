import HomeClient from "@/components/HomeClient";
import NorwayMatchBanner from "@/components/NorwayMatchBanner";
import { getVenues, getNorwayMatches } from "@/lib/data";

/* Viser banner for Norges neste kamp når den er innen ~36 timer —
   fanger opp trafikk fra deling/søk rundt kampstart uten å rote til
   forsiden resten av tiden. */
function getUpcomingNorwayMatch() {
  const now = Date.now();
  const HOURS_36 = 36 * 60 * 60 * 1000;
  const HOURS_2 = 2 * 60 * 60 * 1000;
  const upcoming = getNorwayMatches()
    .map((m) => ({ match: m, kickoffMs: new Date(`${m.date}T${m.kickoff}:00+02:00`).getTime() }))
    .filter((x) => x.kickoffMs > now - HOURS_2 && x.kickoffMs - now < HOURS_36)
    .sort((a, b) => a.kickoffMs - b.kickoffMs)[0];
  return upcoming?.match ?? null;
}

export default function Page() {
  const venues = getVenues();
  const norwayMatch = getUpcomingNorwayMatch();
  return (
    <>
      {norwayMatch && <NorwayMatchBanner match={norwayMatch} />}
      <HomeClient venues={venues} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "hvorserjegvm.no",
            url: "https://hvorserjegvm.no",
            inLanguage: "nb-NO",
            description:
              "Komplett oversikt over steder i Oslo som viser Fotball-VM 2026.",
          }),
        }}
      />
    </>
  );
}
