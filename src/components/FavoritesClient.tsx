"use client";

import { useMemo } from "react";
import type { Venue } from "@/lib/types";
import VenueCard from "./VenueCard";
import { vmScore } from "@/lib/score";
import { useFavorites } from "@/lib/useFavorites";
import { Icon } from "./icons";
import Link from "next/link";
import { Button } from "./ui";

export default function FavoritesClient({ venues }: { venues: Venue[] }) {
  const { favoriteIds } = useFavorites();

  const favoriteVenues = useMemo(() => {
    return venues
      .filter((v) => favoriteIds.includes(v.id))
      .sort((a, b) => vmScore(b).total - vmScore(a).total);
  }, [venues, favoriteIds]);

  const cheapestBeer = useMemo(() => {
    const prices = favoriteVenues.map((v) => v.beerPrice).filter((p): p is number => p !== null);
    return prices.length ? Math.min(...prices) : null;
  }, [favoriteVenues]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:py-8 pb-24 sm:pb-8">
      <header className="mb-6 sm:mb-8">
        <p className="eyebrow mb-2">Dine favoritter</p>
        <h1 className="display display-md sm:display-lg text-slate-50">
          <Icon.Heart size={32} strokeWidth={2.2} className="inline mr-2 text-red-500" fill="currentColor" />
          Favoritter
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-400">
          {favoriteIds.length > 0 ? (
            <>
              Du har <span className="tnum font-medium text-slate-200">{favoriteIds.length}</span> favoritter.
              Trykk på hjertet på et sted for å legge til eller fjerne.
            </>
          ) : (
            "Du har ikke lagt til noen favoritter ennå."
          )}
        </p>
      </header>

      {favoriteVenues.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteVenues.map((v) => (
            <VenueCard
              key={v.id}
              venue={v}
              userLocation={null}
              cheapestBeer={cheapestBeer}
            />
          ))}
        </section>
      ) : (
        <div
          className="lg-surface p-12 text-center"
          style={{ borderRadius: "var(--lg-r-xxl)" }}
        >
          <Icon.Heart size={48} strokeWidth={1.5} className="mx-auto mb-4 text-slate-500" />
          <p className="text-[17px] font-semibold text-slate-200 mb-2">Ingen favoritter ennå</p>
          <p className="text-[14px] text-slate-400 mb-6 max-w-md mx-auto">
            Utforsk stedene og trykk på hjertet for å lagre dine favoritter.
            De blir lagret lokalt på denne enheten.
          </p>
          <Link href="/">
            <Button>
              <Icon.Search size={16} strokeWidth={2.2} />
              Utforsk steder
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
