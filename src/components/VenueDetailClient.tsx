"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import { Badge, Button, Card, CardBody } from "./ui";
import { directionsUrl, googleMapsUrl, venueMarkerColor } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { useEffect, useState } from "react";

const categoryLabel: Record<string, string> = {
  fan_zone: "Fan Zone",
  sports_bar: "Sportsbar",
  pub: "Pub",
  restaurant: "Restaurant",
  street_food: "Street Food",
};

const dotColor: Record<string, string> = {
  green: "bg-green-400",
  yellow: "bg-amber-400",
  blue: "bg-sky-400",
  red: "bg-red-500",
};

export default function VenueDetailClient({ venue }: { venue: Venue }) {
  const score = vmScore(venue).total;
  const color = venueMarkerColor(venue);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
      );
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-3 py-5 sm:px-4 sm:py-8">
      {/* Tilbake-lenke */}
      <Link
        href="/"
        className="mb-5 sm:mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 -ml-2 text-sm text-slate-400 transition-colors hover:text-slate-200 active:bg-[var(--bg-surface)]"
      >
        ← Tilbake til alle steder
      </Link>

      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span className={`inline-block h-3 w-3 shrink-0 rounded-full ${dotColor[color]}`} aria-hidden />
              <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-3xl">{venue.name}</h1>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {venue.neighborhood && <span>{venue.neighborhood}</span>}
              {venue.neighborhood && venue.address && <span> · </span>}
              {venue.address && <span>{venue.address}</span>}
            </p>
          </div>
          <span
            className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1 text-sm font-bold tracking-tight text-slate-200"
            title="VM-score basert på størrelse, kampdekning, sentralitet, stemning og kapasitet"
          >
            {score}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {categoryLabel[venue.category] ?? venue.category}
        </p>
      </div>

      {/* Beskrivelse */}
      <Card className="mb-4 sm:mb-5">
        <CardBody>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Om stedet</h2>
          <p className="text-[15px] leading-relaxed text-slate-200 sm:text-base">{venue.description}</p>
        </CardBody>
      </Card>

      {/* Detaljer-grid — 2 cols on mobile too for compact info */}
      <div className="mb-4 sm:mb-5 grid grid-cols-2 gap-2.5 sm:gap-4">
        {/* Kapasitet */}
        <Card>
          <CardBody>
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">Kapasitet</h2>
            <p className="text-base font-semibold text-slate-100 sm:text-lg">
              {venue.capacity ?? "Ikke oppgitt"}
            </p>
          </CardBody>
        </Card>

        {/* Pris */}
        <Card>
          <CardBody>
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">Inngang</h2>
            <p className="text-base font-semibold text-slate-100 sm:text-lg">
              {!venue.ticketRequired ? "Gratis" : "Billett"}
            </p>
            {venue.ticketPrice && (
              <p className="mt-1 text-xs text-slate-400">{venue.ticketPrice}</p>
            )}
          </CardBody>
        </Card>

        {/* Ølpris */}
        {venue.beerPrice !== null && (
          <Card>
            <CardBody>
              <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">Ølpris (0,5 L)</h2>
              <p className="text-base font-semibold text-slate-100 sm:text-lg">{venue.beerPrice} kr</p>
              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">Kilde: pilsguiden.no</p>
            </CardBody>
          </Card>
        )}

        {/* Aldersgrense */}
        <Card>
          <CardBody>
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">Aldersgrense</h2>
            <p className="text-base font-semibold text-slate-100 sm:text-lg">
              {venue.ageLimit !== null ? `${venue.ageLimit}+` : "Ingen"}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Badges */}
      <Card className="mb-4 sm:mb-5">
        <CardBody className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Egenskaper</h2>
          <div className="flex flex-wrap gap-1.5">
            {!venue.ticketRequired ? <Badge tone="green">Gratis</Badge> : <Badge tone="yellow">Billett</Badge>}
            {venue.indoorViewing && venue.outdoorViewing && <Badge tone="blue">🌧️☀️ Inne + ute</Badge>}
            {venue.indoorViewing && !venue.outdoorViewing && <Badge tone="blue">🌧️ Under tak</Badge>}
            {!venue.indoorViewing && venue.outdoorViewing && <Badge tone="yellow">☀️ Kun ute</Badge>}
            {venue.ageLimit !== null && (
              <Badge tone={venue.ageLimit >= 20 ? "red" : "zinc"}>{venue.ageLimit}+ år</Badge>
            )}
            {venue.familyFriendly && <Badge tone="blue">Familievennlig</Badge>}
            {venue.alcohol === true && <Badge tone="zinc">Alkohol</Badge>}
            {venue.alcohol === false && <Badge tone="zinc">Ingen alkohol</Badge>}
            {venue.showsAllMatches === true && <Badge tone="zinc">Alle kamper</Badge>}
            {venue.showsAllMatches === false && <Badge tone="zinc">Utvalgte kamper</Badge>}
            {venue.requiresReservation && <Badge tone="zinc">Reservasjon</Badge>}
            {venue.capacity && <Badge tone="zinc">👥 {venue.capacity}</Badge>}
          </div>
        </CardBody>
      </Card>

      {/* Handlinger — stacked on mobile for big tap targets */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <a href={venue.website} target="_blank" rel="noreferrer" className="inline-flex">
          <Button className="w-full sm:w-auto">Besøk nettside →</Button>
        </a>
        {venue.lat && venue.lng && (
          <a
            href={directionsUrl(userLocation, { lat: venue.lat, lng: venue.lng })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="w-full sm:w-auto">Veibeskrivelse</Button>
          </a>
        )}
        {(!venue.lat || !venue.lng) && (
          <a
            href={googleMapsUrl(venue.address, venue.name)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="w-full sm:w-auto">Vis på Maps</Button>
          </a>
        )}
      </div>

      {/* Kilder */}
      {venue.sources.length > 0 && (
        <div className="mt-6 sm:mt-8 border-t border-[var(--border)] pt-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Kilder</h2>
          <ul className="space-y-1">
            {venue.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 underline transition-colors hover:text-slate-300 break-all"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
