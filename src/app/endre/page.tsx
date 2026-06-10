import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

/* ──────────────────────────────────────────────────────────────────────────
 * /endre — Endre eller fjerne info
 *
 * Juridisk skjold for venuer som vil korrigere eller bli fjernet. Vi har
 * ingen samtykke fra dem til å vise dem på siden, så det er rett og rimelig
 * å gjøre det enkelt å bli fjernet.
 *
 * Strategi: mailto-lenker fremfor skjema. Holder oss unna serverside
 * data-håndtering (ingen GDPR-issues) og er enkelt å håndtere når Emma
 * sjekker inboksen.
 * ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Endre eller fjerne info — hvorserjegvm.no",
  description:
    "Er du en venue som vil oppdatere eller fjerne info fra hvorserjegvm.no? Vi svarer som regel samme dag. Gratis og uten betingelser.",
  alternates: { canonical: "https://hvorserjegvm.no/endre" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "ewoldofsti@gmail.com";

function mailtoSubject(reason: string): string {
  const subject = encodeURIComponent(`[hvorserjegvm.no] ${reason}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}`;
}

export default function EndrePage() {
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
        <p className="eyebrow mb-3">Kontakt og korreksjon</p>
        <h1 className="display display-lg text-slate-50">
          Endre eller fjerne info
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300">
          Er du venue og vil oppdatere eller fjerne info? Har du sett en feil
          i pris, åpningstid eller TV-kanal? Si fra — vi svarer som regel
          samme dag. Det er gratis og uten betingelser.
        </p>
      </header>

      {/* Henvendelses-kategorier — mailto-lenker som pre-fyller emnefeltet
          så Emma kan triage uten å åpne hver eneste mail. */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-5">
          Hva gjelder henvendelsen?
        </h2>
        <div className="space-y-3">
          <a
            href={mailtoSubject("Fjern stedet vårt fra siden")}
            className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
            style={{ borderRadius: "var(--lg-r-xl)" }}
          >
            <div className="flex items-start gap-3">
              <Icon.X size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-red-300" />
              <div>
                <h3 className="text-[15px] font-semibold text-slate-100 mb-1">
                  Fjern stedet vårt fra siden
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">
                  Er du venue og ønsker ikke å være listet? Vi fjerner deg
                  uten spørsmål. Inkluder navnet på stedet i mailen.
                </p>
              </div>
            </div>
          </a>

          <a
            href={mailtoSubject("Korriger info om stedet vårt")}
            className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
            style={{ borderRadius: "var(--lg-r-xl)" }}
          >
            <div className="flex items-start gap-3">
              <Icon.Info size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-sky-300" />
              <div>
                <h3 className="text-[15px] font-semibold text-slate-100 mb-1">
                  Korriger info om stedet vårt
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">
                  Feil pris, åpningstid, kapasitet, aldersgrense eller annen
                  info? Beskriv hva som er feil og hva som er riktig.
                </p>
              </div>
            </div>
          </a>

          <a
            href={mailtoSubject("Bytt eller fjern bilde")}
            className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
            style={{ borderRadius: "var(--lg-r-xl)" }}
          >
            <div className="flex items-start gap-3">
              <Icon.MapPin size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-amber-300" />
              <div>
                <h3 className="text-[15px] font-semibold text-slate-100 mb-1">
                  Bytt eller fjern bilde
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">
                  Vi har brukt et bilde du har rettigheter til, og du vil at
                  vi bruker et annet eller fjerner det? Bare si fra — du
                  trenger ikke begrunne det.
                </p>
              </div>
            </div>
          </a>

          <a
            href={mailtoSubject("Annet")}
            className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
            style={{ borderRadius: "var(--lg-r-xl)" }}
          >
            <div className="flex items-start gap-3">
              <Icon.ArrowRight size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <h3 className="text-[15px] font-semibold text-slate-100 mb-1">
                  Annet
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-relaxed">
                  Pressehenvendelser, samarbeid, juridiske spørsmål, eller
                  bare gode forslag — send mail.
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Garantier — kort, klar, juridisk solid */}
      <section className="mb-10">
        <h2 className="display display-sm text-slate-100 mb-3">
          Hva du kan forvente
        </h2>
        <ul className="space-y-2.5 text-[15px] text-slate-200">
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Svar samme dag.</strong> Som regel innen et par timer.
              Senest 24 timer.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Ingen spørsmål.</strong> Vil du fjernes? Du fjernes.
              Vi ber ikke om begrunnelse.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Endringer publiseres innen 24 timer</strong> etter at
              vi har bekreftet ny info.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon.Free
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <span>
              <strong>Vi sletter mailen din</strong> etter at saken er løst —
              med mindre du ber om at vi tar vare på den.
            </span>
          </li>
        </ul>
      </section>

      {/* Direkte mail-fallback for de som ikke vil bruke kategori-lenkene */}
      <section
        className="lg-glass-accent p-6 sm:p-7"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <h2 className="display display-sm text-slate-50 mb-2">
          Direkte kontakt
        </h2>
        <p className="text-[15px] text-slate-200 leading-relaxed mb-4">
          Foretrekker du å bare sende en vanlig mail? Det går helt fint.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold underline underline-offset-4 text-slate-50 hover:text-white"
        >
          {CONTACT_EMAIL}
        </a>
      </section>
    </div>
  );
}
