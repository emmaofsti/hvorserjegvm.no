import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { Icon } from "@/components/icons";

const TITLE = "Guide til VM 2026 i Oslo — alle våre oversikter";
const DESCRIPTION =
  "Komplett oversikt over alle våre guider til Fotball-VM 2026 i Oslo: gratis steder, fan zones, ølpriser, sportsbarer, kart over bydeler og mer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://hvorserjegvm.no/guide" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://hvorserjegvm.no/guide",
    type: "website",
  },
};

/* Group guides for the hub by intent — easier to scan and helps crawlers
   understand the topical hierarchy. */
const GROUPS = [
  {
    title: "Komplette oversikter",
    eyebrow: "Hovedguider",
    slugs: ["hvor-se-vm-i-oslo", "fan-zone-oslo-vm", "vm-storskjerm-oslo", "norges-kamper-vm-2026", "vm-finalen-oslo-2026"],
  },
  {
    title: "Filtrert etter behov",
    eyebrow: "Etter type",
    slugs: ["gratis-vm-oslo", "billig-ol-vm-oslo", "familievennlig-vm-oslo", "utendors-vm-oslo", "innendors-vm-oslo", "norge-pa-storskjerm-oslo", "vm-afterwork-oslo"],
  },
  {
    title: "Etter bydel",
    eyebrow: "Geografisk",
    slugs: ["vm-sentrum-oslo", "vm-grunerlokka-oslo", "vm-aker-brygge-vika-oslo", "vm-majorstuen-bislett", "vm-bjørvika-gronland"],
  },
  {
    title: "Etter venue-type",
    eyebrow: "Kategori",
    slugs: ["vm-sportsbar-oslo", "vm-pub-oslo"],
  },
];

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Hjem", item: "https://hvorserjegvm.no" },
    { "@type": "ListItem", position: 2, name: "Guide", item: "https://hvorserjegvm.no/guide" },
  ],
};

const COLLECTION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: TITLE,
  description: DESCRIPTION,
  url: "https://hvorserjegvm.no/guide",
  isPartOf: {
    "@type": "WebSite",
    name: "hvorserjegvm.no",
    url: "https://hvorserjegvm.no",
  },
};

export default function GuideHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
      <Link
        href="/"
        className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100 mb-6"
      >
        <Icon.ChevronRight
          size={13}
          strokeWidth={2.4}
          style={{ transform: "rotate(180deg)" }}
        />
        Tilbake
      </Link>

      <header className="mb-10">
        <p className="eyebrow mb-3">Guide-hub</p>
        <h1 className="display display-lg text-slate-50">
          Alle våre guider til VM 2026 i Oslo
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300">
          Velg en vinkling. Vi har samlet alt fra de mest sentrale fan zonene til
          ølpris-oversikt, beste sportsbar og hvor du ser Norges kamper. Alle
          guider er oppdatert per juni 2026 og bygger på data fra venuenes egne
          nettsider, pilsguiden.no og sefotballvm2026.no.
        </p>
      </header>

      {GROUPS.map((group) => {
        const guides = group.slugs
          .map((s) => GUIDES.find((g) => g.slug === s))
          .filter((g): g is (typeof GUIDES)[number] => g != null);
        if (guides.length === 0) return null;
        return (
          <section key={group.title} className="mb-10">
            <p className="eyebrow mb-3">{group.eyebrow}</p>
            <h2 className="display display-sm text-slate-100 mb-5">
              {group.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
                  style={{ borderRadius: "var(--lg-r-xl)" }}
                >
                  <h3 className="text-[15.5px] font-semibold text-slate-100 mb-1.5 leading-snug">
                    {g.h1}
                  </h3>
                  <p className="text-[13.5px] text-slate-400 leading-relaxed">
                    {g.description.length > 130
                      ? g.description.slice(0, 130).trim() + "…"
                      : g.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-red-300">
                    Les guide
                    <Icon.ChevronRight size={12} strokeWidth={2.4} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section
        className="lg-glass-accent mt-12 p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <h2 className="display display-sm text-slate-50 mb-2">
          Vil du heller bare bla?
        </h2>
        <p className="text-[15px] text-slate-200 leading-relaxed mb-5">
          Du finner alle 43 stedene på forsiden, og alle 104 VM-kampene under
          Kamper. Vi har også en nøytral oversikt over ølpriser.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.08] text-slate-100 hover:bg-white/[0.12]"
          >
            Alle steder
          </Link>
          <Link
            href="/kamper"
            className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.08] text-slate-100 hover:bg-white/[0.12]"
          >
            Alle kamper
          </Link>
          <Link
            href="/billigst-ol"
            className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.08] text-slate-100 hover:bg-white/[0.12]"
          >
            Ølpriser
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(BREADCRUMB_SCHEMA).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(COLLECTION_SCHEMA).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
