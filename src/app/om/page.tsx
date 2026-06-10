import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Om hvorserjegvm.no — hobbyprosjekt for VM 2026",
  description:
    "hvorserjegvm.no er et uavhengig hobbyprosjekt laget for å samle alle stedene i Oslo som viser Fotball-VM 2026. Ingen kommersielle interesser, ingen sporing.",
  alternates: { canonical: "https://hvorserjegvm.no/om" },
};

const LAST_UPDATED = "10. juni 2026";

export default function OmPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
      <Link
        href="/"
        className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100 mb-6"
      >
        <Icon.ChevronRight size={13} strokeWidth={2.4} style={{ transform: "rotate(180deg)" }} />
        Tilbake
      </Link>

      <header className="mb-8">
        <p className="eyebrow mb-3">Om siden · Oppdatert {LAST_UPDATED}</p>
        <h1 className="display display-lg text-slate-50">Om hvorserjegvm.no</h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300">
          hvorserjegvm.no er et uavhengig hobbyprosjekt laget av Emma Ofsti
          (20) på fritida. Ideen var enkel: jeg fant ingen samlet oversikt
          over hvor man kan se Fotball-VM 2026 i Oslo, så jeg lagde en selv.
        </p>
      </header>

      {/* Kjapp oppsummering */}
      <section
        className="lg-surface mb-8 p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <p className="eyebrow mb-3">Kort fortalt</p>
        <ul className="space-y-2.5 text-[15px] text-slate-200">
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Ikke-kommersielt.</strong> Vi tjener ingen penger på
              siden. Ingen reklame, ingen affiliate-lenker, ingen
              sponsorinnhold.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Uavhengig.</strong> Vi har ingen avtaler med venuene
              vi lister, FIFA, NFF eller noen turneringsarrangører.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Ingen sporing.</strong> Ingen cookies, ingen
              tredjeparts-analyse, ingen kontoer. Se{" "}
              <Link href="/personvern" className="underline underline-offset-2 hover:text-slate-50">
                personvernerklæringen
              </Link>{" "}
              for detaljer.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Åpen for korreksjoner.</strong> Er du en venue og vil
              endre eller fjerne info? Bruk{" "}
              <Link href="/endre" className="underline underline-offset-2 hover:text-slate-50">
                kontakt-skjemaet vårt
              </Link>
              .
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Hva siden ikke er
        </h2>
        <div className="space-y-3 text-[15px] text-slate-300 leading-relaxed">
          <p>
            Siden er <strong>ikke</strong> en offisiell guide fra FIFA, NFF
            eller noen kommersiell aktør. Vi har ingen rettigheter til
            VM-merkevarer eller offisielle logoer, og vi bruker dem ikke.
          </p>
          <p>
            Siden er <strong>ikke</strong> reklame for alkohol. Der vi nevner
            ølpriser, gjør vi det som ren forbrukerinformasjon — basert på
            offentlig tilgjengelige tall fra{" "}
            <a
              href="https://www.pilsguiden.no/oslo"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate-100"
            >
              pilsguiden.no
            </a>
            . Aldersgrensen for kjøp av alkohol er 18 år.
          </p>
          <p>
            Siden er <strong>ikke</strong> en garantist for at informasjonen
            stemmer. Priser, åpningstider og program kan endre seg. For
            viktige beslutninger anbefaler vi at du kontakter venuet direkte.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Om bildene på siden
        </h2>
        <div className="space-y-3 text-[15px] text-slate-300 leading-relaxed">
          <p>
            Noen av bildene på stedsidene er <strong>AI-genererte
            illustrasjoner</strong>, ikke ekte foto av venuet. Disse er
            merket med <span className="inline-flex items-center rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/95 align-middle">AI-illustrasjon</span> så det skal være tydelig.
          </p>
          <p>
            Andre bilder er hentet fra venuenes egne nettsider (deres
            offisielle Open Graph-bilde for deling), eller lisensiert
            stock-foto fra Unsplash. Vi bruker aldri offisielle FIFA-,
            VM- eller spillerlisens-bilder.
          </p>
          <p>
            Er du venue og vil ha vårt bilde fjernet eller byttet ut med ditt
            eget?{" "}
            <Link
              href="/endre"
              className="underline underline-offset-2 hover:text-slate-100"
            >
              Si fra her
            </Link>{" "}
            — vi gjør det innen 24 timer.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Hvordan dataene er hentet
        </h2>
        <div className="space-y-3 text-[15px] text-slate-300 leading-relaxed">
          <p>
            Alt innhold er hentet fra offentlige kilder per juni 2026.
            Hovedkildene er:
          </p>
          <ul className="space-y-2 ml-5 list-disc text-[14.5px] text-slate-300">
            <li>
              <strong>Venue-info</strong> — fra venuenes egne nettsider
            </li>
            <li>
              <strong>Kampprogram + TV-kanal</strong> — fra strim.no, NRK,
              TV 2 og sefotballvm2026.no
            </li>
            <li>
              <strong>Ølpriser</strong> — fra{" "}
              <a
                href="https://www.pilsguiden.no/oslo"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-slate-100"
              >
                pilsguiden.no
              </a>
            </li>
            <li>
              <strong>Kartdata</strong> — OpenStreetMap via CARTO
            </li>
          </ul>
          <p>
            Deler av tekstene er skrevet med hjelp av AI. Vi har gjennomgått
            det meste manuelt, men feil kan forekomme. Si fra hvis du finner
            noe galt.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">Hvem står bak?</h2>
        <div className="space-y-3 text-[15px] text-slate-300 leading-relaxed">
          <p>
            Siden er laget og vedlikeholdt av Emma Ofsti, 20 år, fra Oslo. Det er
            ingen organisasjon, intet selskap, ingen ansatte. Bare et
            hobbyprosjekt jeg ville prøve å lage før VM startet.
          </p>
          <p>
            Spørsmål, retting eller henvendelser:{" "}
            <a
              href="mailto:ewoldofsti@gmail.com"
              className="underline underline-offset-2 hover:text-slate-100 font-semibold"
            >
              ewoldofsti@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section
        className="lg-glass-accent p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <h2 className="display display-sm text-slate-50 mb-2">
          Funnet en feil?
        </h2>
        <p className="text-[15px] text-slate-200 leading-relaxed mb-4">
          Pris er feil, åpningstid har endret seg, eller du er venue og vil
          fjerne deg fra siden? Bruk kontakt-skjemaet — vi svarer som regel
          samme dag.
        </p>
        <Link
          href="/endre"
          className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.08] text-slate-100 hover:bg-white/[0.12]"
        >
          Endre eller fjerne info
          <Icon.ArrowRight size={12} strokeWidth={2.4} />
        </Link>
      </section>
    </div>
  );
}
