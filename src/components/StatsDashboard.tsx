"use client";

import { useEffect, useState } from "react";
import type { Stats } from "@/lib/ga";
import { Icon } from "./icons";

const DAY_COLORS = ["#EF9F27", "#E24B4A", "#378ADD", "#1D9E75", "#7F77DD"];
const REFRESH_MS = 60_000;

function fmtDur(sec: number): string {
  if (sec < 60) return `${Math.round(sec)} s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}
const nb = (n: number) => n.toLocaleString("nb-NO");

// "YYYYMMDDHH" → { dayKey, hour, label }
function parseHour(dh: string) {
  const y = +dh.slice(0, 4);
  const mo = +dh.slice(4, 6);
  const d = +dh.slice(6, 8);
  const h = +dh.slice(8, 10);
  const date = new Date(y, mo - 1, d);
  const dayLabel = date.toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return { dayKey: dh.slice(0, 8), hour: h, dayLabel };
}

export default function StatsDashboard() {
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [hover, setHover] = useState<{ x: number; label: string; users: number } | null>(null);
  const [period, setPeriod] = useState<"all" | "today">("all");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch(`/api/stats?period=${period}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Feil ${res.status}`);
        const json = (await res.json()) as Stats;
        if (!alive) return;
        setData(json);
        setError(null);
        setUpdated(new Date());
      } catch (e) {
        if (alive) setError((e as Error).message);
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [period]);

  if (error && !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-[14px] text-red-400">
        Klarte ikke å hente statistikk: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-[14px] text-[var(--text-muted)]">
        Laster statistikk…
      </div>
    );
  }

  const t = data.totals;

  // Hour chart: farge per dag + skalering
  const dayKeys = [...new Set(data.hourly.map((p) => p.dateHour.slice(0, 8)))].sort();
  const colorFor = (k: string) => DAY_COLORS[dayKeys.indexOf(k) % DAY_COLORS.length];
  const maxUsers = Math.max(1, ...data.hourly.map((p) => p.users));
  const dayLegend = dayKeys.map((k) => {
    const sample = data.hourly.find((p) => p.dateHour.slice(0, 8) === k)!;
    return { key: k, label: parseHour(sample.dateHour).dayLabel, color: colorFor(k) };
  });

  // Morsomme funn
  const peak = data.hourly.reduce(
    (best, p) => (p.users > best.users ? p : best),
    { dateHour: "", users: 0 },
  );
  const peakInfo = peak.dateHour ? parseHour(peak.dateHour) : null;
  const clicks = data.events.find((e) => e.name === "click")?.count ?? 0;
  const firstTimePct = t.activeUsers
    ? Math.round((t.newUsers / t.activeUsers) * 100)
    : 0;

  const cards = [
    { label: "Nå (30 min)", value: nb(data.realtime.total), icon: Icon.Flame, color: "#E24B4A" },
    { label: "Besøkende", value: nb(t.activeUsers), icon: Icon.Users },
    { label: "Visninger", value: nb(t.views), icon: Icon.Tv },
    { label: "Snitt/økt", value: fmtDur(t.engagementPerSession), icon: Icon.Calendar },
    { label: "Sider/økt", value: t.viewsPerSession.toFixed(1).replace(".", ","), icon: Icon.List },
    { label: "Engasjement", value: `${Math.round(t.engagementRate)}%`, icon: Icon.Sparkles },
  ];

  const facts = [
    {
      icon: Icon.Trophy,
      color: "#EF9F27",
      value: peakInfo ? nb(peak.users) : "–",
      text: peakInfo
        ? `flest samtidig — ${peakInfo.dayLabel} kl ${String(peakInfo.hour).padStart(2, "0")}`
        : "ingen data ennå",
    },
    {
      icon: Icon.Sparkles,
      color: "#378ADD",
      value: `~${Math.round(t.totalEngagedHours)} t`,
      text: "samlet tid alle har brukt på siden",
    },
    {
      icon: Icon.Navigation,
      color: "#1D9E75",
      value: nb(clicks),
      text: "klikk videre til utesteder og kilder",
    },
    {
      icon: Icon.Users,
      color: "#E24B4A",
      value: `${firstTimePct}%`,
      text: "er førstegangsbesøk",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          <h1 className="text-[20px] font-semibold">Statistikk</h1>
        </div>
        <span className="text-[12px] text-[var(--text-muted)]">
          {updated
            ? `Oppdatert ${updated.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · oppdateres automatisk`
            : ""}
        </span>
      </div>

      {/* Periode-bryter */}
      <div className="mb-5 inline-flex rounded-lg border border-white/[0.08] p-0.5 text-[13px]">
        {([["all", "Alle dager"], ["today", "I dag"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              period === key
                ? "bg-red-500 font-medium text-white"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Metric-kort */}
      <div className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => {
          const I = c.icon;
          return (
            <div key={c.label} className="rounded-xl bg-white/[0.04] p-3.5">
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
                <I size={15} style={c.color ? { color: c.color } : undefined} />
                {c.label}
              </div>
              <div className="mt-1 text-[22px] font-semibold tabular-nums">{c.value}</div>
            </div>
          );
        })}
      </div>

      {/* Time for time */}
      <h2 className="mb-2 text-[15px] font-semibold">
        {period === "today"
          ? "Aktive brukere i dag, time for time"
          : "Aktive brukere time for time (siste dager)"}
      </h2>
      <div className="mb-2 flex flex-wrap gap-3 text-[12px] text-[var(--text-muted)]">
        {dayLegend.map((d) => (
          <span key={d.key} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            {d.label}
          </span>
        ))}
      </div>
      <div
        className="relative mb-7 flex h-[200px] items-end gap-[2px] rounded-xl bg-white/[0.02] p-3"
        onMouseLeave={() => setHover(null)}
      >
        {data.hourly.map((p) => {
          const info = parseHour(p.dateHour);
          return (
            <div
              key={p.dateHour}
              className="min-w-0 flex-1 cursor-default rounded-[1px] transition-[filter] hover:brightness-125"
              style={{
                height: `${Math.max((p.users / maxUsers) * 100, 1)}%`,
                background: colorFor(p.dateHour.slice(0, 8)),
              }}
              onMouseEnter={(e) => {
                const row = e.currentTarget.parentElement!.getBoundingClientRect();
                const bar = e.currentTarget.getBoundingClientRect();
                const cx = bar.left - row.left + bar.width / 2;
                setHover({
                  x: Math.min(Math.max(cx, 52), row.width - 52),
                  label: `${info.dayLabel} kl ${String(info.hour).padStart(2, "0")}`,
                  users: p.users,
                });
              }}
            />
          );
        })}
        {hover && (
          <div
            className="pointer-events-none absolute top-1.5 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1.5 text-[12px] text-white shadow-lg"
            style={{ left: hover.x }}
          >
            <span className="text-[14px] font-semibold">{nb(hover.users)}</span> besøkende
            <span className="text-slate-400"> · {hover.label}</span>
          </div>
        )}
      </div>

      {/* Topp sider + kilder */}
      <div className="mb-7 grid grid-cols-1 gap-6 md:grid-cols-2">
        <BarList title="Mest besøkte sider" rows={data.topPages.map((p) => ({ label: p.title, value: p.views }))} color="#E24B4A" />
        <BarList title="Hvor de kommer fra" rows={data.channels.map((c) => ({ label: c.channel, value: c.sessions }))} color="#378ADD" />
      </div>

      {/* Morsomme funn */}
      <h2 className="mb-2.5 text-[15px] font-semibold">Morsomme funn</h2>
      <div className="mb-7 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {facts.map((f, i) => {
          const I = f.icon;
          return (
            <div key={i} className="rounded-xl border border-white/[0.06] p-3.5">
              <div className="flex items-center gap-1.5 text-[20px] font-semibold">
                <I size={18} style={{ color: f.color }} />
                {f.value}
              </div>
              <div className="mt-1 text-[12px] leading-snug text-[var(--text-muted)]">{f.text}</div>
            </div>
          );
        })}
      </div>

      {/* Land */}
      <h2 className="mb-2.5 text-[15px] font-semibold">Besøk per land</h2>
      <div className="flex flex-wrap gap-2">
        {data.countries.map((c) => (
          <span key={c.country} className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[13px]">
            {c.country} <span className="text-[var(--text-muted)]">{nb(c.users)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BarList({
  title,
  rows,
  color,
}: {
  title: string;
  rows: { label: string; value: number }[];
  color: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div>
      <h3 className="mb-2.5 text-[14px] font-medium">{title}</h3>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between gap-2 text-[13px]">
              <span className="truncate">{r.label}</span>
              <span className="shrink-0 text-[var(--text-muted)]">{r.value.toLocaleString("nb-NO")}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05]">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${Math.max((r.value / max) * 100, 2)}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
