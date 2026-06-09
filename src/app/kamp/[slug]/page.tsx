import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMatch, getMatches, getVenues } from "@/lib/data";
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
  const title = `${match.home} – ${match.away} i Oslo`;
  const description = `Hvor kan du se ${match.home} mot ${match.away} (${match.stage}, ${formatDate(match.date)}, kl. ${match.kickoff} norsk tid) på storskjerm i Oslo?`;
  return {
    title,
    description,
    alternates: { canonical: `https://hvorserjegvm.no/kamp/${match.slug}` },
    openGraph: { title, description, type: "article" },
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
          }),
        }}
      />
    </div>
  );
}
