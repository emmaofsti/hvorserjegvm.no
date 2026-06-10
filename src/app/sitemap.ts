import type { MetadataRoute } from "next";
import { getVenues, getMatches } from "@/lib/data";
import { GUIDES } from "@/lib/guides";

const BASE = "https://hvorserjegvm.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const venues = getVenues();
  const matches = getMatches();

  const root: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/kamper`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/billigst-ol`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/favoritter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/om`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/endre`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/personvern`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* Guide pages — high priority on the primary-keyword landing, slightly
     lower on niche topics. Google uses priority within a sitemap, not
     across sites, so the relative ordering matters. */
  const guideUrls: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${BASE}/guide/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: g.slug === "hvor-se-vm-i-oslo" ? 0.95 : 0.75,
  }));

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

  return [...root, ...guideUrls, ...venueUrls, ...matchUrls];
}

