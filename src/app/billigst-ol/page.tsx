import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getVenues } from "@/lib/data";
import { getVenueImageUrl, isAIGeneratedImage } from "@/lib/venueImages";
import { Icon } from "@/components/icons";
import { AlcoholDisclaimer } from "@/components/AlcoholDisclaimer";

/* ──────────────────────────────────────────────────────────────────────────
 * /billigst-ol — ølpris-oversikt
 *
 * Side-rammen er bevisst nøytral og informasjonsorientert for å være i tråd
 * med Alkoholloven §9-2. Vi *gjengir* offentlig forbrukerinformasjon fra
 * pilsguiden.no — vi rangerer ikke produkter, oppfordrer ikke til kjøp, og
 * bruker ingen markedsføringsspråk ("billigst", "best deal", "spar X kr").
 *
 * Headings, intro og CTAs er skrevet om fra tidligere "Topp 10 billigst"-
 * vinkling for å redusere risiko for å bli klassifisert som alkoholreklame.
 * ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Ølpriser i Oslo under VM 2026 — forbrukerinformasjon",
  description:
    "Oversikt over ølpriser ved VM-stedene i Oslo. Data fra pilsguiden.no. Presenteres som forbrukerinformasjon — 18 års aldersgrense.",
  alternates: { canonical: "https://hvorserjegvm.no/billigst-ol" },
  openGraph: {
    title: "Ølpriser i Oslo under VM 2026",
    description:
      "Nøytral oversikt over registrerte ølpriser ved VM-stedene i Oslo, hentet fra pilsguiden.no.",
    url: "https://hvorserjegvm.no/billigst-ol",
    type: "article",
  },
};

export default function BilligstOlPage() {
  const venues = getVenues();
  const withPrice = venues
    .filter((v) => v.beerPrice !== null)
    .sort((a, b) => (a.beerPrice ?? 0) - (b.beerPrice ?? 0));

  const cheapest = withPrice[0];
  const mostExpensive = withPrice[withPrice.length - 1];
  const prices = withPrice.map((v) => v.beerPrice!).filter(Boolean);
  const median = prices[Math.floor(prices.length / 2)];
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
      <Link
        href="/"
        className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100 mb-6"
      >
        <Icon.ChevronRight size={13} strokeWidth={2.4} style={{ transform: "rotate(180deg)" }} />
        Tilbake til alle steder
      </Link>

      {/* Hero — nøytral, forbrukerinformasjonsrammet */}
      <header className="mb-6">
        <p className="eyebrow mb-3">
          Forbrukerinformasjon · Oppdatert {cheapest.beerPriceUpdated}
        </p>
        <h1 className="display display-lg text-slate-50">
          Ølpriser ved VM-stedene<br />i Oslo
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300 max-w-2xl">
          Denne siden gjengir registrerte priser på 0,5 L pils ved venuer som
          viser Fotball-VM 2026 på storskjerm. Tallene er hentet fra{" "}
          <a
            href="https://www.pilsguiden.no/oslo"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 text-slate-200 hover:text-slate-50"
          >
            pilsguiden.no
          </a>{" "}
          og presenteres som offentlig tilgjengelig forbrukerinformasjon.
        </p>
      </header>

      {/* 18+ disclaimer — første ting under hero */}
      <div className="mb-8">
        <AlcoholDisclaimer />
      </div>

      {/* Pris-statistikk — nøytrale tall, ingen drama */}
      <section
        className="lg-surface mb-8 p-6 sm:p-8"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <p className="eyebrow mb-4">Nøkkeltall · {withPrice.length} venuer med registrert pris</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          <div>
            <p className="eyebrow mb-2">Lavest registrert</p>
            <p className="num-display text-3xl text-slate-100 sm:text-4xl">{cheapest.beerPrice}</p>
            <p className="mt-0.5 text-[12px] text-slate-400">kr · 0,5 L</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Høyest registrert</p>
            <p className="num-display text-3xl text-slate-100 sm:text-4xl">{mostExpensive.beerPrice}</p>
            <p className="mt-0.5 text-[12px] text-slate-400">kr · 0,5 L</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Median</p>
            <p className="num-display text-3xl text-slate-100 sm:text-4xl">{median}</p>
            <p className="mt-0.5 text-[12px] text-slate-400">kr</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Gjennomsnitt</p>
            <p className="num-display text-3xl text-slate-100 sm:text-4xl">{avg}</p>
            <p className="mt-0.5 text-[12px] text-slate-400">kr</p>
          </div>
        </div>
      </section>

      {/* Full liste — alfabetisk vil være enda mer nøytral, men prissortering
          er hva folk forventer. Vi unngår språk som "vinner" / "billigst" og
          bruker bare nummerert liste. */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-2">
          Registrerte priser
        </h2>
        <p className="mb-5 text-[14px] text-slate-400">
          Sortert fra lavest til høyest. Pris gjelder vanlig 0,5 L pils — ikke
          happy hour eller event-priser. Tall fra pilsguiden.no per{" "}
          {cheapest.beerPriceUpdated}.
        </p>

        <div className="space-y-2">
          {withPrice.map((v, i) => (
            <Link
              key={v.id}
              href={`/sted/${v.id}`}
              className="lg-surface group block p-4 transition-colors hover:bg-white/[0.04]"
              style={{ borderRadius: "var(--lg-r-l)" }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="num-display flex shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/[0.10]"
                  style={{ width: 36, height: 36, fontSize: 13 }}
                >
                  {i + 1}
                </div>

                {(() => {
                  const imgUrl = getVenueImageUrl(v.id, v.category);
                  const isAI = isAIGeneratedImage(imgUrl);
                  return (
                    <div
                      className="relative hidden shrink-0 overflow-hidden bg-white/5 sm:block"
                      style={{ width: 64, height: 48, borderRadius: "var(--lg-r-m)" }}
                    >
                      <Image
                        src={imgUrl}
                        alt={isAI ? `${v.name} (AI-illustrasjon)` : v.name}
                        width={64}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                      {/* Mini AI-badge — bare en liten "AI"-prikk siden
                          thumbnail er for liten til full tekst. Tooltip
                          gir full forklaring. */}
                      {isAI && (
                        <span
                          className="absolute right-0.5 bottom-0.5 inline-flex h-3.5 items-center rounded bg-black/70 px-1 text-[8.5px] font-bold text-white/95 backdrop-blur-sm"
                          title="AI-generert illustrasjon"
                          aria-label="AI-illustrasjon"
                        >
                          AI
                        </span>
                      )}
                    </div>
                  );
                })()}

                <div className="min-w-0 flex-1">
                  <h3 className="text-[14.5px] font-medium tracking-tight text-slate-100 truncate">
                    {v.name}
                  </h3>
                  <p className="text-[12px] text-slate-500 truncate">
                    {v.neighborhood ?? "Oslo"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="num-display text-[18px] text-slate-100 sm:text-[20px]">
                    {v.beerPrice}
                  </p>
                  <p className="text-[10.5px] text-slate-500">kr · 0,5 L</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — vekk fra ølpris-vinklingen, mot hovedproduktet */}
      <section
        className="lg-glass-accent mb-8 p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <h2 className="display display-sm text-slate-50 mb-2">
          Se alle 43 VM-stedene i Oslo
        </h2>
        <p className="mb-4 text-[14px] text-slate-200">
          Ølpris er bare ett av mange filtre — bruk kartet for å finne stedet
          som passer best for deg, basert på avstand, kapasitet og hvilke
          kamper de viser.
        </p>
        <Link
          href="/"
          className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.08] text-slate-100 hover:bg-white/[0.12]"
        >
          <Icon.MapPin size={13} strokeWidth={2.4} /> Åpne kartet
        </Link>
      </section>

      {/* Metode + kildeangivelse */}
      <section className="border-t border-white/[0.06] pt-6 text-[12.5px] text-slate-500 leading-relaxed">
        <p className="eyebrow mb-2 text-slate-400">Metode og kilde</p>
        <p className="mb-2">
          Priser er innhentet fra{" "}
          <a className="underline hover:text-slate-300" href="https://www.pilsguiden.no/oslo" target="_blank" rel="noreferrer">
            pilsguiden.no
          </a>{" "}
          per {cheapest.beerPriceUpdated}. Pris gjelder vanlig 0,5 L pils — ikke
          happy hour eller event-priser. {withPrice.length} av {venues.length}{" "}
          VM-steder har registrert pris. Resten er som regel fan zones med
          event-prising eller venuer der pris ikke er publisert.
        </p>
        <p>
          Vi tar forbehold om at priser kan endre seg under turneringen. Sjekk
          venuens egen nettside før viktige beslutninger. Er prisen feil?{" "}
          <Link
            href="/endre"
            className="underline hover:text-slate-300"
          >
            Si fra her
          </Link>
          .
        </p>
      </section>

      {/* Structured data — Article, ikke ItemList med prisrangering.
          Mindre rich-snippet-eksponering for ølrangering = mindre Helsedir-risiko. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Ølpriser ved VM-stedene i Oslo",
            description:
              "Nøytral oversikt over registrerte priser på 0,5 L pils ved venuer som viser Fotball-VM 2026.",
            datePublished: cheapest.beerPriceUpdated,
            dateModified: cheapest.beerPriceUpdated,
            author: { "@type": "Organization", name: "hvorserjegvm.no" },
            publisher: {
              "@type": "Organization",
              name: "hvorserjegvm.no",
              logo: { "@type": "ImageObject", url: "https://hvorserjegvm.no/icon.jpg" },
            },
            inLanguage: "nb-NO",
            isBasedOn: "https://www.pilsguiden.no/oslo",
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
