"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import { Card, CardBody, Badge } from "./ui";
import { Icon } from "./icons";
import { directionsUrl, googleMapsUrl, haversineKm, walkingMinutes, venueMarkerColor } from "@/lib/utils";
import { vmScore } from "@/lib/score";

interface VenueCardProps {
  venue: Venue;
  userLocation: { lat: number; lng: number } | null;
  cheapestBeer?: number | null;
  onHover?: (id: string | null) => void;
  /** When provided, tap opens the drawer instead of navigating. */
  onSelect?: (venue: Venue) => void;
}

const dotGlow = {
  green: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]",
  yellow: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.55)]",
  blue: "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.55)]",
  red: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.65)]",
};

const IconSize = 13;

export default function VenueCard({ venue, userLocation, cheapestBeer, onHover, onSelect }: VenueCardProps) {
  const score = vmScore(venue).total;
  const color = venueMarkerColor(venue);
  const isCheapest = cheapestBeer != null && venue.beerPrice === cheapestBeer;

  let distLabel: string | null = null;
  if (userLocation && venue.lat && venue.lng) {
    const km = haversineKm({ lat: venue.lat, lng: venue.lng }, userLocation);
    const min = walkingMinutes(km);
    distLabel = km < 1 ? `${Math.round(km * 1000)} m · ${min} min` : `${km.toFixed(1)} km · ${min} min`;
  }

  // Contextual third badge (pick the most relevant signal)
  let context: React.ReactNode = null;
  if (venue.beerPrice !== null) {
    context = (
      <Badge
        tone={isCheapest ? "gold" : "default"}
        title={`Pils 0,5 L — kilde: pilsguiden.no, oppdatert ${venue.beerPriceUpdated ?? ""}`}
      >
        <Icon.Beer size={IconSize} strokeWidth={2} />
        <span className="tnum">{venue.beerPrice}</span>
        <span className="text-current/80">kr</span>
        {isCheapest && <span className="text-amber-200/90">· billigst</span>}
      </Badge>
    );
  } else if (venue.familyFriendly) {
    context = (
      <Badge tone="blue">
        <Icon.Baby size={IconSize} strokeWidth={2} /> Familievennlig
      </Badge>
    );
  } else if (venue.ageLimit !== null && venue.ageLimit >= 20) {
    context = <Badge tone="red"><span className="tnum">{venue.ageLimit}</span>+ år</Badge>;
  }

  return (
    <Link
      href={`/sted/${venue.id}`}
      className="block group"
      onClick={(e) => {
        // When drawer-mode is active, intercept tap to open drawer instead.
        // Cmd/Ctrl-click and right-click still open the real page (default browser behavior).
        if (onSelect && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          onSelect(venue);
        }
      }}
    >
      <Card
        className="cursor-pointer"
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) onHover?.(venue.id);
        }}
        onMouseLeave={() => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) onHover?.(null);
        }}
      >
        <CardBody className="space-y-4">
          {/* Header: navn + score */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotGlow[color]}`} aria-hidden />
                <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-100 sm:text-base">
                  {venue.name}
                </h3>
              </div>
              <p className="mt-0.5 truncate text-[13px] text-slate-400">
                {venue.neighborhood ?? venue.address ?? "—"}
                {distLabel && <span className="text-slate-500"> · <span className="tnum">{distLabel}</span></span>}
              </p>
            </div>
            <span
              className="shrink-0 inline-flex items-center justify-center min-w-[34px] h-[26px] px-1.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[12px] font-bold tracking-tight text-slate-100 tnum"
              title="VM-score basert på størrelse, kampdekning, sentralitet, stemning og kapasitet"
            >
              {score}
            </span>
          </div>

          {/* Tre kjernebeslutninger — alltid samme rekkefølge */}
          <div className="flex flex-wrap gap-1.5">
            {!venue.ticketRequired ? (
              <Badge tone="green">
                <Icon.Free size={IconSize} strokeWidth={2.2} /> Gratis
              </Badge>
            ) : (
              <Badge tone="yellow">
                <Icon.Ticket size={IconSize} strokeWidth={2.2} /> Billett
              </Badge>
            )}

            {venue.indoorViewing && venue.outdoorViewing && (
              <Badge tone="blue">
                <Icon.CloudSun size={IconSize} strokeWidth={2} /> Inne + ute
              </Badge>
            )}
            {venue.indoorViewing && !venue.outdoorViewing && (
              <Badge tone="blue">
                <Icon.Umbrella size={IconSize} strokeWidth={2} /> Under tak
              </Badge>
            )}
            {!venue.indoorViewing && venue.outdoorViewing && (
              <Badge tone="yellow">
                <Icon.Sun size={IconSize} strokeWidth={2} /> Kun ute
              </Badge>
            )}

            {context}
          </div>

          {/* Actions — minimal, ikke konkurrer med innholdet */}
          <div className="flex items-center justify-between pt-1">
            <a
              href={venue.website}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-300 hover:text-slate-100"
            >
              Nettside <Icon.ExternalLink size={12} strokeWidth={2.2} />
            </a>
            {venue.lat && venue.lng ? (
              <a
                href={directionsUrl(userLocation, { lat: venue.lat, lng: venue.lng })}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-300 hover:text-slate-100"
              >
                <Icon.Navigation size={12} strokeWidth={2.2} /> Veibeskrivelse
              </a>
            ) : (
              <a
                href={googleMapsUrl(venue.address, venue.name)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-300 hover:text-slate-100"
              >
                <Icon.MapPin size={12} strokeWidth={2.2} /> Maps
              </a>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

