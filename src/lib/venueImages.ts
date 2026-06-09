/**
 * Venue image mapping.
 *
 * Primary source: scraped og:image from each venue's website
 * (see scripts/scrape-venue-images.mjs → venueImagesScraped.json).
 * Fallback for venues without og:image: category-specific Unsplash placeholder.
 *
 * Re-run the scraper to refresh: node scripts/scrape-venue-images.mjs
 */
import scraped from "./venueImagesScraped.json";

const scrapedTyped = scraped as Record<string, string>;

// Per-venue overrides for cases where scraping returned a poor result
// (e.g. only a favicon, or the wrong promo image).
const manualOverrides: Record<string, string> = {
  // Both Fotballfesten venues share the same hero — Ullevaal stadium image
  // (kongens-gate-fotballfesten reuses Ullevaal's promotional image)
};

// Category fallback for venues with no own image (fan zones with weak sites,
// places that block scraping, etc.)
const categoryFallbacks: Record<string, string> = {
  fan_zone:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  sports_bar:
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=600&h=400&fit=crop",
  pub:
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  street_food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
};

export function getVenueImageUrl(venueId: string, category: string): string {
  return (
    manualOverrides[venueId] ??
    scrapedTyped[venueId] ??
    categoryFallbacks[category] ??
    categoryFallbacks.pub
  );
}
