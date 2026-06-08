"use client";

import { useMemo, useState } from "react";
import type { Venue, Match } from "@/lib/types";
import VenueCard from "./VenueCard";
import { vmScore } from "@/lib/score";
import { haversineKm, walkingMinutes } from "@/lib/utils";
import { Toggle } from "./ui";

type Sort = "near" | "free" | "atmosphere" | "family" | "beer";

interface Props {
  match: Match;
  venues: Venue[];
}

export default function MatchVenuesClient({ match, venues }: Props) {
  const [sort, setSort] = useState<Sort>("near");
  const [freeOnly, setFreeOnly] = useState(false);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    );
  };

  const eligible = useMemo(() => {
    return venues.filter((v) => {
      if (match.norwayMatch) return v.showsNorwayMatches;
      return v.showsAllMatches !== false;
    });
  }, [venues, match]);

  const filtered = useMemo(() => {
    return eligible
      .filter((v) => {
        if (freeOnly && v.ticketRequired) return false;
        if (familyOnly && !v.familyFriendly) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "near" && userLocation) {
          if (a.lat && a.lng && b.lat && b.lng) {
            return (
              haversineKm({ lat: a.lat, lng: a.lng }, userLocation) -
              haversineKm({ lat: b.lat, lng: b.lng }, userLocation)
            );
          }
        }
        if (sort === "free") {
          if (a.ticketRequired !== b.ticketRequired) return a.ticketRequired ? 1 : -1;
        }
        if (sort === "family") {
          if (!!a.familyFriendly !== !!b.familyFriendly) return a.familyFriendly ? -1 : 1;
        }
        if (sort === "beer") {
          const ap = a.beerPrice ?? Infinity;
          const bp = b.beerPrice ?? Infinity;
          if (ap !== bp) return ap - bp;
        }
        return vmScore(b).total - vmScore(a).total;
      });
  }, [eligible, freeOnly, familyOnly, sort, userLocation]);

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3">
        <div className="flex flex-wrap gap-2">
          <Toggle label="Gratis" checked={freeOnly} onChange={setFreeOnly} />
          <Toggle label="Familievennlig" checked={familyOnly} onChange={setFamilyOnly} />
          {!userLocation && (
            <button
              onClick={requestLocation}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5 text-sm text-slate-200 hover:bg-[var(--border)]"
            >
              Sorter etter avstand
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Sortér:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-8 rounded-md border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-2 text-sm text-slate-100"
          >
            <option value="near">Nærmest meg</option>
            <option value="atmosphere">Best stemning</option>
            <option value="free">Gratis først</option>
            <option value="family">Familievennlig først</option>
            <option value="beer">🍺 Billigst øl først</option>
          </select>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VenueCard key={v.id} venue={v} userLocation={userLocation} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-slate-400">
          Ingen steder matcher. Prøv å fjerne filter.
        </div>
      )}

      {userLocation && filtered[0] && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">
          <strong>Nærmest deg:</strong> {filtered[0].name}
          {filtered[0].lat && filtered[0].lng && (
            <span>
              {" — "}
              {(() => {
                const km = haversineKm({ lat: filtered[0].lat!, lng: filtered[0].lng! }, userLocation);
                return km < 1
                  ? `${Math.round(km * 1000)} m`
                  : `${km.toFixed(1)} km`;
              })()}{" "}
              ({walkingMinutes(haversineKm({ lat: filtered[0].lat!, lng: filtered[0].lng! }, userLocation))} min å gå)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
