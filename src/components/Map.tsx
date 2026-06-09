"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Venue } from "@/lib/types";
import { venueMarkerColor, directionsUrl, googleMapsUrl } from "@/lib/utils";

const colorHex: Record<"green" | "yellow" | "blue" | "red", string> = {
  green: "#16a34a",
  yellow: "#ca8a04",
  blue: "#2563eb",
  red: "#dc2626",
};

const userIcon = L.divIcon({
  className: "vmoslo-user-marker",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#0ea5e9;border:3px solid white;box-shadow:0 0 0 2px #0ea5e9;"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface MapProps {
  venues: Venue[];
  userLocation: { lat: number; lng: number } | null;
  highlightId?: string | null;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

export default function VenuesMap({ venues, userLocation, highlightId, defaultCenter, defaultZoom }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!highlightId || !mapRef.current) return;
    const v = venues.find((x) => x.id === highlightId);
    if (v && v.lat && v.lng) {
      mapRef.current.flyTo([v.lat, v.lng], 15, { duration: 0.5 });
    }
  }, [highlightId, venues]);

  const center: [number, number] = defaultCenter
    ? [defaultCenter.lat, defaultCenter.lng]
    : [59.9139, 10.7522]; // Oslo sentrum — alltid standard

  // Begrens kartet til Oslo-området så det ikke kan hoppes til helt andre steder
  const osloBounds: L.LatLngBoundsExpression = [
    [59.82, 10.55], // sørvest
    [60.01, 10.95], // nordøst
  ];

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={defaultZoom ?? 13}
      scrollWheelZoom
      maxBounds={osloBounds}
      maxBoundsViscosity={0.9}
      minZoom={11}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Du er her</Popup>
        </Marker>
      )}
      {venues.map((v) =>
        v.lat && v.lng ? (
          <CircleMarker
            key={v.id}
            center={[v.lat, v.lng]}
            radius={highlightId === v.id ? 14 : 10}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: colorHex[venueMarkerColor(v)],
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="space-y-1.5 text-sm text-slate-100">
                <div className="text-base font-bold text-slate-100">{v.name}</div>
                {v.address && <div className="text-slate-400">{v.address}</div>}
                <div className="flex flex-wrap gap-1 pt-1">
                  {!v.ticketRequired && <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-xs text-green-300 ring-1 ring-inset ring-green-500/30">Gratis</span>}
                  {v.ticketRequired && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-300 ring-1 ring-inset ring-amber-500/30">Billett</span>}
                  {v.indoorViewing && v.outdoorViewing && <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30">Inne + ute</span>}
                  {v.indoorViewing && !v.outdoorViewing && <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30">🌧️ Under tak</span>}
                  {!v.indoorViewing && v.outdoorViewing && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-300 ring-1 ring-inset ring-amber-500/30">☀️ Kun ute</span>}
                  {v.ageLimit !== null && <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-[var(--border)]">{v.ageLimit}+ år</span>}
                  {v.alcohol && <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-[var(--border)]">Alkohol</span>}
                  {v.showsAllMatches && <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-[var(--border)]">Alle kamper</span>}
                  {v.familyFriendly && <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30">Familievennlig</span>}
                </div>
                <div className="flex gap-3 pt-2 text-xs">
                  <a className="font-medium text-red-400 hover:text-red-300" href={v.website} target="_blank" rel="noreferrer">
                    Nettside →
                  </a>
                  <a
                    className="font-medium text-red-400 hover:text-red-300"
                    href={directionsUrl(userLocation, { lat: v.lat!, lng: v.lng! })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Veibeskrivelse →
                  </a>
                  {!userLocation && (
                    <a className="font-medium text-red-400 hover:text-red-300" href={googleMapsUrl(v.address, v.name)} target="_blank" rel="noreferrer">
                      Maps →
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ) : null,
      )}
    </MapContainer>
  );
}
