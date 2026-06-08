"use client";

import { useState } from "react";
import type { Venue } from "@/lib/types";
import { recommend } from "@/lib/score";
import VenueCard from "./VenueCard";
import { Toggle, Select, Button } from "./ui";

export default function RecommendClient({ venues }: { venues: Venue[] }) {
  const [alcohol, setAlcohol] = useState(true);
  const [family, setFamily] = useState(false);
  const [free, setFree] = useState(true);
  const [maxKm, setMaxKm] = useState(3);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState<ReturnType<typeof recommend> | null>(null);

  const requestLocation = () =>
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    );

  const run = () => {
    const r = recommend(venues, {
      wantsAlcohol: alcohol,
      familyFriendly: family,
      freeOnly: free,
      maxKm,
      userLocation: location,
    });
    setResult(r);
  };

  const top = result?.slice(0, 6) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">Hvor bør jeg se kampen?</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Fortell oss hva du vil ha, så foreslår vi de beste stedene for deg.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
        <div className="flex flex-wrap gap-2">
          <Toggle label="Jeg vil ha alkohol" checked={alcohol} onChange={setAlcohol} />
          <Toggle label="Familievennlig" checked={family} onChange={setFamily} />
          <Toggle label="Gratis inngang" checked={free} onChange={setFree} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs text-slate-400">
            Maks avstand fra deg
            <Select value={maxKm} onChange={(e) => setMaxKm(Number(e.target.value))} className="mt-1">
              <option value={0.5}>500 m</option>
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={20}>Hele Oslo</option>
            </Select>
          </label>
          <div className="flex items-end">
            {!location ? (
              <Button variant="outline" onClick={requestLocation}>
                Bruk min posisjon
              </Button>
            ) : (
              <span className="text-sm text-green-300">📍 Posisjon delt</span>
            )}
          </div>
        </div>

        <div>
          <Button onClick={run}>Anbefal meg et sted</Button>
        </div>
      </section>

      {result && (
        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Topp {top.length} for deg</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {top.map((r) => (
              <div key={r.venue.id} className="space-y-2">
                <VenueCard venue={r.venue} userLocation={location} />
                {r.reasons.length > 0 && (
                  <div className="text-xs text-slate-500">
                    Grunner: {r.reasons.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
