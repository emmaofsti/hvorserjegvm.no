import type { MetadataRoute } from "next";
import { getVenues, getMatches } from "@/lib/data";

const BASE = "https://hvorserjegvm.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const venues = getVenues();
  const matches = getMatches();

  const root: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/kamper`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/billigst-ol`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/favoritter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/personvern`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const venueUrls: MetadataRoute.Sitemap = venues.map((v) => ({
    url: `${BASE}/sted/${v.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const matchUrls: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${BASE}/kamp/${m.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: m.norwayMatch ? 0.95 : 0.6,
  }));

  return [...root, ...venueUrls, ...matchUrls];
}

