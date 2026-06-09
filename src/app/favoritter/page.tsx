import FavoritesClient from "@/components/FavoritesClient";
import { getVenues } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritter",
  description: "Dine lagrede steder for å se VM 2026 i Oslo.",
};

export default function FavoritterPage() {
  const venues = getVenues();
  return <FavoritesClient venues={venues} />;
}
