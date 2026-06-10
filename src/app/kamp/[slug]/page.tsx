import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMatch, getMatches, getVenues } from "@/lib/data";
import type { Match } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import MatchVenuesClient from "@/components/MatchVenuesClient";
import MatchFavoriteButton from "@/components/MatchFavoriteButton";
import { Icon } from "@/components/icons";
import { Stat } from "@/components/ui";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getMatches().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getMatch(slug);
  if (!match) return { title: "Kamp ikke funnet" };
  /* SEO-tuned title: leads with the primary search phrase
     ("Hvor ser jeg [Lag1] - [Lag2] i Oslo") which matches how people
     actually google. Norge-kamper få et 🇳🇴 i title for click-through. */
  const flagPrefix = match.norwayMatch ? "🇳🇴 " : "";
  const title = `${flagPrefix}Hvor ser jeg ${match.home} – ${match.away} i Oslo?`;
  const description = `Hvor kan du se ${match.home} mot ${match.away} (${match.stage}, ${formatDate(match.date)}, kl. ${match.kickoff} norsk tid) på storskjerm i Oslo? Komplett oversikt over fan zones, sportsbarer og puber${match.tvChannel ? ` — sendes på ${match.tvChannel}` : ""}.`;
  return {
    title,
    description,
    alternates: { canonical: `https://hvorserjegvm.no/kamp/${match.slug}` },
    openGraph: { title, description, type: "article", url: `https://hvorserjegvm.no/kamp/${match.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const match = getMatch(slug);
  if (!match) notFound();

  const venues = getVenues();
  const isKnockout = match.stage !== "Gruppespill";

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <nav className="mb-5 flex items-center justify-between gap-3 text-sm">
        <Link
          href="/kamper"
          className="lg-capsule lg-energize inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100"
        >
          <Icon.ChevronRight size={13} strokeWidth={2.4} style={{ transform: "rotate(180deg)" }} />
          Alle kamper
        </Link>
        <MatchFavoriteButton slug={match.slug} />
      </nav>

      {/* Match header — editorial moment */}
      <header
        className="lg-surface mb-6 sm:mb-8 p-6 sm:p-9"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="lg-capsule eyebrow !mb-0 inline-flex bg-white/[0.05] border border-white/[0.08] px-2.5 py-1">
            {match.stage}
          </span>
          {match.group && (
            <span className="eyebrow !mb-0 ml-1">Gruppe {match.group}</span>
          )}
          {match.norwayMatch && (
            <span className="lg-capsule inline-flex items-center gap-1.5 bg-red-500/15 border border-red-400/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-red-200">
              🇳🇴 Norge spiller
            </span>
          )}
          {match.isOpener && (
            <span className="lg-capsule inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-300/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-200">
              <Icon.Sparkles size={12} strokeWidth={2.2} /> Åpningskampen
            </span>
          )}
        </div>
        <h1 className="display display-lg text-slate-50">
          {match.home} <span className="text-slate-500">vs</span> {match.away}
        </h1>
        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <Stat
            label={<span className="inline-flex items-center gap-1.5"><Icon.Calendar size={12} strokeWidth={2.2} /> Dato</span>}
            value={formatDate(match.date)}
          />
          <Stat
            label={<span className="inline-flex items-center gap-1.5"><Icon.CalendarDays size={12} strokeWidth={2.2} /> Avspark</span>}
            value={<span className="tnum">kl. {match.kickoff}</span>}
            sub="Norsk tid"
          />
          <Stat
            label={<span className="inline-flex items-center gap-1.5"><Icon.Building size={12} strokeWidth={2.2} /> Stadion</span>}
            value={match.stadium ?? "TBD"}
            sub={match.city ?? undefined}
          />
          {match.tvChannel && (
            <Stat
              label={<span className="inline-flex items-center gap-1.5"><Icon.Tv size={12} strokeWidth={2.2} /> TV</span>}
              value={match.tvChannel}
              sub={match.tvChannel.includes("/") ? "Begge gratis" : "Gratis"}
            />
          )}
        </div>
      </header>

      <section className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="display display-sm text-slate-100">Her kan du se kampen i Oslo</h2>
        {isKnockout && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
            <Icon.Alert size={12} strokeWidth={2} /> Lag bekreftes etter gruppespillet
          </span>
        )}
      </section>

      <MatchVenuesClient match={match} venues={venues} />

      {/* FAQ — visible accordion. Rich-snippet eligible via FAQPage schema.
          Questions match how people actually google before a kickoff. */}
      <section className="mt-12 mb-10">
        <h2 className="display display-sm text-slate-100 mb-5">Vanlige spørsmål</h2>
        <div className="space-y-3 max-w-3xl">
          {buildFaqs(match).map((f, i) => (
            <details
              key={i}
              className="lg-surface group p-5"
              style={{ borderRadius: "var(--lg-r-l)" }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium text-slate-100">
                {f.q}
                <Icon.ChevronDown
                  size={16}
                  strokeWidth={2.2}
                  className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 text-[14.5px] text-slate-300 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related guides — internal-link graph hook. Pumps PageRank to the
          guide pages and gives users a path to broader content. */}
      <section className="mb-8 max-w-3xl">
        <h2 className="eyebrow mb-3">Relaterte guider</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/guide/hvor-se-vm-i-oslo"
            className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:bg-white/[0.09]"
          >
            Komplett VM-guide for Oslo
          </Link>
          {match.norwayMatch && (
            <Link
              href="/guide/norge-pa-storskjerm-oslo"
              className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:bg-white/[0.09]"
            >
              Norges kamper på storskjerm
            </Link>
          )}
          <Link
            href="/guide/gratis-vm-oslo"
            className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:bg-white/[0.09]"
          >
            Gratis VM i Oslo
          </Link>
          <Link
            href="/guide/billig-ol-vm-oslo"
            className="lg-capsule inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:bg-white/[0.09]"
          >
            Ølpriser i Oslo
          </Link>
        </div>
      </section>

      {/* JSON-LD: SportsEvent + FAQPage + BreadcrumbList.
          All three give Google distinct rich-result eligibility. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: `${match.home} vs ${match.away}`,
            startDate: `${match.date}T${match.kickoff}:00+02:00`,
            sport: "Football",
            eventStatus: "https://schema.org/EventScheduled",
            superEvent: { "@type": "SportsEvent", name: "FIFA Fotball-VM 2026" },
            location: match.stadium
              ? { "@type": "Place", name: match.stadium, address: match.city }
              : undefined,
            competitor: [
              { "@type": "SportsTeam", name: match.home },
              { "@type": "SportsTeam", name: match.away },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: buildFaqs(match).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Hjem", item: "https://hvorserjegvm.no" },
              { "@type": "ListItem", position: 2, name: "Kamper", item: "https://hvorserjegvm.no/kamper" },
              {
                "@type": "ListItem",
                position: 3,
                name: `${match.home} – ${match.away}`,
                item: `https://hvorserjegvm.no/kamp/${match.slug}`,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Per-match FAQ generator.
 *
 * The questions are deliberately phrased the way people google: "hvor ser jeg
 * X mot Y", "hvilken kanal sender X-Y", "når starter X mot Y". Each one is
 * a real long-tail keyword.
 * ──────────────────────────────────────────────────────────── */
function buildFaqs(match: Match): { q: string; a: string }[] {
  const m = match;
  const dateText = formatDate(m.date);
  const teams = `${m.home} – ${m.away}`;
  const teamsVs = `${m.home} mot ${m.away}`;
  const stageLabel = m.stage === "Gruppespill" ? `gruppespillet${m.group ? " (Gruppe " + m.group + ")" : ""}` : m.stage.toLowerCase();
  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `Hvor kan jeg se ${teamsVs} i Oslo?`,
    a: `${teams} (${stageLabel}, ${dateText} kl. ${m.kickoff} norsk tid) vises på storskjerm i alle de store fan zonene i Oslo — Spikersuppa, Lekter'n, Fotball i Parken og Jordal Amfi — samt et stort antall sportsbarer og puber. Se hele lista lenger opp på siden.`,
  });

  if (m.tvChannel) {
    faqs.push({
      q: `Hvilken kanal sender ${teamsVs}?`,
      a: `${teams} sendes på ${m.tvChannel} i Norge. ${m.tvChannel.includes("/") ? "Begge kanaler er gratis på lineær TV." : "Kanalen er gratis på lineær TV."} Kampen kan også streames via ${m.tvChannel.includes("NRK") ? "NRK TV-appen" : "TV 2 Play"}.`,
    });
  }

  faqs.push({
    q: `Når starter ${teamsVs}?`,
    a: `${teams} starter ${dateText} kl. ${m.kickoff} norsk tid${m.stadium ? `. Kampen spilles på ${m.stadium}${m.city ? " i " + m.city : ""}.` : "."}`,
  });

  if (m.norwayMatch) {
    faqs.push({
      q: "Hvor er den beste stemningen for Norges kamper i Oslo?",
      a: "Spikersuppa midt i sentrum og Fotball i Parken har den største stemningen for Norges kamper. Begge er store fan zones med tusenvis av fans. For en mer intim opplevelse kan du prøve puber som Lannisters, Old Irish eller Beer Palace.",
    });
  }

  if (m.stage !== "Gruppespill") {
    faqs.push({
      q: `Krever ${teamsVs} reservasjon?`,
      a: "Knockout-kamper trekker store mengder folk. På sportsbarer og puber bør du reservere bord. På de gratis fan zonene (Spikersuppa, Lekter'n) er det først til mølla — møt opp i god tid.",
    });
  }

  return faqs;
}
