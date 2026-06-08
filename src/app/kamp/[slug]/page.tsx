import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMatch, getMatches, getVenues } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import MatchVenuesClient from "@/components/MatchVenuesClient";

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
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 text-sm">
        <Link href="/kamper" className="text-slate-400 hover:text-slate-200">
          ← Alle kamper
        </Link>
      </nav>

      <header className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
          <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-0.5">{match.stage}</span>
          {match.group && <span>Gruppe {match.group}</span>}
          {match.norwayMatch && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-red-300 ring-1 ring-inset ring-red-500/30">
              🇳🇴 Norge spiller
            </span>
          )}
          {match.isOpener && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300 ring-1 ring-inset ring-amber-500/30">
              Åpningskampen
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          {match.home} <span className="text-slate-500">vs</span> {match.away}
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div>
            <div className="text-slate-500">Dato</div>
            <div className="font-medium text-slate-200">{formatDate(match.date)}</div>
          </div>
          <div>
            <div className="text-slate-500">Avspark (norsk tid)</div>
            <div className="font-medium text-slate-200">kl. {match.kickoff}</div>
          </div>
          <div>
            <div className="text-slate-500">Stadion</div>
            <div className="font-medium text-slate-200">
              {match.stadium ? `${match.stadium}, ${match.city}` : "TBD"}
            </div>
          </div>
          {match.tvNorway && (
            <div>
              <div className="text-slate-500">TV-sending</div>
              <div className="font-medium text-slate-200">{match.tvNorway}</div>
            </div>
          )}
        </div>
      </header>

      <section className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">Her kan du se kampen i Oslo</h2>
        {isKnockout && (
          <span className="text-xs text-slate-500">
            Lag bekreftes etter gruppespillet
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
