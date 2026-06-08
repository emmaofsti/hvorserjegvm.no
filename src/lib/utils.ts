import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function walkingMinutes(km: number): number {
  return Math.round((km / 5) * 60);
}

export function formatKickoff(date: string, kickoff: string): string {
  const d = new Date(`${date}T${kickoff}:00+02:00`);
  return d.toLocaleString("no-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatKickoffShort(date: string, kickoff: string): string {
  const d = new Date(`${date}T${kickoff}:00+02:00`);
  return d.toLocaleString("no-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00+02:00`);
  return d.toLocaleDateString("no-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function venueMarkerColor(v: {
  ticketRequired: boolean;
  familyFriendly: boolean | null;
  category: string;
}): "green" | "yellow" | "blue" | "red" {
  if (v.category === "fan_zone") return "red";
  if (v.familyFriendly) return "blue";
  if (v.ticketRequired) return "yellow";
  return "green";
}

export function googleMapsUrl(address: string | null, name: string): string {
  const q = encodeURIComponent(address ?? `${name}, Oslo`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function directionsUrl(
  from: { lat: number; lng: number } | null,
  to: { lat: number; lng: number },
): string {
  const dest = `${to.lat},${to.lng}`;
  if (!from) return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${dest}`;
}
