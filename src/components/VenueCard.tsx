"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import { Badge } from "./ui";
import { Icon } from "./icons";
import { haversineKm, walkingMinutes } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { useFavorites } from "@/lib/useFavorites";
import { getVenueImageUrl } from "@/lib/venueImages";

interface VenueCardProps {
  venue: Venue;
  userLocation: { lat: number; lng: number } | null;
  cheapestBeer?: number | null;
  onHover?: (id: string | null) => void;
  /** When provided, tap opens the drawer instead of navigating. */
  onSelect?: (venue: Venue) => void;
}

const IconSize = 12;

export default function VenueCard({ venue, userLocation, cheapestBeer, onHover, onSelect }: VenueCardProps) {
  const score = vmScore(venue).total;
  const isCheapest = cheapestBeer != null && venue.beerPrice === cheapestBeer;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(venue.id);
  const imageUrl = venue.imageUrl ?? getVenueImageUrl(venue.id, venue.category);

  let distLabel: string | null = null;
  if (userLocation && venue.lat && venue.lng) {
    const km = haversineKm({ lat: venue.lat, lng: venue.lng }, userLocation);
    const min = walkingMinutes(km);
    distLabel = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }

  return (
    <div
      className="venue-card group"
      onMouseEnter={() => {
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) onHover?.(venue.id);
      }}
      onMouseLeave={() => {
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) onHover?.(null);
      }}
    >
      <Link
        href={`/sted/${venue.id}`}
        className="block"
        onClick={(e) => {
          if (onSelect && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            onSelect(venue);
          }
        }}
      >
        {/* Image section */}
        <div className="venue-card-image">
          <img
            src={imageUrl}
            alt={venue.name}
            loading="lazy"
            className="venue-card-img"
          />
          {/* Gradient overlay */}
          <div className="venue-card-image-overlay" />

          {/* VM-score badge - top left */}
          <div className="venue-card-score" title="VM-score">
            <span className="tnum">{score}</span>
          </div>

          {/* Favorite heart - top right */}
          <button
            type="button"
            className={`venue-card-fav ${fav ? "venue-card-fav--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(venue.id);
            }}
            aria-label={fav ? "Fjern fra favoritter" : "Legg til i favoritter"}
          >
            <Icon.Heart
              size={18}
              strokeWidth={2}
              fill={fav ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content section */}
        <div className="venue-card-body">
          {/* Name + neighborhood + distance */}
          <div className="mb-2">
            <h3 className="venue-card-name">{venue.name}</h3>
            <p className="venue-card-location">
              {venue.neighborhood ?? venue.address ?? "—"}
              {distLabel && (
                <span className="venue-card-distance"> · <span className="tnum">{distLabel}</span></span>
              )}
            </p>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {!venue.ticketRequired ? (
              <Badge tone="green">
                <Icon.Free size={IconSize} strokeWidth={2.2} /> Gratis
              </Badge>
            ) : (
              <Badge tone="yellow">
                <Icon.Ticket size={IconSize} strokeWidth={2.2} /> Billett
              </Badge>
            )}

            {venue.outdoorViewing && (
              <Badge tone="blue">
                <Icon.Sun size={IconSize} strokeWidth={2} /> Ute
              </Badge>
            )}

            {venue.alcohol === true && (
              <Badge tone="default">
                <Icon.Wine size={IconSize} strokeWidth={2} /> Alkohol
              </Badge>
            )}
          </div>

          {/* Description (truncated) */}
          <p className="venue-card-desc">{venue.description}</p>

          {/* Bottom row: beer price + "Se sted" */}
          <div className="venue-card-footer">
            {venue.beerPrice !== null ? (
              <span
                className={`venue-card-beer ${isCheapest ? "venue-card-beer--cheapest" : ""}`}
                title={`Pils 0,5 L — kilde: pilsguiden.no`}
              >
                <Icon.Beer size={14} strokeWidth={2} />
                <span className="tnum">{venue.beerPrice}</span> kr
                {isCheapest && <span className="venue-card-beer-tag">Billigst!</span>}
              </span>
            ) : (
              <span />
            )}
            <span className="venue-card-cta">
              Se sted <Icon.ArrowRight size={13} strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
