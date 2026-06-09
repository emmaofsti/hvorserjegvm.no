"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Venue, Match } from "@/lib/types";
import VenueCard from "./VenueCard";
import { vmScore } from "@/lib/score";
import { useFavorites } from "@/lib/useFavorites";
import { useFavoriteMatches } from "@/lib/useFavoriteMatches";
import { Icon } from "./icons";
import { Button, Card, CardBody, Badge } from "./ui";
import { formatKickoff } from "@/lib/utils";

export default function FavoritesClient({
  venues,
  matches,
}: {
  venues: Venue[];
  matches: Match[];
}) {
  const { favoriteIds: venueIds } = useFavorites();
  const { favoriteSlugs: matchSlugs } = useFavoriteMatches();

  const favoriteVenues = useMemo(() => {
    return venues
      .filter((v) => venueIds.includes(v.id))
      .sort((a, b) => vmScore(b).total - vmScore(a).total);
  }, [venues, venueIds]);

  const favoriteMatches = useMemo(() => {
    return matches
      .filter((m) => matchSlugs.includes(m.slug))
      .sort((a, b) => {
        const da = new Date(`${a.date}T${a.kickoff}:00+02:00`).getTime();
        const db = new Date(`${b.date}T${b.kickoff}:00+02:00`).getTime();
        return da - db;
      });
  }, [matches, matchSlugs]);

  const cheapestBeer = useMemo(() => {
    const prices = favoriteVenues
      .map((v) => v.beerPrice)
      .filter((p): p is number => p !== null);
    return prices.length ? Math.min(...prices) : null;
  }, [favoriteVenues]);

  const totalCount = favoriteVenues.length + favoriteMatches.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:py-8 pb-24 sm:pb-8">
      <header className="mb-6 sm:mb-8">
        <p className="eyebrow mb-2">Dine favoritter</p>
        <h1 className="display display-md sm:display-lg text-slate-50">
          <Icon.Heart
            size={32}
            strokeWidth={2.2}
            className="inline mr-2 text-red-500"
            fill="currentColor"
          />
          Favoritter
        </h1>
        {totalCount > 0 ? (
          <p className="mt-3 max-w-xl text-[15px] text-slate-400">
            <span className="tnum font-medium text-slate-200">{favoriteVenues.length}</span> steder
            {" og "}
            <span className="tnum font-medium text-slate-200">{favoriteMatches.length}</span> kamper lagret.
            Lagres lokalt på denne enheten.
          </p>
        ) : (
          <p className="mt-3 max-w-xl text-[15px] text-slate-400">
            Trykk på hjertet på et sted eller en kamp for å legge til.
          </p>
        )}
      </header>

      {/* Favoritt-kamper */}
      {favoriteMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="eyebrow mb-3">Kamper</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteMatches.map((m) => (
              <Link key={m.slug} href={`/kamp/${m.slug}`} className="block group">
                <Card>
                  <CardBody className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="tnum text-[13px] font-medium text-slate-400">
                        {formatKickoff(m.date, m.kickoff)}
                      </span>
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {m.norwayMatch && <Badge tone="red">🇳🇴 Norge</Badge>}
                        <Badge tone="zinc">{m.stage}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                      <span className="truncate">{m.home}</span>
                      <span className="shrink-0 eyebrow !mb-0">vs</span>
                      <span className="truncate text-right">{m.away}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[12px] text-slate-500">
                      <span>{m.group ? `Gruppe ${m.group}` : ""}</span>
                      {m.tvChannel && (
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                          <Icon.Tv size={12} strokeWidth={2} />
                          <span>{m.tvChannel}</span>
                        </span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Favoritt-steder */}
      {favoriteVenues.length > 0 && (
        <section>
          <h2 className="eyebrow mb-3">Steder</h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteVenues.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                userLocation={null}
                cheapestBeer={cheapestBeer}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div
          className="lg-surface p-12 text-center"
          style={{ borderRadius: "var(--lg-r-xxl)" }}
        >
          <Icon.Heart
            size={48}
            strokeWidth={1.5}
            className="mx-auto mb-4 text-slate-500"
          />
          <p className="text-[17px] font-semibold text-slate-200 mb-2">
            Ingen favoritter ennå
          </p>
          <p className="text-[14px] text-slate-400 mb-6 max-w-md mx-auto">
            Trykk på hjertet på et sted eller en kamp for å lagre.
            De blir lagret lokalt på denne enheten.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/">
              <Button>
                <Icon.Search size={16} strokeWidth={2.2} />
                Utforsk steder
              </Button>
            </Link>
            <Link href="/kamper">
              <Button variant="outline">
                <Icon.Trophy size={16} strokeWidth={2.2} />
                Se kamper
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
