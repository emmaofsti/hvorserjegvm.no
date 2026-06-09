import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getVenues } from "@/lib/data";
import { getVenueImageUrl } from "@/lib/venueImages";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Billigst øl i Oslo under VM 2026 — komplett pris-rangering",
  description:
    "Topp 10 puber med billigst pils (0,5 L) under VM 2026 i Oslo. Fra 49 kr til 151 kr — over tre ganger forskjell. Oppdatert priskartlegging fra pilsguiden.no.",
  alternates: { canonical: "https://hvorserjegvm.no/billigst-ol" },
  openGraph: {
    title: "Billigst øl under VM 2026 i Oslo — fra 49 kroner",
    description:
      "Vi har samlet ølprisene på alle puber som viser VM 2026. Spar opptil 102 kr per pils.",
    url: "https://hvorserjegvm.no/billigst-ol",
    type: "article",
  },
};

export default function BilligstOlPage() {
  const venues = getVenues();
  const withPrice = venues
    .filter((v) => v.beerPrice !== null)
    .sort((a, b) => (a.beerPrice ?? 0) - (b.beerPrice ?? 0));

  const top10 = withPrice.slice(0, 10);
  const dyreste = withPrice.slice(-5).reverse();
  const cheapest = withPrice[0];
  const mostExpensive = withPrice[withPrice.length - 1];
  const prices = withPrice.map((v) => v.beerPrice!).filter(Boolean);
  const median = prices[Math.floor(prices.length / 2)];
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const diff = (mostExpensive.beerPrice ?? 0) - (cheapest.beerPrice ?? 0);
  const ratio = ((mostExpensive.beerPrice ?? 0) / (cheapest.beerPrice ?? 1)).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
      {/* Eyebrow */}
      <Link
        href="/"
        className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100 mb-6"
      >
        <Icon.ChevronRight size={13} strokeWidth={2.4} style={{ transform: "rotate(180deg)" }} />
        Tilbake til alle steder
      </Link>

      {/* Hero */}
      <header className="mb-8">
        <p className="eyebrow mb-3">🍺 Priskartlegging · oppdatert {cheapest.beerPriceUpdated}</p>
        <h1 className="display display-lg text-slate-50">
          Billigst øl i Oslo<br />under VM 2026
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300 max-w-2xl">
          Vi har samlet ølprisene på alle puber som viser VM 2026 i Oslo.
          Prisen varierer fra <span className="num-display text-slate-50">{cheapest.beerPrice} kr</span> til{" "}
          <span className="num-display text-slate-50">{mostExpensive.beerPrice} kr</span> for samme pils.
        </p>
      </header>

      {/* Drama stat */}
      <section className="lg-surface mb-8 p-6 sm:p-8" style={{ borderRadius: "var(--lg-r-xxl)" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
          <div>
            <p className="eyebrow mb-2">Billigst</p>
            <p className="num-display text-3xl sm:text-4xl text-emerald-300">{cheapest.beerPrice}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">kroner</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Dyrest</p>
            <p className="num-display text-3xl sm:text-4xl text-red-300">{mostExpensive.beerPrice}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">kroner</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Differanse</p>
            <p className="num-display text-3xl sm:text-4xl text-amber-300">+{diff}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">kr · {ratio}× mer</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Median</p>
            <p className="num-display text-3xl sm:text-4xl text-slate-100">{median}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">kr · {avg} kr gj.snitt</p>
          </div>
        </div>
      </section>

      {/* Topp 10 */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-2">Topp 10 billigste</h2>
        <p className="text-[14px] text-slate-400 mb-5">
          Rangert etter pris på 0,5 L pils. Alle viser VM 2026 på storskjerm.
        </p>

        <div className="space-y-3">
          {top10.map((v, i) => {
            const isWinner = i === 0;
            return (
              <Link
                key={v.id}
                href={`/sted/${v.id}`}
                className="lg-surface block p-4 sm:p-5 group transition-transform"
                style={{ borderRadius: "var(--lg-r-xl)" }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`shrink-0 num-display flex items-center justify-center rounded-full ${
                      isWinner
                        ? "bg-amber-400/20 text-amber-200 ring-2 ring-amber-300/40"
                        : "bg-white/[0.05] text-slate-300 ring-1 ring-white/[0.10]"
                    }`}
                    style={{ width: 44, height: 44, fontSize: 16 }}
                  >
                    {isWinner ? "🥇" : i + 1}
                  </div>

                  {/* Image (mobile hidden for compactness) */}
                  <div
                    className="hidden sm:block shrink-0 overflow-hidden bg-white/5"
                    style={{ width: 72, height: 56, borderRadius: "var(--lg-r-m)" }}
                  >
                    <Image
                      src={getVenueImageUrl(v.id, v.category)}
                      alt={v.name}
                      width={72}
                      height={56}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-slate-100 truncate">
                      {v.name}
                    </h3>
                    <p className="text-[12.5px] text-slate-400 truncate">
                      {v.neighborhood ?? "Oslo"} · {v.address ?? ""}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className={`num-display text-2xl sm:text-3xl ${isWinner ? "text-emerald-300" : "text-slate-100"}`}>
                      {v.beerPrice}
                    </p>
                    <p className="text-[11px] text-slate-500">kr · 0,5 L</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dyreste — kontrast */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-2">De fem dyreste</h2>
        <p className="text-[14px] text-slate-400 mb-5">
          For sammenligning — samme pils, opptil <span className="tnum">{ratio}×</span> dyrere.
        </p>
        <div className="space-y-2">
          {dyreste.map((v) => (
            <Link
              key={v.id}
              href={`/sted/${v.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 lg-surface"
              style={{ borderRadius: "var(--lg-r-m)" }}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-slate-200 truncate">{v.name}</p>
                <p className="text-[11.5px] text-slate-500">{v.neighborhood ?? "Oslo"}</p>
              </div>
              <span className="num-display text-[18px] text-red-300 shrink-0">{v.beerPrice} kr</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA + method */}
      <section className="lg-glass-accent p-6 sm:p-7 mb-8" style={{ borderRadius: "var(--lg-r-xxl)" }}>
        <h2 className="display display-sm text-slate-50 mb-2">Vil du finne stedet med billigst øl <em>der du står</em>?</h2>
        <p className="text-[14px] text-slate-200 mb-4">
          Vi har kart med 43 VM-steder i Oslo, sortert på pris, avstand og stemning.
        </p>
        <Link href="/">
          <Button>
            <Icon.MapPin size={14} strokeWidth={2.4} /> Åpne kartet
          </Button>
        </Link>
      </section>

      {/* Method */}
      <section className="border-t border-white/[0.06] pt-6 text-[12.5px] text-slate-500 leading-relaxed">
        <p className="eyebrow mb-2 text-slate-400">Metode</p>
        <p>
          Priser er innhentet fra{" "}
          <a className="underline hover:text-slate-300" href="https://www.pilsguiden.no/oslo" target="_blank" rel="noreferrer">
            pilsguiden.no
          </a>
          {" "}per {cheapest.beerPriceUpdated}. Pris gjelder vanlig 0,5 L pils — ikke happy hour eller event-priser.{" "}
          {withPrice.length} av {venues.length} VM-steder har registrert pris;
          de resterende er som regel fan zones med event-prising (Lekter'n, Fotball i Parken, m.fl.).
          Vi tar forbehold om prisendringer under turneringen.
        </p>
      </section>

      {/* SEO/structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Billigst øl i Oslo under VM 2026",
            datePublished: cheapest.beerPriceUpdated,
            author: { "@type": "Organization", name: "hvorserjegvm.no" },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: top10.map((v, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: v.name,
                url: `https://hvorserjegvm.no/sted/${v.id}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
