"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Venue, FilterState } from "@/lib/types";
import VenueCard from "./VenueCard";
import VenueDrawer from "./VenueDrawer";
import Filters from "./Filters";
import { haversineKm, walkingMinutes } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { Button, Input } from "./ui";
import { Icon } from "./icons";

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
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

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
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      {/* Hero */}
      <section className="mb-6 sm:mb-8">
        <p className="eyebrow mb-2">FIFA Fotball-VM 2026 · 11. juni – 19. juli</p>
        <h1 className="display display-md sm:display-lg text-slate-50">
          Hvor kan du se VM i Oslo?
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-400">
          <span className="tnum font-medium text-slate-200">{venues.length}</span> steder kartlagt — fra Fan Zones til
          bydelspuber. Filtrer på pris, tak/vær, aldersgrense og avstand.
        </p>
      </section>

      {/* Map */}
      <section className="mb-5">
        <button
          type="button"
          onClick={() => setShowMap((s) => !s)}
          className="lg-capsule lg-energize mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-200 sm:hidden"
        >
          <Icon.ChevronDown
            size={13}
            strokeWidth={2.4}
            className="transition-transform"
            style={{ transform: showMap ? "rotate(0deg)" : "rotate(-90deg)" }}
          />
          {showMap ? "Skjul kart" : "Vis kart"}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showMap ? "h-[40vh] sm:h-[58vh] min-h-[280px] sm:min-h-[440px]" : "h-0"
          }`}
          style={{ borderRadius: "var(--lg-r-xxl)" }}
        >
          <VenuesMap venues={filtered} userLocation={userLocation} highlightId={highlightId} />
        </div>
      </section>

      {/* Legend + position — minimal strip, no chrome */}
      <section className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" /> Gratis</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.55)]" /> Billett</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.55)]" /> Familievennlig</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.65)]" /> Storarrangement</span>
        <div className="ml-auto flex items-center gap-2">
          {!userLocation && (
            <Button size="sm" variant="outline" onClick={requestLocation}>
              <Icon.MapPin size={14} strokeWidth={2.2} /> Min posisjon
            </Button>
          )}
          {userLocation && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
              <Icon.MapPin size={13} strokeWidth={2.2} /> Posisjon delt
            </span>
          )}
          {locError && (
            <span className="inline-flex items-center gap-1.5 text-amber-300/90">
              <Icon.Alert size={13} strokeWidth={2.2} /> {locError}
            </span>
          )}
        </div>
      </section>

      {/* Search + Filters — matte panel */}
      <section
        className="lg-surface mb-6 p-5 sm:p-6"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <div className="mb-5">
          <label className="relative block">
            <Icon.Search
              size={16}
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Søk blant ${venues.length} steder…`}
              className="pl-11 pr-11"
              aria-label="Søk i steder"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="lg-capsule lg-energize absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:bg-white/[0.10] hover:text-slate-100"
                aria-label="Tøm søk"
              >
                <Icon.X size={14} strokeWidth={2.4} />
              </button>
            )}
          </label>
        </div>
        <Filters state={filters} onChange={setFilters} hasLocation={userLocation !== null} />
      </section>

      {/* Results header */}
      <section className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-0.5">Sortert etter VM-stemning</p>
          <h2 className="text-[18px] font-semibold tracking-tight text-slate-100">
            <span className="tnum">{filtered.length}</span> steder
          </h2>
        </div>
        <button
          onClick={() => {
            setFilters(DEFAULT_FILTERS);
            setSearch("");
          }}
          className="lg-capsule lg-energize px-3.5 py-2 text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
        >
          Nullstill
        </button>
      </section>

      {/* Venue grid */}
      <section className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            userLocation={userLocation}
            cheapestBeer={cheapestBeer}
            onHover={setHighlightId}
            onSelect={setSelectedVenue}
          />
        ))}
        {filtered.length === 0 && (
          <div
            className="lg-surface col-span-full p-12 text-center"
            style={{ borderRadius: "var(--lg-r-xxl)" }}
          >
            <Icon.Filter size={28} strokeWidth={1.5} className="mx-auto mb-3 text-slate-500" />
            <p className="text-[15px] text-slate-300">Ingen steder matcher filtrene.</p>
            <p className="mt-1 text-[13px] text-slate-500">Prøv å fjerne noen, eller trykk Nullstill.</p>
          </div>
        )}
      </section>

      {/* Bottom-sheet drawer for venue details */}
      <VenueDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </div>
  );
}
