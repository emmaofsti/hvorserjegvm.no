import Link from "next/link";
import type { Match } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Icon } from "./icons";

export default function NorwayMatchBanner({ match }: { match: Match }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-5 sm:pt-6">
      <Link
        href={`/kamp/${match.slug}`}
        className="lg-surface lg-energize flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-red-500/[0.07] border border-red-400/25 hover:bg-red-500/[0.11] transition-colors"
        style={{ borderRadius: "var(--lg-r-xl)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            🇳🇴
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-red-300 mb-0.5">
              Norge spiller {formatDate(match.date)} kl. {match.kickoff}
            </p>
            <p className="text-[15px] sm:text-[16px] font-semibold text-slate-50">
              {match.home} mot {match.away} — se hvor du kan se kampen
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-300 shrink-0">
          Se steder
          <Icon.ChevronRight size={13} strokeWidth={2.4} />
        </span>
      </Link>
    </div>
  );
}
