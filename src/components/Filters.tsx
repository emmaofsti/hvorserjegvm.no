"use client";

import { useState } from "react";
import { Toggle, Select, SectionTitle } from "./ui";
import { Icon } from "./icons";
import type { AgeFilter, FilterState } from "@/lib/types";

interface FiltersProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  hasLocation: boolean;
}

const IconSize = 14;

export default function Filters({ state, onChange, hasLocation }: FiltersProps) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...state, [k]: v });

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle>Hva vil du ha</SectionTitle>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Toggle
            label={<><Icon.Free size={IconSize} strokeWidth={2.2} /> Gratis</>}
            checked={state.freeOnly}
            onChange={(v) => set("freeOnly", v)}
          />
          <Toggle
            label={<><Icon.Wine size={IconSize} strokeWidth={2} /> Alkohol</>}
            checked={state.alcohol}
            onChange={(v) => set("alcohol", v)}
          />
          <Toggle
            label={<><Icon.Baby size={IconSize} strokeWidth={2} /> Familievennlig</>}
            checked={state.familyFriendly}
            onChange={(v) => set("familyFriendly", v)}
          />
          <Toggle
            label={<><Icon.Umbrella size={IconSize} strokeWidth={2} /> Under tak</>}
            checked={state.indoor}
            onChange={(v) => set("indoor", v)}
          />
          <Toggle
            label={<><Icon.Sun size={IconSize} strokeWidth={2} /> Ute</>}
            checked={state.outdoor}
            onChange={(v) => set("outdoor", v)}
          />
        </div>

        {/* Beer price chips */}
        <div className="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible text-sm">
            <span className="shrink-0 inline-flex items-center gap-1.5 text-slate-400">
              <Icon.Beer size={15} strokeWidth={2} /> Maks:
            </span>
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
                  "lg-capsule lg-energize shrink-0 px-3 py-1.5 text-[12.5px] font-medium " +
                  (state.maxBeerPrice === opt.v
                    ? "lg-glass-accent"
                    : "bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/[0.07]")
                }
              >
                <span className="tnum">{opt.l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Hvilke kamper</SectionTitle>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Toggle
            label="Alle kamper"
            checked={state.allMatches}
            onChange={(v) => set("allMatches", v)}
          />
          <Toggle
            label="Kun Norges kamper"
            checked={state.norwayOnly}
            onChange={(v) => set("norwayOnly", v)}
          />
          <Toggle
            label={<><Icon.Ticket size={IconSize} strokeWidth={2} /> Krever billett</>}
            checked={state.ticketed}
            onChange={(v) => set("ticketed", v)}
          />
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="lg-capsule lg-energize flex items-center gap-1.5 px-3 py-1.5 eyebrow !mb-0 hover:bg-white/[0.06] hover:text-slate-200"
          aria-expanded={open}
        >
          <Icon.ChevronRight
            size={12}
            strokeWidth={2.4}
            className="transition-transform duration-200"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
          Flere filtre
        </button>

        {open && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="eyebrow !mb-1 block">
              Kategori
              <Select
                value={state.category}
                onChange={(e) => set("category", e.target.value as FilterState["category"])}
                className="mt-1.5"
              >
                <option value="all">Alle</option>
                <option value="fan_zone">Fan zone / storarrangement</option>
                <option value="sports_bar">Sportsbar</option>
                <option value="pub">Pub</option>
                <option value="restaurant">Restaurant</option>
                <option value="street_food">Streetfood / mathall</option>
              </Select>
            </label>
            <label className="eyebrow !mb-1 block">
              Aldersgrense
              <Select
                value={state.age}
                onChange={(e) => set("age", e.target.value as AgeFilter)}
                className="mt-1.5"
              >
                <option value="all">Alle</option>
                <option value="no_limit">Ingen aldersgrense / familievennlig</option>
                <option value="max_18">Maks 18 år</option>
                <option value="max_20">Maks 20 år</option>
              </Select>
            </label>
            <label className="eyebrow !mb-1 block">
              Min. kapasitet
              <Select
                value={state.minCapacity ?? ""}
                onChange={(e) => set("minCapacity", e.target.value ? Number(e.target.value) : null)}
                className="mt-1.5"
              >
                <option value="">Alle størrelser</option>
                <option value="100">Minst 100 plasser</option>
                <option value="300">Minst 300 plasser</option>
                <option value="500">Minst 500 plasser</option>
                <option value="1000">Minst 1000 plasser</option>
              </Select>
            </label>
            <label className="eyebrow !mb-1 block">
              Maks gangtid {hasLocation ? "" : "(krever posisjon)"}
              <Select
                value={state.maxMinutesAway ?? ""}
                onChange={(e) => set("maxMinutesAway", e.target.value ? Number(e.target.value) : null)}
                disabled={!hasLocation}
                className="mt-1.5"
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
