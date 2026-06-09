"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { formatKickoff } from "@/lib/utils";
import { Input, Select, Card, CardBody, Badge } from "./ui";
import { Icon } from "./icons";

const STAGES: ("Alle" | Stage)[] = [
  "Alle",
  "Gruppespill",
  "16-delsfinale",
  "8-delsfinale",
  "Kvartfinale",
  "Semifinale",
  "Bronsefinale",
  "Finale",
];

const BIG_TEAMS = new Set([
  "Norge", "Brasil", "Argentina", "England", "Frankrike",
  "Spania", "Tyskland", "Nederland", "Portugal", "Italia",
  "Belgia", "Kroatia", "Uruguay",
]);

const HIGH_DEMAND_STAGES = new Set<Stage>([
  "Kvartfinale", "Semifinale", "Bronsefinale", "Finale",
]);

function isHighDemand(m: Match): boolean {
  if (m.norwayMatch) return true;
  if (HIGH_DEMAND_STAGES.has(m.stage)) return true;
  if (m.isOpener) return true;
  const hasBigTeam = BIG_TEAMS.has(m.home) || BIG_TEAMS.has(m.away);
  const bothBig = BIG_TEAMS.has(m.home) && BIG_TEAMS.has(m.away);
  if (bothBig) return true;
  // Big team in knockout = high demand
  if (hasBigTeam && m.stage !== "Gruppespill") return true;
  return false;
}

function groupBy<T, K extends string | number>(arr: T[], fn: (x: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const x of arr) {
    const k = fn(x);
    const v = m.get(k) ?? [];
    v.push(x);
    m.set(k, v);
  }
  return m;
}

export default function MatchesClient({ matches }: { matches: Match[] }) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("Alle");
  const [group, setGroup] = useState<string>("Alle");
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  const now = new Date();

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "Alle" && m.stage !== stage) return false;
      if (group !== "Alle" && m.group !== group) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!m.home.toLowerCase().includes(s) && !m.away.toLowerCase().includes(s)) return false;
      }
      if (upcomingOnly) {
        const matchTime = new Date(`${m.date}T${m.kickoff}:00+02:00`);
        if (matchTime < now) return false;
      }
      return true;
    });
  }, [matches, search, stage, group, upcomingOnly, now]);

  const byDate = useMemo(() => {
    const m = groupBy(filtered, (x) => x.date);
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const groups = ["Alle", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="eyebrow mb-2">Kampprogram</p>
        <h1 className="display display-md sm:display-lg text-slate-50">VM-kamper 2026</h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-400">
          Alle <span className="tnum font-medium text-slate-200">104</span> kamper i norsk tid. Klikk på en kamp for å
          finne hvor du kan se den i Oslo.
        </p>
      </header>

      {/* Filters — matte panel */}
      <section
        className="lg-surface mb-6 p-5 sm:p-6"
        style={{ borderRadius: "var(--lg-r-xxl)" }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-3">
          <div className="relative">
            <Icon.Search size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <Input
              placeholder="Søk på land…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11"
            />
          </div>
          <Select value={stage} onChange={(e) => setStage(e.target.value as (typeof STAGES)[number])}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select value={group} onChange={(e) => setGroup(e.target.value)}>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g === "Alle" ? "Alle grupper" : `Gruppe ${g}`}
              </option>
            ))}
          </Select>
          <label
            className="flex min-h-[44px] cursor-pointer items-center gap-2 px-4 text-sm text-slate-200 bg-white/[0.03] border border-white/[0.08]"
            style={{ borderRadius: "var(--lg-r-l)" }}
          >
            <input
              type="checkbox"
              checked={upcomingOnly}
              onChange={(e) => setUpcomingOnly(e.target.checked)}
              className="h-4 w-4 accent-red-600"
            />
            Kommende
          </label>
        </div>
      </section>

      {/* Match list */}
      <section className="space-y-5 sm:space-y-6">
        {byDate.map(([date, ms]) => (
          <div key={date}>
            <div className="sticky top-[52px] sm:top-[60px] z-10 -mx-4 mb-4 px-4">
              <h2 className="lg-glass-heavy lg-capsule inline-flex items-center gap-2 px-4 py-1.5 eyebrow !mb-0">
                <Icon.CalendarDays size={12} strokeWidth={2.2} />
                {new Date(`${date}T12:00:00+02:00`).toLocaleDateString("no-NO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ms.map((m) => (
                <Link key={m.id} href={`/kamp/${m.slug}`} className="block group">
                  <Card>
                    <CardBody className="space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="tnum text-[13px] font-medium text-slate-400">
                          {formatKickoff(m.date, m.kickoff)}
                        </span>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          {m.norwayMatch && <Badge tone="red">🇳🇴 Norge</Badge>}
                          {isHighDemand(m) && (
                            <Badge tone="yellow">
                              <Icon.Flame size={12} strokeWidth={2} /> Høy
                            </Badge>
                          )}
                          <Badge tone="zinc">{m.stage}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                        <span className="truncate">{m.home}</span>
                        <span className="shrink-0 eyebrow !mb-0">vs</span>
                        <span className="truncate text-right">{m.away}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[12px] text-slate-500">
                        <span>{m.group ? `Gruppe ${m.group}` : ""}</span>
                        {m.tvChannel && (
                          <span className="inline-flex items-center gap-1.5 text-slate-400">
                            <Icon.Tv size={12} strokeWidth={2} />
                            <span>{m.tvChannel}</span>
                          </span>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="lg-surface p-12 text-center"
            style={{ borderRadius: "var(--lg-r-xxl)" }}
          >
            <Icon.Filter size={28} strokeWidth={1.5} className="mx-auto mb-3 text-slate-500" />
            <p className="text-[15px] text-slate-300">Ingen kamper matcher filtrene.</p>
          </div>
        )}
      </section>
    </div>
  );
}
