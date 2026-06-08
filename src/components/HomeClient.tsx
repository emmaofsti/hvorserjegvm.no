"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Venue, FilterState } from "@/lib/types";
import VenueCard from "./VenueCard";
import Filters from "./Filters";
import { haversineKm, walkingMinutes } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { Button, Input } from "./ui";

const VenuesMap = dynamic(() => import("./Map"), { ssr: false });

const DEFAULT_FILTERS: FilterState = {
  freeOnly: false,
  alcohol: false,
  familyFriendly: false,
  outdoor: false,
  indoor: false,
  allMatches: false,
  norwayOnly: false,
  ticketed: false,
  maxMinutesAway: null,
  maxBeerPrice: null,
  category: "all",
  age: "all",
};

export default function HomeClient({ venues }: { venues: Venue[] }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Posisjon støttes ikke av nettleseren.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocError("Kunne ikke hente posisjon. Du kan fortsatt bruke siden."),
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      requestLocation();
    }
  }, []);

  const cheapestBeer = useMemo(() => {
    const prices = venues.map((v) => v.beerPrice).filter((p): p is number => p !== null);
    return prices.length ? Math.min(...prices) : null;
  }, [venues]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return venues
      .filter((v) => {
        if (q) {
          const hay = [v.name, v.neighborhood ?? "", v.address ?? "", v.description].join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filters.category !== "all" && v.category !== filters.category) return false;
        if (filters.freeOnly && v.ticketRequired) return false;
        if (filters.ticketed && !v.ticketRequired) return false;
        if (filters.alcohol && v.alcohol !== true) return false;
        if (filters.familyFriendly && !v.familyFriendly) return false;
        if (filters.outdoor && !v.outdoorViewing) return false;
        if (filters.indoor && !v.indoorViewing) return false;
        if (filters.allMatches && v.showsAllMatches !== true) return false;
        if (filters.norwayOnly && !v.showsNorwayMatches) return false;

        if (filters.age === "no_limit") {
          const open = v.ageLimit === null || v.ageLimit === 0 || v.familyFriendly === true;
          if (!open) return false;
        } else if (filters.age === "max_18") {
          if (v.ageLimit !== null && v.ageLimit > 18) return false;
        } else if (filters.age === "max_20") {
          if (v.ageLimit !== null && v.ageLimit > 20) return false;
        }

        if (filters.maxMinutesAway && userLocation && v.lat && v.lng) {
          const km = haversineKm({ lat: v.lat, lng: v.lng }, userLocation);
          if (walkingMinutes(km) > filters.maxMinutesAway) return false;
        }

        if (filters.maxBeerPrice !== null) {
          if (v.beerPrice === null || v.beerPrice > filters.maxBeerPrice) return false;
        }
        return true;
      })
      .sort((a, b) => vmScore(b).total - vmScore(a).total);
  }, [venues, filters, userLocation, search]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      {/* Hero */}
      <section className="mb-4 sm:mb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Hvor kan du se Fotball-VM 2026 i Oslo?
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          {venues.length} steder kartlagt — filtrer på pris, tak/vær, alder og avstand.
        </p>
      </section>

      {/* Map with mobile toggle */}
      <section className="mb-4">
        <button
          type="button"
          onClick={() => setShowMap((s) => !s)}
          className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200 sm:hidden"
        >
          <span>{showMap ? "▾" : "▸"}</span>
          {showMap ? "Skjul kart" : "Vis kart"}
        </button>
        <div
          className={`overflow-hidden rounded-xl border border-[var(--border)] transition-all duration-300 ${
            showMap ? "h-[35vh] sm:h-[55vh] min-h-[250px] sm:min-h-[420px]" : "h-0 border-0"
          }`}
        >
          <VenuesMap venues={filtered} userLocation={userLocation} highlightId={highlightId} />
        </div>
      </section>

      {/* Legend + position — compact on mobile */}
      <section className="mb-3 sm:mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-300">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-400" /> Gratis</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Billett</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Familievennlig</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Storarrangement</span>
          <div className="ml-auto flex items-center gap-2">
            {!userLocation && (
              <Button size="sm" variant="outline" onClick={requestLocation}>
                📍 Min posisjon
              </Button>
            )}
            {userLocation && <span className="text-slate-500">📍 Posisjon delt</span>}
            {locError && <span className="text-amber-400 text-xs">{locError}</span>}
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="mb-4 sm:mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3 sm:p-4">
        <div className="mb-4 sm:mb-5">
          <label className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
              🔍
            </span>
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Søk blant ${venues.length} steder…`}
              className="pl-9 pr-10"
              aria-label="Søk i steder"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-[var(--border)] hover:text-slate-100"
                aria-label="Tøm søk"
              >
                ✕
              </button>
            )}
          </label>
        </div>
        <Filters state={filters} onChange={setFilters} hasLocation={userLocation !== null} />
      </section>

      {/* Results header */}
      <section className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Sortert etter VM-stemning</p>
          <h2 className="text-base font-semibold text-slate-100 sm:text-lg">{filtered.length} steder</h2>
        </div>
        <button
          onClick={() => {
            setFilters(DEFAULT_FILTERS);
            setSearch("");
          }}
          className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:text-slate-200 active:bg-[var(--bg-surface)]"
        >
          Nullstill
        </button>
      </section>

      {/* Venue grid */}
      <section className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            userLocation={userLocation}
            cheapestBeer={cheapestBeer}
            onHover={setHighlightId}
            onSelect={setHighlightId}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-slate-400">
            Ingen steder matcher filtrene. Prøv å fjerne noen.
          </div>
        )}
      </section>
    </div>
  );
}
