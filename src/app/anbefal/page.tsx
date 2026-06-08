import type { Metadata } from "next";
import RecommendClient from "@/components/RecommendClient";
import { getVenues } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hvor bør jeg se kampen?",
  description:
    "Smart anbefaling av VM-sted i Oslo basert på alkohol, familievennlig, gratis og maks avstand.",
  alternates: { canonical: "https://hvorserjegvm.no/anbefal" },
};

export default function Page() {
  return <RecommendClient venues={getVenues()} />;
}
