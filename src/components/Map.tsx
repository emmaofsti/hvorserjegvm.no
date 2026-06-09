"use client";

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Venue } from "@/lib/types";
import { venueMarkerColor, directionsUrl, googleMapsUrl } from "@/lib/utils";
import { vmScore } from "@/lib/score";
import { Icon } from "./icons";

const colorHex: Record<"green" | "yellow" | "blue" | "red", string> = {
  green: "#16a34a",
  yellow: "#ca8a04",
  blue: "#2563eb",
  red: "#dc2626",
};

function createScoreIcon(score: number, color: string, highlighted: boolean): L.DivIcon {
  const size = highlighted ? 42 : 34;
  const fontSize = highlighted ? 14 : 12;
  const shadow = highlighted ? "0 0 0 4px rgba(255,255,255,0.3)," : "";
  return L.divIcon({
    className: "vmoslo-score-marker",
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:2.5px solid #fff;
      box-shadow:${shadow}0 2px 8px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:${fontSize}px;font-weight:700;color:#fff;
      font-family:var(--font-geist-sans),system-ui,sans-serif;
      font-variant-numeric:tabular-nums;
      transition:transform 150ms ease, box-shadow 150ms ease;
      ${highlighted ? "transform:scale(1.15);z-index:1000!important;" : ""}
    ">${score}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

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
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Du er her</Popup>
        </Marker>
      )}
      {venues.map((v) =>
        v.lat && v.lng ? (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={createScoreIcon(
              vmScore(v).total,
              colorHex[venueMarkerColor(v)],
              highlightId === v.id,
            )}
          >
            <Popup>
              <div className="space-y-2 text-[13px] text-slate-100">
                <div>
                  <div className="text-[15px] font-bold tracking-tight text-slate-50">{v.name}</div>
                  {v.address && <div className="mt-0.5 text-[12px] text-slate-400">{v.address}</div>}
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {!v.ticketRequired && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200 ring-1 ring-inset ring-emerald-400/25">
                      <Icon.Free size={11} strokeWidth={2.2} /> Gratis
                    </span>
                  )}
                  {v.ticketRequired && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-200 ring-1 ring-inset ring-amber-400/30">
                      <Icon.Ticket size={11} strokeWidth={2.2} /> Billett
                    </span>
                  )}
                  {v.beerPrice !== null && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-200 ring-1 ring-inset ring-white/[0.10]">
                      <Icon.Beer size={11} strokeWidth={2} /> <span className="tnum">{v.beerPrice}</span> kr
                    </span>
                  )}
                  {v.indoorViewing && v.outdoorViewing && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-200 ring-1 ring-inset ring-sky-400/25">
                      <Icon.CloudSun size={11} strokeWidth={2} /> Inne + ute
                    </span>
                  )}
                  {v.indoorViewing && !v.outdoorViewing && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-200 ring-1 ring-inset ring-sky-400/25">
                      <Icon.Umbrella size={11} strokeWidth={2} /> Under tak
                    </span>
                  )}
                  {!v.indoorViewing && v.outdoorViewing && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-200 ring-1 ring-inset ring-amber-400/30">
                      <Icon.Sun size={11} strokeWidth={2} /> Kun ute
                    </span>
                  )}
                  {v.ageLimit !== null && (
                    <span className="lg-capsule inline-flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-inset ring-white/[0.08]">
                      <span className="tnum">{v.ageLimit}</span>+ år
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[12px]">
                  <a className="inline-flex items-center gap-1 font-medium text-red-300 hover:text-red-200" href={v.website} target="_blank" rel="noreferrer">
                    Nettside <Icon.ExternalLink size={11} strokeWidth={2.2} />
                  </a>
                  <a
                    className="inline-flex items-center gap-1 font-medium text-red-300 hover:text-red-200"
                    href={directionsUrl(userLocation, { lat: v.lat!, lng: v.lng! })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon.Navigation size={11} strokeWidth={2.2} /> Veibeskrivelse
                  </a>
                  {!userLocation && (
                    <a className="inline-flex items-center gap-1 font-medium text-red-300 hover:text-red-200" href={googleMapsUrl(v.address, v.name)} target="_blank" rel="noreferrer">
                      <Icon.MapPin size={11} strokeWidth={2.2} /> Maps
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ) : null,
      )}
    </MapContainer>
  );
}
