"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import { Card, CardBody, Badge, Button } from "./ui";
import { directionsUrl, googleMapsUrl, haversineKm, walkingMinutes, venueMarkerColor } from "@/lib/utils";
import { vmScore } from "@/lib/score";

interface VenueCardProps {
  venue: Venue;
  userLocation: { lat: number; lng: number } | null;
  cheapestBeer?: number | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

const dotColor = {
  green: "bg-green-400",
  yellow: "bg-amber-400",
  blue: "bg-sky-400",
  red: "bg-red-500",
};

export default function VenueCard({ venue, userLocation, cheapestBeer, onHover, onSelect }: VenueCardProps) {
  const score = vmScore(venue).total;
  const color = venueMarkerColor(venue);

  let distLabel: string | null = null;
  if (userLocation && venue.lat && venue.lng) {
    const km = haversineKm({ lat: venue.lat, lng: venue.lng }, userLocation);
    const min = walkingMinutes(km);
    distLabel = km < 1 ? `${Math.round(km * 1000)} m · ${min} min` : `${km.toFixed(1)} km · ${min} min`;
  }

  return (
    <Link href={`/sted/${venue.id}`} className="block">
    <Card
      className="cursor-pointer transition hover:border-[var(--border-strong)] hover:shadow-md"
      onMouseEnter={() => onHover?.(venue.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <CardBody className="space-y-3">
        {/* Header: navn + score */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotColor[color]}`} aria-hidden />
              <h3 className="truncate text-base font-semibold text-slate-100">{venue.name}</h3>
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-400">
              {venue.neighborhood ?? venue.address ?? "—"}
              {distLabel && <span className="text-slate-500"> · {distLabel}</span>}
            </p>
          </div>
          <span
            className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-bold tracking-tight text-slate-200"
            title="VM-score basert på størrelse, kampdekning, sentralitet, stemning og kapasitet"
          >
            {score}
          </span>
        </div>

        {/* Rad 1: pris / tak / aldersgrense — kjernebeslutninger */}
        <div className="flex flex-wrap gap-1.5">
          {!venue.ticketRequired ? <Badge tone="green">Gratis</Badge> : <Badge tone="yellow">Billett</Badge>}
          {venue.beerPrice !== null && (
            <Badge
              tone={cheapestBeer !== null && cheapestBeer !== undefined && venue.beerPrice === cheapestBeer ? "green" : "default"}
              title={`Pils 0,5 L — kilde: pilsguiden.no, oppdatert ${venue.beerPriceUpdated ?? ""}`}
            >
              🍺 {venue.beerPrice} kr
              {cheapestBeer !== null && cheapestBeer !== undefined && venue.beerPrice === cheapestBeer && " · billigst"}
            </Badge>
          )}
          {venue.indoorViewing && venue.outdoorViewing && <Badge tone="blue">🌧️☀️ Inne + ute</Badge>}
          {venue.indoorViewing && !venue.outdoorViewing && <Badge tone="blue">🌧️ Under tak</Badge>}
          {!venue.indoorViewing && venue.outdoorViewing && <Badge tone="yellow">☀️ Kun ute</Badge>}
          {venue.ageLimit !== null && (
            <Badge tone={venue.ageLimit >= 20 ? "red" : "zinc"}>{venue.ageLimit}+ år</Badge>
          )}
          {venue.familyFriendly && <Badge tone="blue">Familievennlig</Badge>}
        </div>

        {/* Rad 2: fasiliteter — sekundærinformasjon */}
        <div className="flex flex-wrap gap-1.5">
          {venue.alcohol === true && <Badge tone="zinc">Alkohol</Badge>}
          {venue.alcohol === false && <Badge tone="zinc">Ingen alkohol</Badge>}
          {venue.showsAllMatches === true && <Badge tone="zinc">Alle kamper</Badge>}
          {venue.showsAllMatches === false && <Badge tone="zinc">Utvalgte kamper</Badge>}
          {venue.requiresReservation && <Badge tone="zinc">Reservasjon</Badge>}
          {venue.capacity && <Badge tone="zinc">👥 {venue.capacity}</Badge>}
        </div>

        {venue.ticketPrice && (
          <p className="text-xs text-slate-400">{venue.ticketPrice}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={venue.website}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex"
          >
            <Button size="sm" variant="outline">
              Nettside
            </Button>
          </a>
          {venue.lat && venue.lng && (
            <a
              href={directionsUrl(userLocation, { lat: venue.lat, lng: venue.lng })}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex"
            >
              <Button size="sm" variant="outline">
                Veibeskrivelse
              </Button>
            </a>
          )}
          {(!venue.lat || !venue.lng) && (
            <a
              href={googleMapsUrl(venue.address, venue.name)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex"
            >
              <Button size="sm" variant="outline">
                Maps
              </Button>
            </a>
          )}
        </div>
      </CardBody>
    </Card>
    </Link>
  );
}
