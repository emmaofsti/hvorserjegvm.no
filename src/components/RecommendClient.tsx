"use client";

import { useState } from "react";
import type { Venue } from "@/lib/types";
import { recommend } from "@/lib/score";
import VenueCard from "./VenueCard";
import VenueDrawer from "./VenueDrawer";
import { Toggle, Select, Button } from "./ui";
import { Icon } from "./icons";

export default function RecommendClient({ venues }: { venues: Venue[] }) {
  const [alcohol, setAlcohol] = useState(true);
  const [family, setFamily] = useState(false);
  const [free, setFree] = useState(true);
  const [maxKm, setMaxKm] = useState(3);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState<ReturnType<typeof recommend> | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

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
    <div className="mx-auto max-w-4xl px-4 py-5 sm:py-8">
      <header className="mb-6">
        <p className="eyebrow mb-2">Smart-anbefaling</p>
        <h1 className="display display-md text-slate-50">Hvor bør jeg se kampen?</h1>
        <p className="mt-3 text-[15px] text-slate-400">
          Fortell oss hva du vil ha, så foreslår vi de beste stedene for deg.
        </p>
      </header>

      <section
        className="lg-surface space-y-5 p-5 sm:p-6"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <div className="flex flex-wrap gap-2">
          <Toggle
            label={<><Icon.Wine size={14} strokeWidth={2} /> Jeg vil ha alkohol</>}
            checked={alcohol}
            onChange={setAlcohol}
          />
          <Toggle
            label={<><Icon.Baby size={14} strokeWidth={2} /> Familievennlig</>}
            checked={family}
            onChange={setFamily}
          />
          <Toggle
            label={<><Icon.Free size={14} strokeWidth={2.2} /> Gratis inngang</>}
            checked={free}
            onChange={setFree}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="eyebrow !mb-1 block">
            Maks avstand fra deg
            <Select value={maxKm} onChange={(e) => setMaxKm(Number(e.target.value))} className="mt-1.5">
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
                <Icon.MapPin size={14} strokeWidth={2.4} /> Bruk min posisjon
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-300/90">
                <Icon.MapPin size={13} strokeWidth={2.2} /> Posisjon delt
              </span>
            )}
          </div>
        </div>

        <div>
          <Button onClick={run}>
            <Icon.Sparkles size={14} strokeWidth={2.2} /> Anbefal meg et sted
          </Button>
        </div>
      </section>

      {result && (
        <section className="mt-7 space-y-4">
          <h2 className="display display-sm text-slate-100">Topp <span className="tnum">{top.length}</span> for deg</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {top.map((r) => (
              <div key={r.venue.id} className="space-y-2">
                <VenueCard
                  venue={r.venue}
                  userLocation={location}
                  onSelect={setSelectedVenue}
                />
                {r.reasons.length > 0 && (
                  <div className="px-1 text-[12px] text-slate-500">
                    Grunner: {r.reasons.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <VenueDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </div>
  );
}
