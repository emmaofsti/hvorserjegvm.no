"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Match, Stage } from "@/lib/types";
import { formatKickoff } from "@/lib/utils";
import { Input, Select, Card, CardBody, Badge } from "./ui";

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
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <header className="mb-4 sm:mb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-3xl">VM-kamper 2026</h1>
        <p className="mt-1 text-sm text-slate-400">
          Alle 104 kamper i norsk tid. Klikk på en kamp for å se hvor du kan se den i Oslo.
        </p>
      </header>

      {/* Filters — stacked on mobile, row on desktop */}
      <section className="mb-4 sm:mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <Input placeholder="Søk på land…" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <label className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-3 text-sm text-slate-200">
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
            <h2 className="sticky top-[49px] sm:top-[57px] z-10 -mx-3 sm:-mx-4 mb-2 bg-[var(--bg-page)]/85 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-lg">
              {new Date(`${date}T12:00:00+02:00`).toLocaleDateString("no-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ms.map((m) => (
                <Link key={m.id} href={`/kamp/${m.slug}`} className="block group">
                  <Card className="transition-all duration-150 hover:border-[var(--border-strong)] group-active:scale-[0.98]">
                    <CardBody className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-slate-400">
                          {formatKickoff(m.date, m.kickoff)}
                        </span>
                        <div className="flex items-center gap-1">
                          {m.norwayMatch && <Badge tone="red">🇳🇴 Norge</Badge>}
                          <Badge tone="zinc">{m.stage}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-base font-semibold text-slate-100 sm:text-lg">
                        <span className="truncate">{m.home}</span>
                        <span className="shrink-0 text-slate-500">vs</span>
                        <span className="truncate text-right">{m.away}</span>
                      </div>
                      {m.group && (
                        <div className="text-xs text-slate-500">Gruppe {m.group}</div>
                      )}
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-slate-400">
            Ingen kamper matcher filtrene.
          </div>
        )}
      </section>
    </div>
  );
}
