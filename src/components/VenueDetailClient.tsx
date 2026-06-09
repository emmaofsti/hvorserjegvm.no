"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import VenueDetailBody from "./VenueDetailBody";
import { Icon } from "./icons";

export default function VenueDetailClient({ venue }: { venue: Venue }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
      <Link
        href="/"
        className="lg-capsule lg-energize mb-6 inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-100"
      >
        <Icon.ChevronRight size={13} strokeWidth={2.4} style={{ transform: "rotate(180deg)" }} />
        Tilbake til alle steder
      </Link>
      <VenueDetailBody venue={venue} context="page" />
    </div>
  );
}
