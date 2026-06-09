import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Personvernerklæring for hvorserjegvm.no — hvilke data vi bruker, hva som lagres lokalt, og hva vi ikke gjør.",
  alternates: { canonical: "https://hvorserjegvm.no/personvern" },
};

const LAST_UPDATED = "9. juni 2026";

export default function PersonvernPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
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

      <header className="mb-8">
        <p className="eyebrow mb-3">Oppdatert {LAST_UPDATED}</p>
        <h1 className="display display-lg text-slate-50">Personvern</h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300">
          hvorserjegvm.no er en uavhengig oversikt over steder i Oslo som viser
          Fotball-VM 2026. Vi har designet siden med personvern som
          standardvalg.
        </p>
      </header>

      {/* Kort oppsummering */}
      <section
        className="lg-surface mb-8 p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <p className="eyebrow mb-3">Kort fortalt</p>
        <ul className="space-y-2.5 text-[15px] text-slate-200">
          <li className="flex items-start gap-2.5">
            <Icon.Free size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-emerald-300" />
            <span>
              <strong>Ingen sporing.</strong> Vi bruker ikke Google Analytics,
              Facebook Pixel eller noen tredjeparts sporingsverktøy.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-emerald-300" />
            <span>
              <strong>Ingen cookies.</strong> Vi setter ingen cookies, hverken
              våre egne eller fra tredjepart.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-emerald-300" />
            <span>
              <strong>Ingen kontoer eller pålogging.</strong> Du trenger ikke
              registrere deg for å bruke siden.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-emerald-300" />
            <span>
              <strong>Alt blir på enheten din.</strong> Favoritter, tema-valg
              og posisjon forlater aldri nettleseren din.
            </span>
          </li>
        </ul>
      </section>

      {/* Hva vi lagrer lokalt */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Hva vi lagrer i nettleseren din
        </h2>
        <p className="text-[15px] text-slate-300 mb-5 leading-relaxed">
          Vi bruker <strong>localStorage</strong> — en standardmekanisme i alle
          moderne nettlesere — for å huske valgene dine mellom besøk. Dette
          sendes <em>aldri</em> til oss eller noen tredjepart.
        </p>
        <div className="space-y-3">
          {[
            {
              key: "hvorserjegvm_favorites",
              what: "Hvilke steder du har lagret som favoritter",
            },
            {
              key: "hvorserjegvm_favorite_matches",
              what: "Hvilke kamper du har lagret som favoritter",
            },
            {
              key: "theme",
              what: "Om du foretrekker mørk eller lys modus",
            },
          ].map((row) => (
            <div
              key={row.key}
              className="lg-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
              style={{ borderRadius: "var(--lg-r-l)" }}
            >
              <code className="text-[12.5px] text-slate-400 font-mono shrink-0 sm:min-w-[240px]">
                {row.key}
              </code>
              <span className="text-[14px] text-slate-200">{row.what}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-slate-400 leading-relaxed">
          Du kan når som helst slette dette ved å tømme nettleserens lagrede
          data for hvorserjegvm.no.
        </p>
      </section>

      {/* Geolokasjon */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Posisjonen din
        </h2>
        <div
          className="lg-surface p-6"
          style={{ borderRadius: "var(--lg-r-xl)" }}
        >
          <div className="flex items-start gap-3">
            <Icon.MapPin
              size={20}
              strokeWidth={2}
              className="mt-1 shrink-0 text-sky-300"
            />
            <div className="space-y-2 text-[15px] text-slate-200 leading-relaxed">
              <p>
                Hvis du gir tillatelse, leser vi GPS-posisjonen din for å vise
                hvor langt unna hvert sted er.
              </p>
              <p>
                <strong>Posisjonen forlater aldri enheten din.</strong> All
                avstandsberegning skjer i nettleseren — vi har ingen server
                som mottar koordinater.
              </p>
              <p className="text-[13px] text-slate-400">
                Du kan trekke tilbake tillatelsen når som helst i
                nettleserinnstillingene dine, uten at funksjonaliteten blir
                vesentlig dårligere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datakilder */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Hvor kommer dataene fra?
        </h2>
        <p className="text-[15px] text-slate-300 mb-5 leading-relaxed">
          Alt innhold på siden er hentet fra offentlige kilder og krediteres
          per stedsside og rangering:
        </p>
        <ul className="space-y-3 text-[14.5px]">
          {[
            {
              what: "Steder + driftsdetaljer",
              source: "sefotballvm2026.no, sevm26.no og hver venues egen nettside",
            },
            {
              what: "Ølpriser",
              source: "pilsguiden.no (0,5 L pils, vanlig pris)",
              url: "https://www.pilsguiden.no/oslo",
            },
            {
              what: "Kampprogram + TV-kanal",
              source: "strim.no, oddspodden.com, fotball.no og sefotballvm2026.no/pa-tv",
            },
            {
              what: "Kartdata",
              source: "OpenStreetMap (via CARTO sin mørke tile-server)",
              url: "https://www.openstreetmap.org/copyright",
            },
          ].map((s) => (
            <li
              key={s.what}
              className="lg-surface p-4 flex flex-col sm:flex-row gap-1.5 sm:gap-4"
              style={{ borderRadius: "var(--lg-r-l)" }}
            >
              <span className="text-slate-200 font-medium shrink-0 sm:min-w-[200px]">
                {s.what}
              </span>
              <span className="text-slate-400">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-200 underline-offset-4 hover:underline"
                  >
                    {s.source}
                  </a>
                ) : (
                  s.source
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ingen tredjeparter — utbroderingen */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Tredjeparts-tjenester
        </h2>
        <p className="text-[15px] text-slate-300 mb-4 leading-relaxed">
          Siden lastes fra følgende eksterne kilder — kun for tekniske formål
          (hosting, kart, bilder):
        </p>
        <ul className="space-y-2 text-[14px] text-slate-300 leading-relaxed">
          <li>
            <strong>Vercel</strong> — host, kjører siden vår. Logger
            standard server-tekniske data (IP, user-agent, sti) i 30 dager for
            sikkerhet og feilfinning.
          </li>
          <li>
            <strong>CARTO</strong> — leverer mørke kartfliser. Mottar
            standard kartforespørsler (zoom-nivå, område) når kartet vises.
          </li>
          <li>
            <strong>OpenStreetMap-bidragsytere</strong> — kartgrunnlaget.
          </li>
          <li>
            <strong>Bilde-CDN-er</strong> — noen venuebilder lastes fra
            stedenes egne nettsider (Squarespace, Webflow, WordPress osv.) der
            de er publisert som åpne hero-bilder.
          </li>
        </ul>
      </section>

      {/* Datakvalitet & ansvarsfraskrivelse */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Datakvalitet og ansvar
        </h2>
        <div className="space-y-3 text-[14.5px] text-slate-300 leading-relaxed">
          <p>
            Vi har samlet dataene per juni 2026. Priser, åpningstider og
            kamp-program kan endre seg gjennom turneringen. Ølpriser er
            opprinnelig fra pilsguiden.no og kan avvike fra eventuelle
            VM-spesifikke priser hos hvert enkelt sted.
          </p>
          <p>
            Vi gir ingen garantier for tilgjengelighet eller fullstendighet.
            For viktige beslutninger (bordbestilling, billetter, åpningstider)
            anbefaler vi at du kontakter stedet direkte eller sjekker deres
            egen nettside.
          </p>
          <p>
            Deler av innholdet er generert med hjelp av AI. Feil kan
            forekomme — det er du som har ansvaret for å verifisere kritiske
            opplysninger.
          </p>
        </div>
      </section>

      {/* Dine rettigheter */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Dine rettigheter
        </h2>
        <p className="text-[15px] text-slate-300 leading-relaxed">
          Siden vi ikke lagrer personopplysninger om deg på vår side, har vi
          heller ingen data om deg å gi innsyn i, slette eller rette. Du har
          full kontroll over dine egne lagrede valg via nettleseren.
        </p>
      </section>

      {/* Kontakt */}
      <section
        className="lg-glass-accent p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <h2 className="display display-sm text-slate-50 mb-2">Kontakt</h2>
        <p className="text-[15px] text-slate-200 leading-relaxed">
          Spørsmål om personvern eller datakvalitet? Send en e-post til{" "}
          <a
            href="mailto:ewoldofsti@gmail.com"
            className="font-semibold underline"
          >
            ewoldofsti@gmail.com
          </a>{" "}
          så svarer vi så snart vi kan.
        </p>
      </section>

      <p className="mt-10 text-[12px] text-slate-500 text-center">
        Denne personvernerklæringen kan oppdateres. Forrige oppdatering:{" "}
        {LAST_UPDATED}.
      </p>
    </div>
  );
}
