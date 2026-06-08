import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RecommendClient from "@/components/RecommendClient";
import { getCities, getCity, getVenuesForCity } from "@/lib/data";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Anbefal" };
  return {
    title: `Hvor bør jeg se kampen i ${city.name}?`,
    description: `Smart anbefaling av VM-sted i ${city.name} basert på alkohol, familievennlig, gratis og maks avstand.`,
    alternates: { canonical: `https://hvorserjegvm.no/${city.slug}/anbefal` },
  };
}

export default async function Page({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  return <RecommendClient venues={getVenuesForCity(city.id)} />;
}
