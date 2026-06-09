/**
 * Venue image resolver.
 *
 * Priority chain:
 *   1. manualOverrides — curated photos found on venue's website (gallery pages)
 *   2. scrapedTyped    — og:image from venue's main page (autoscraped)
 *      → unless venue is in skipScrapedLogo (the scrape returned a logo/favicon)
 *   3. unsplash-by-category — multiple photos per category, picked deterministically
 *
 * Re-run scraper: node scripts/scrape-venue-images.mjs
 */
import scraped from "./venueImagesScraped.json";

const scrapedTyped = scraped as Record<string, string>;

/** Squarespace and many WP hosts serve over both http and https — force https. */
function ensureHttps(url: string): string {
  if (url.startsWith("http://")) return "https://" + url.slice(7);
  return url;
}

/**
 * Curated photos found on each venue's own gallery/about page.
 * These beat anything else.
 */
const manualOverrides: Record<string, string> = {
  // Fan zones (the og:image scrape failed for these — their landing pages
  // are JS-rendered or don't expose og:image)
  "fotball-i-parken":
    "https://cdn.prod.website-files.com/6909dfabc111725a3656f965/6914a6197ebd9dc1444e4b70_fotballiparken_02.avif",
  "fotball-pa-jordal":
    "https://www.fotballpajordal.no/media/hero-med-lys.png",
  "vippa":
    "https://cdn.prod.website-files.com/69a86ebfd9f90927de027b3d/69ba93eb3c55bbd26716b8db_NIC_8744.webp",
  // Bars — better gallery photos than scraped logos
  "bernies":
    "https://bernies.no/wp-content/uploads/2021/08/bar.jpg",
  "pokalen-vulkan":
    "https://pokalenpub.no/wp-content/uploads/2022/10/P1944831-1-1024x768.jpg",
};

/**
 * Venues whose autoscraped og:image is actually a logo, favicon or PNG icon.
 * Forcing them to use the category Unsplash fallback gives a much better look
 * than a stretched 180×180 transparent PNG on a 16:10 card.
 */
const skipScrapedLogo = new Set<string>([
  "taket-steen-strom",
  "beer-palace",
  "hasle-linie-gastropub",
  "dubliner",
  "haandtryk",
  "lannisters",
  "o-reillys",
  "bohemen",
  "sentralpuben",
  "vesper",
  "lincoln-sportsbar",
  "tgi-fridays-city",
  "o-learys-vika",
]);

/**
 * Multiple Unsplash photos per category — picked deterministically by venue id
 * so each venue stays consistent across reloads, but neighbors don't repeat.
 */
const unsplashByCategory: Record<string, string[]> = {
  fan_zone: [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop&q=80",
  ],
  sports_bar: [
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1530036846422-cea8c9a30fdb?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1593069567131-53a0614dde1d?w=800&h=500&fit=crop&q=80",
  ],
  pub: [
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583589811107-1b27e4c2e9e7?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=800&h=500&fit=crop&q=80",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&q=80",
  ],
  street_food: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542528180-1c2803fef89b?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=500&fit=crop&q=80",
  ],
};

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickVariation(id: string, urls: string[]): string {
  if (urls.length === 0) return "";
  return urls[hash(id) % urls.length];
}

export function getVenueImageUrl(venueId: string, category: string): string {
  const manual = manualOverrides[venueId];
  if (manual) return ensureHttps(manual);

  const fromScrape = scrapedTyped[venueId];
  if (fromScrape && !skipScrapedLogo.has(venueId)) return ensureHttps(fromScrape);

  const pool = unsplashByCategory[category] ?? unsplashByCategory.pub;
  return pickVariation(venueId, pool);
}
