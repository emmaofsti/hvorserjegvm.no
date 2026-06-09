"use client";

import { useMemo, useState } from "react";
import type { Venue, Match } from "@/lib/types";
import VenueCard from "./VenueCard";
import VenueDrawer from "./VenueDrawer";
import { vmScore } from "@/lib/score";
import { haversineKm, walkingMinutes } from "@/lib/utils";
import { Toggle, Select } from "./ui";
import { Icon } from "./icons";

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
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

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
    <div className="space-y-3 sm:space-y-4">
      {/* Filters — matte panel */}
      <section
        className="lg-surface p-5"
        style={{ borderRadius: "var(--lg-r-xl)" }}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <Toggle
            label={<><Icon.Free size={14} strokeWidth={2.2} /> Gratis</>}
            checked={freeOnly}
            onChange={setFreeOnly}
          />
          <Toggle
            label={<><Icon.Baby size={14} strokeWidth={2} /> Familievennlig</>}
            checked={familyOnly}
            onChange={setFamilyOnly}
          />
          {!userLocation && (
            <button
              onClick={requestLocation}
              className="lg-capsule lg-energize inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-slate-200 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07]"
            >
              <Icon.MapPin size={14} strokeWidth={2.2} /> Min posisjon
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="shrink-0 eyebrow !mb-0">Sortér</span>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="near">Nærmest meg</option>
            <option value="atmosphere">Best stemning</option>
            <option value="free">Gratis først</option>
            <option value="family">Familievennlig først</option>
            <option value="beer">Billigst øl først</option>
          </Select>
        </div>
      </section>

      {/* Nearest venue highlight */}
      {userLocation && filtered[0] && (
        <div
          className="lg-glass-accent inline-flex items-center gap-2 px-4 py-3 text-[13px]"
          style={{ borderRadius: "var(--lg-r-l)" }}
        >
          <Icon.Navigation size={14} strokeWidth={2.2} />
          <span>
            <span className="font-semibold">Nærmest deg:</span> {filtered[0].name}
            {filtered[0].lat && filtered[0].lng && (
              <span className="text-red-100/80">
                {" — "}
                <span className="tnum">
                  {(() => {
                    const km = haversineKm({ lat: filtered[0].lat!, lng: filtered[0].lng! }, userLocation);
                    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
                  })()}{" "}
                  ({walkingMinutes(haversineKm({ lat: filtered[0].lat!, lng: filtered[0].lng! }, userLocation))} min)
                </span>
              </span>
            )}
          </span>
        </div>
      )}

      {/* Venue grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            userLocation={userLocation}
            onSelect={setSelectedVenue}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div
          className="lg-surface p-12 text-center"
          style={{ borderRadius: "var(--lg-r-xxl)" }}
        >
          <Icon.Filter size={28} strokeWidth={1.5} className="mx-auto mb-3 text-slate-500" />
          <p className="text-[15px] text-slate-300">Ingen steder matcher.</p>
          <p className="mt-1 text-[13px] text-slate-500">Prøv å fjerne filter.</p>
        </div>
      )}

      <VenueDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </div>
  );
}
