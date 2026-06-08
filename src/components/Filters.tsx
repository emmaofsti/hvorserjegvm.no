"use client";

import { useState } from "react";
import { Toggle, Select, SectionTitle } from "./ui";
import type { AgeFilter, FilterState } from "@/lib/types";

interface FiltersProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  hasLocation: boolean;
}

export default function Filters({ state, onChange, hasLocation }: FiltersProps) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...state, [k]: v });

  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Hva vil du ha</SectionTitle>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Toggle label="Gratis inngang" checked={state.freeOnly} onChange={(v) => set("freeOnly", v)} />
          <Toggle label="Alkohol" checked={state.alcohol} onChange={(v) => set("alcohol", v)} />
          <Toggle label="Familievennlig" checked={state.familyFriendly} onChange={(v) => set("familyFriendly", v)} />
          <Toggle label="🌧️ Under tak" checked={state.indoor} onChange={(v) => set("indoor", v)} />
          <Toggle label="☀️ Ute" checked={state.outdoor} onChange={(v) => set("outdoor", v)} />
        </div>
        {/* Beer price chips — horizontally scrollable on mobile */}
        <div className="mt-3 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible text-sm text-slate-300">
            <span className="shrink-0 text-slate-400">🍺 Maks:</span>
            {[
              { v: null, l: "Alle" },
              { v: 80, l: "80 kr" },
              { v: 100, l: "100 kr" },
              { v: 120, l: "120 kr" },
              { v: 140, l: "140 kr" },
            ].map((opt) => (
              <button
                key={opt.l}
                type="button"
                onClick={() => set("maxBeerPrice", opt.v)}
                className={
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-all duration-150 active:scale-95 " +
                  (state.maxBeerPrice === opt.v
                    ? "border-red-500/50 bg-red-500/10 text-red-200"
                    : "border-[var(--border)] bg-[var(--bg-subtle)] text-slate-300 hover:bg-[var(--border)]")
                }
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Hvilke kamper</SectionTitle>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Toggle label="Alle kamper" checked={state.allMatches} onChange={(v) => set("allMatches", v)} />
          <Toggle label="Kun Norges kamper" checked={state.norwayOnly} onChange={(v) => set("norwayOnly", v)} />
          <Toggle label="Krever billett" checked={state.ticketed} onChange={(v) => set("ticketed", v)} />
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200 active:bg-[var(--bg-surface)]"
          aria-expanded={open}
        >
          <span className="transition-transform duration-200" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
          Flere filtre
        </button>

        {open && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-400">
              Kategori
              <Select
                value={state.category}
                onChange={(e) => set("category", e.target.value as FilterState["category"])}
                className="mt-1"
              >
                <option value="all">Alle</option>
                <option value="fan_zone">Fan zone / storarrangement</option>
                <option value="sports_bar">Sportsbar</option>
                <option value="pub">Pub</option>
                <option value="restaurant">Restaurant</option>
                <option value="street_food">Streetfood / mathall</option>
              </Select>
            </label>
            <label className="text-xs text-slate-400">
              Aldersgrense
              <Select
                value={state.age}
                onChange={(e) => set("age", e.target.value as AgeFilter)}
                className="mt-1"
              >
                <option value="all">Alle</option>
                <option value="no_limit">Ingen aldersgrense / familievennlig</option>
                <option value="max_18">Maks 18 år</option>
                <option value="max_20">Maks 20 år</option>
              </Select>
            </label>
            <label className="text-xs text-slate-400">
              Maks gangtid {hasLocation ? "" : "(krever posisjon)"}
              <Select
                value={state.maxMinutesAway ?? ""}
                onChange={(e) => set("maxMinutesAway", e.target.value ? Number(e.target.value) : null)}
                disabled={!hasLocation}
                className="mt-1"
              >
                <option value="">Ingen begrensning</option>
                <option value="5">Under 5 min</option>
                <option value="10">Under 10 min</option>
                <option value="15">Under 15 min</option>
                <option value="30">Under 30 min</option>
              </Select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
