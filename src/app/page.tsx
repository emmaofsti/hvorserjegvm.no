import HomeClient from "@/components/HomeClient";
import { getVenues } from "@/lib/data";

export default function Page() {
  const venues = getVenues();
  return (
    <>
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
