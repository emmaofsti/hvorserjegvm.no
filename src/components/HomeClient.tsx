"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Venue, FilterState } from "@/lib/types";
import Link from "next/link";
import VenueCard from "./VenueCard";
import VenueDrawer from "./VenueDrawer";
import Filters from "./Filters";
import { haversineKm, parseCapacity, walkingMinutes } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { Input, Select } from "./ui";
import { Icon } from "./icons";
import { useFavorites } from "@/lib/useFavorites";

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
  minCapacity: null,
  category: "all",
  age: "all",
};

type SortOption = "recommended" | "distance" | "beer_price" | "capacity" | "name";

export default function HomeClient({ venues }: { venues: Venue[] }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favoriteIds } = useFavorites();

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
        if (showFavoritesOnly && !favoriteIds.includes(v.id)) return false;

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
        if (filters.minCapacity !== null) {
          const cap = parseCapacity(v.capacity);
          if (cap === null || cap < filters.minCapacity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "recommended":
            return vmScore(b).total - vmScore(a).total;
          case "distance":
            if (!userLocation) return vmScore(b).total - vmScore(a).total;
            const distA = a.lat && a.lng ? haversineKm({ lat: a.lat, lng: a.lng }, userLocation) : Infinity;
            const distB = b.lat && b.lng ? haversineKm({ lat: b.lat, lng: b.lng }, userLocation) : Infinity;
            return distA - distB;
          case "beer_price":
            return (a.beerPrice ?? Infinity) - (b.beerPrice ?? Infinity);
          case "capacity":
            // Descending — largest first; null capacity goes to end
            return (parseCapacity(b.capacity) ?? -1) - (parseCapacity(a.capacity) ?? -1);
          case "name":
            return a.name.localeCompare(b.name, "nb");
          default:
            return vmScore(b).total - vmScore(a).total;
        }
      });
  }, [venues, filters, userLocation, search, sortBy, showFavoritesOnly, favoriteIds]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "category") return v !== "all";
    if (k === "age") return v !== "all";
    if (k === "maxMinutesAway") return v !== null;
    if (k === "maxBeerPrice") return v !== null;
    if (k === "minCapacity") return v !== null;
    return v === true;
  }).length;

  return (
    <div className="home-layout">
      {/* ─── LEFT: Map panel ─── */}
      <div
        className={`home-map-panel ${viewMode === "list" ? "home-map-panel--hidden-mobile" : ""} ${
          mapFullscreen ? "home-map-panel--fullscreen" : ""
        }`}
      >
        <VenuesMap
          venues={filtered}
          userLocation={userLocation}
          highlightId={highlightId}
          resizeSignal={mapFullscreen ? 1 : 0}
        />

        {/* Fullscreen toggle (mobile only) */}
        <button
          type="button"
          onClick={() => setMapFullscreen((f) => !f)}
          className="home-map-fullscreen-btn"
          aria-label={mapFullscreen ? "Liten skjerm" : "Stor skjerm"}
        >
          {mapFullscreen ? (
            <Icon.Minimize2 size={16} strokeWidth={2.4} />
          ) : (
            <Icon.Maximize2 size={16} strokeWidth={2.4} />
          )}
          <span className="ml-1.5 hidden xs:inline">{mapFullscreen ? "Liten" : "Stor"}</span>
        </button>

        {/* Legend overlay — kategori, ikke score */}
        <div className="home-map-legend">
          <div className="home-map-legend-inner">
            <span className="eyebrow !mb-0">Markører</span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
                <span className="text-[11px] text-slate-300">Gratis</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.55)]" />
                <span className="text-[11px] text-slate-300">Billett</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.55)]" />
                <span className="text-[11px] text-slate-300">Familie</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.65)]" />
                <span className="text-[11px] text-slate-300">Fan Zone</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: List panel (also holds controls on mobile, sits above map) ─── */}
      <div className={`home-list-panel ${viewMode === "list" ? "home-list-panel--list-mode-mobile" : ""}`}>
        {/* Header */}
        <div className="home-list-header">
          <div>
            <h1
              className="text-[32px] sm:text-[40px] text-slate-50 leading-[1.05]"
              style={{
                fontFamily: "var(--font-display), Impact, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.015em",
              }}
            >
              Hvor ser jeg VM 2026?
            </h1>
            <p className="text-[13px] text-slate-400 mt-1">
              Finn de beste stedene å se kampene i Oslo
            </p>
            {/* Juridisk disclaimer-line — synlig på forsiden uten å ødelegge
                visuelt fokus. Signaliserer: ikke offisiell, oppdatert i juni
                2026, hobbyprosjekt. /om-lenken er flyttet til footer for
                mer diskret plassering. */}
            <p className="mt-2 text-[11px] text-slate-500 leading-snug">
              Uavhengig hobbyprosjekt · ikke tilknyttet FIFA eller NFF · data per juni 2026.
            </p>
          </div>
        </div>

        {/* Ølpris-lenke — beholder gult visuelt uttrykk (kjenner igjen som
            "billigst pils"-vibe), men teksten er nøytral og navngir
            ingen venuer eller priser. Det er navngivning + pris-rangering
            på forsiden som er Alkoholloven §9-2-risikoen, ikke fargen. */}
        {cheapestBeer !== null && (
          <div className="px-4 pb-2">
            <Link
              href="/billigst-ol"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-amber-400/[0.08] border border-amber-400/25 hover:bg-amber-400/[0.12] transition-colors"
            >
              <Icon.Beer size={18} strokeWidth={2} className="shrink-0 text-amber-300" />
              <span className="min-w-0 flex-1 text-[13px] font-semibold text-amber-100">
                Ølpris-oversikt for VM-stedene
              </span>
              <span className="shrink-0 text-[12px] text-amber-200/80 inline-flex items-center gap-0.5">
                Se <Icon.ArrowRight size={12} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        )}

        {/* Search */}
        <div className="home-search">
          <label className="relative block">
            <Icon.Search
              size={16}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk etter sted, område eller type..."
              className="pl-10 pr-10 !min-h-[40px] !text-[13px]"
              aria-label="Søk i steder"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-100"
                aria-label="Tøm søk"
              >
                <Icon.X size={14} strokeWidth={2.4} />
              </button>
            )}
          </label>
        </div>

        {/* Quick filters */}
        <div className="home-quick-filters">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, freeOnly: !f.freeOnly }))}
              className={`home-chip ${filters.freeOnly ? "home-chip--active" : ""}`}
            >
              Gratis
            </button>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, alcohol: !f.alcohol }))}
              className={`home-chip ${filters.alcohol ? "home-chip--active" : ""}`}
            >
              Alkohol
            </button>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, outdoor: !f.outdoor }))}
              className={`home-chip ${filters.outdoor ? "home-chip--active" : ""}`}
            >
              Ute
            </button>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, familyFriendly: !f.familyFriendly }))}
              className={`home-chip ${filters.familyFriendly ? "home-chip--active" : ""}`}
            >
              Familie
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className={`home-chip home-chip--filter ${showFilters || activeFilterCount > 0 ? "home-chip--active" : ""}`}
            >
              <Icon.SlidersHorizontal size={13} strokeWidth={2} />
              Flere filtre
              {activeFilterCount > 0 && (
                <span className="home-chip-count">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable full filters */}
        {showFilters && (
          <div className="home-filters-expanded">
            <Filters state={filters} onChange={setFilters} hasLocation={userLocation !== null} />
          </div>
        )}

        {/* Sort + count + favoritter — toggle Kart/Liste er fjernet */}
        <div className="home-toolbar">
          <div className="flex items-center gap-2 ml-auto">
            {/* Favorites toggle */}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((s) => !s)}
              className={`home-chip ${showFavoritesOnly ? "home-chip--active" : ""}`}
              title="Vis kun favoritter"
            >
              <Icon.Heart size={13} strokeWidth={2} fill={showFavoritesOnly ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Favoritter</span>
              {favoriteIds.length > 0 && (
                <span className="home-chip-count">{favoriteIds.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Results count + sort */}
        <div className="home-results-bar">
          <span className="text-[13px] text-slate-400">
            <span className="tnum font-medium text-slate-200">{filtered.length}</span> steder funnet
          </span>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <span>Sorter etter:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 font-medium border-none outline-none cursor-pointer text-[12px] appearance-none pr-4 bg-[image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22><path fill=%22%2394a3b8%22 d=%22M5 6L0 0h10z%22/></svg>')] bg-no-repeat bg-[length:8px_5px] [background-position:right_0_center]"
            >
              <option value="recommended">Anbefalt</option>
              <option value="distance">Avstand</option>
              <option value="beer_price">Ølpris</option>
              <option value="capacity">Størst først</option>
              <option value="name">Navn</option>
            </select>
          </div>
        </div>

        {/* Venue cards */}
        <div className="home-card-list">
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
            <div className="p-12 text-center lg-surface" style={{ borderRadius: "var(--lg-r-xl)" }}>
              <Icon.Filter size={28} strokeWidth={1.5} className="mx-auto mb-3 text-slate-500" />
              <p className="text-[15px] text-slate-300">Ingen steder matcher filtrene.</p>
              <p className="mt-1 text-[13px] text-slate-500">Prøv å fjerne noen, eller trykk Nullstill.</p>
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setSearch("");
                  setShowFavoritesOnly(false);
                }}
                className="mt-4 text-[13px] font-medium text-red-400 hover:text-red-300"
              >
                Nullstill alle filtre
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom-sheet drawer for venue details */}
      <VenueDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </div>
  );
}
