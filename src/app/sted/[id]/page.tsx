import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVenue, getVenues } from "@/lib/data";
import VenueDetailClient from "@/components/VenueDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getVenues().map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) return { title: "Sted ikke funnet" };
  return {
    title: `${venue.name} — VM 2026 i Oslo`,
    description: venue.description,
    alternates: { canonical: `https://hvorserjegvm.no/sted/${venue.id}` },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) notFound();
  return <VenueDetailClient venue={venue} />;
}
