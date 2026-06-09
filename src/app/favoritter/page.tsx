import FavoritesClient from "@/components/FavoritesClient";
import { getVenues, getMatches } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritter",
  description: "Dine lagrede steder og kamper for VM 2026 i Oslo.",
};

export default function FavoritterPage() {
  return <FavoritesClient venues={getVenues()} matches={getMatches()} />;
}
