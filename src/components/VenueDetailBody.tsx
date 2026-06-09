"use client";

/**
 * Shared content for the venue-detail experience.
 * Used by both the standalone /sted/[id] page (for SEO + deep-link)
 * and the bottom-sheet drawer (for in-app browsing).
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Venue } from "@/lib/types";
import { Badge, Button, Card, CardBody, Stat } from "./ui";
import { Icon } from "./icons";
import {
  directionsUrl,
  googleMapsUrl,
  haversineKm,
  venueMarkerColor,
  walkingMinutes,
} from "@/lib/utils";
import { vmScore } from "@/lib/score";

const VenuesMap = dynamic(() => import("./Map"), { ssr: false });

const categoryLabel: Record<string, string> = {
  fan_zone: "Fan Zone",
  sports_bar: "Sportsbar",
  pub: "Pub",
  restaurant: "Restaurant",
  street_food: "Street Food",
};

const dotGlow: Record<string, string> = {
  green: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]",
  yellow: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
  blue: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]",
  red: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]",
};

const IconSize = 13;

export default function VenueDetailBody({
  venue,
  context = "page",
}: {
  venue: Venue;
  context?: "page" | "drawer";
}) {
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
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${dotGlow[color]}`} aria-hidden />
              <p className="eyebrow !mb-0">{categoryLabel[venue.category] ?? venue.category}</p>
            </div>
            <h1 className="mt-2 display display-md text-slate-50">{venue.name}</h1>
            <p className="mt-3 text-[14px] text-slate-400">
              {venue.neighborhood && <span>{venue.neighborhood}</span>}
              {venue.neighborhood && venue.address && <span> · </span>}
              {venue.address && <span>{venue.address}</span>}
            </p>
          </div>
          <span
            className="shrink-0 inline-flex items-center justify-center min-w-[48px] h-[48px] px-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[18px] font-bold tracking-tight text-slate-100 num-display"
            title="VM-score basert på størrelse, kampdekning, sentralitet, stemning og kapasitet"
          >
            {score}
          </span>
        </div>
      </div>

      {/* Kart — visual location */}
      {venue.lat && venue.lng && (
        <div className="mb-5">
          <div
            className="overflow-hidden h-[220px] sm:h-[320px]"
            style={{ borderRadius: "var(--lg-r-xxl)" }}
          >
            <VenuesMap
              venues={[venue]}
              userLocation={userLocation}
              highlightId={venue.id}
              defaultCenter={{ lat: venue.lat, lng: venue.lng }}
              defaultZoom={16}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
            {userLocation && (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Icon.Navigation size={13} strokeWidth={2.2} />
                <span className="tnum">
                  {(() => {
                    const km = haversineKm({ lat: venue.lat, lng: venue.lng }, userLocation);
                    return km < 1
                      ? `${Math.round(km * 1000)} m · ${walkingMinutes(km)} min å gå`
                      : `${km.toFixed(1)} km · ${walkingMinutes(km)} min å gå`;
                  })()}
                </span>
              </span>
            )}
            <a
              href={directionsUrl(userLocation, { lat: venue.lat, lng: venue.lng })}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 font-medium text-red-400 hover:text-red-300"
            >
              Åpne i Maps <Icon.ExternalLink size={12} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      )}

      {/* Beskrivelse */}
      <Card className="mb-5">
        <CardBody>
          <p className="eyebrow mb-2">Om stedet</p>
          <p className="text-[15px] leading-relaxed text-slate-200 sm:text-[16px]">{venue.description}</p>
        </CardBody>
      </Card>

      {/* Stat-grid */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardBody>
            <Stat
              label={<span className="inline-flex items-center gap-1.5"><Icon.Users size={12} strokeWidth={2.2} /> Kapasitet</span>}
              value={venue.capacity ?? "Ikke oppgitt"}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat
              label={<span className="inline-flex items-center gap-1.5"><Icon.Ticket size={12} strokeWidth={2.2} /> Inngang</span>}
              value={!venue.ticketRequired ? "Gratis" : "Billett"}
              sub={venue.ticketPrice ?? undefined}
            />
          </CardBody>
        </Card>
        {venue.beerPrice !== null && (
          <Card>
            <CardBody>
              <Stat
                label={<span className="inline-flex items-center gap-1.5"><Icon.Beer size={12} strokeWidth={2.2} /> Ølpris (0,5 L)</span>}
                value={<><span className="tnum">{venue.beerPrice}</span> kr</>}
                sub="Kilde: pilsguiden.no"
              />
            </CardBody>
          </Card>
        )}
        <Card>
          <CardBody>
            <Stat
              label={<span className="inline-flex items-center gap-1.5"><Icon.Users size={12} strokeWidth={2.2} /> Aldersgrense</span>}
              value={venue.ageLimit !== null ? <><span className="tnum">{venue.ageLimit}</span>+</> : "Ingen"}
            />
          </CardBody>
        </Card>
      </div>

      {/* Egenskaper */}
      <Card className="mb-6">
        <CardBody className="space-y-3">
          <p className="eyebrow">Egenskaper</p>
          <div className="flex flex-wrap gap-1.5">
            {!venue.ticketRequired ? (
              <Badge tone="green"><Icon.Free size={IconSize} strokeWidth={2.2} /> Gratis</Badge>
            ) : (
              <Badge tone="yellow"><Icon.Ticket size={IconSize} strokeWidth={2.2} /> Billett</Badge>
            )}
            {venue.indoorViewing && venue.outdoorViewing && (
              <Badge tone="blue"><Icon.CloudSun size={IconSize} strokeWidth={2} /> Inne + ute</Badge>
            )}
            {venue.indoorViewing && !venue.outdoorViewing && (
              <Badge tone="blue"><Icon.Umbrella size={IconSize} strokeWidth={2} /> Under tak</Badge>
            )}
            {!venue.indoorViewing && venue.outdoorViewing && (
              <Badge tone="yellow"><Icon.Sun size={IconSize} strokeWidth={2} /> Kun ute</Badge>
            )}
            {venue.ageLimit !== null && (
              <Badge tone={venue.ageLimit >= 20 ? "red" : "zinc"}>
                <span className="tnum">{venue.ageLimit}</span>+ år
              </Badge>
            )}
            {venue.familyFriendly && (
              <Badge tone="blue"><Icon.Baby size={IconSize} strokeWidth={2} /> Familievennlig</Badge>
            )}
            {venue.alcohol === true && (
              <Badge tone="zinc"><Icon.Wine size={IconSize} strokeWidth={2} /> Alkohol</Badge>
            )}
            {venue.alcohol === false && <Badge tone="zinc">Ingen alkohol</Badge>}
            {venue.showsAllMatches === true && <Badge tone="zinc">Alle kamper</Badge>}
            {venue.showsAllMatches === false && <Badge tone="zinc">Utvalgte kamper</Badge>}
            {venue.requiresReservation && <Badge tone="zinc">Reservasjon</Badge>}
          </div>
        </CardBody>
      </Card>

      {/* Handlinger */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={venue.website} target="_blank" rel="noreferrer" className="inline-flex">
          <Button className="w-full sm:w-auto">
            Besøk nettside <Icon.ArrowRight size={14} strokeWidth={2.4} />
          </Button>
        </a>
        {venue.lat && venue.lng ? (
          <a
            href={directionsUrl(userLocation, { lat: venue.lat, lng: venue.lng })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Icon.Navigation size={14} strokeWidth={2.4} /> Veibeskrivelse
            </Button>
          </a>
        ) : (
          <a
            href={googleMapsUrl(venue.address, venue.name)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Icon.MapPin size={14} strokeWidth={2.4} /> Vis på Maps
            </Button>
          </a>
        )}
        {context === "drawer" && (
          <a
            href={`/sted/${venue.id}`}
            className="inline-flex ml-auto"
            title="Åpne stedssiden direkte (delbar URL)"
          >
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              Åpne full side <Icon.ExternalLink size={12} strokeWidth={2.4} />
            </Button>
          </a>
        )}
      </div>

      {/* Kilder */}
      {venue.sources.length > 0 && (
        <div className="mt-8 border-t border-white/[0.06] pt-5">
          <p className="eyebrow mb-3">Kilder</p>
          <ul className="space-y-1.5">
            {venue.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1.5 text-[12px] text-slate-500 underline-offset-4 transition-colors hover:text-slate-300 hover:underline break-all"
                >
                  <Icon.ExternalLink size={11} strokeWidth={2} className="mt-0.5 shrink-0" />
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
