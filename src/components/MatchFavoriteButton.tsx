"use client";

import { useFavoriteMatches } from "@/lib/useFavoriteMatches";
import { Icon } from "./icons";

export default function MatchFavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteMatches();
  const fav = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      className={`lg-capsule lg-energize inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium ${
        fav
          ? "lg-glass-accent"
          : "bg-white/[0.04] border border-white/[0.10] text-slate-200 hover:bg-white/[0.08]"
      }`}
      aria-label={fav ? "Fjern fra favoritter" : "Legg til som favoritt"}
    >
      <Icon.Heart size={14} strokeWidth={2.2} fill={fav ? "currentColor" : "none"} />
      {fav ? "Favoritt" : "Lagre"}
    </button>
  );
}
