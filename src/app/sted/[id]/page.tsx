import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVenue, getVenues } from "@/lib/data";
import type { Category, Venue } from "@/lib/types";
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
  const title = `${venue.name} — VM 2026 i Oslo`;
  const url = `https://hvorserjegvm.no/sted/${venue.id}`;
  return {
    title,
    description: venue.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: venue.description,
      type: "website",
      url,
      images: venue.imageUrl ? [venue.imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: venue.description,
      images: venue.imageUrl ? [venue.imageUrl] : undefined,
    },
  };
}

/* Schema.org-type per kategori — gir Google riktig rich-result-mulighet
   (LocalBusiness-varianter for steder med adresse, Place for fan zones
   som ikke er en bedrift). */
const SCHEMA_TYPE: Record<Category, string> = {
  fan_zone: "Place",
  sports_bar: "BarOrPub",
  pub: "BarOrPub",
  restaurant: "Restaurant",
  street_food: "FoodEstablishment",
};

function buildVenueSchema(venue: Venue) {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[venue.category],
    name: venue.name,
    description: venue.description,
    url: venue.website,
    image: venue.imageUrl,
    address: venue.address
      ? {
          "@type": "PostalAddress",
          streetAddress: venue.address,
          addressLocality: venue.neighborhood ?? "Oslo",
          addressCountry: "NO",
        }
      : undefined,
    geo:
      venue.lat != null && venue.lng != null
        ? { "@type": "GeoCoordinates", latitude: venue.lat, longitude: venue.lng }
        : undefined,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) notFound();
  return (
    <>
      <VenueDetailClient venue={venue} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildVenueSchema(venue)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
