/**
 * Venue image resolver.
 *
 * Priority chain:
 *   1. manualOverrides     — curated images (real venue photos or carefully-
 *                            chosen stock that matches venue character)
 *   2. scrapedTyped        — og:image autoscraped from the venue's own page
 *                            (unless in skipScrapedLogo — favicon/logo)
 *   3. unsplashByCategory  — varied per-category fallback, picked
 *                            deterministically by venue id so neighbors
 *                            don't share the same photo
 */
import scraped from "./venueImagesScraped.json";

const scrapedTyped = scraped as Record<string, string>;

function ensureHttps(url: string): string {
  if (url.startsWith("http://")) return "https://" + url.slice(7);
  return url;
}

/**
 * Curated photo per venue.
 * - Real venue photos (from their own gallery/about pages) are best.
 * - Stock photos here are deliberately chosen to MATCH the venue's vibe
 *   (Irish pub for Old Irish, outdoor crowd for Spikersuppa, etc.) and
 *   are kept unique so they don't repeat with the category pool.
 */
const manualOverrides: Record<string, string> = {
  // ─────────────────────────────────────────────────────────
  // 1) Brukerens egne bilder (i /public/venues/)
  // Disse vinner over alt — det brukeren har lastet opp manuelt.
  // ─────────────────────────────────────────────────────────
  "kongens-gate-fotballfesten": "/venues/kongens-gate-fotballfesten.jpg",
  "ullevaal-stadion-fotballfesten": "/venues/ullevaal-stadion-fotballfesten.jpg",
  "fotball-i-sentrum-spikersuppa": "/venues/fotball-i-sentrum-spikersuppa.jpg",
  "fotballeventyret-grunerhallen": "/venues/fotballeventyret-grunerhallen.jpg",
  "old-irish-majorstuen": "/venues/old-irish-majorstuen.jpg",
  "magneten": "/venues/magneten.jpg",
  "haandtryk": "/venues/haandtryk.jpg",
  "bohemen": "/venues/bohemen.jpg",
  "proud-mary": "/venues/proud-mary.jpg",
  "taket-steen-strom": "/venues/taket-steen-strom.jpg",
  "ost-stadionpub": "/venues/ost-stadionpub.jpg",

  // ─────────────────────────────────────────────────────────
  // 2) Ekte hero-bilder hentet fra venuens egen side
  // ─────────────────────────────────────────────────────────
  "fotball-i-parken":
    "https://cdn.prod.website-files.com/6909dfabc111725a3656f965/6914a6197ebd9dc1444e4b70_fotballiparken_02.avif",
  "fotball-pa-jordal":
    "https://www.fotballpajordal.no/media/hero-med-lys.jpg",
  "lekter-n":
    "https://vmlektern.lovable.app/assets/hero-lektern-B0krEp8T.jpg",
  "vippa":
    "https://cdn.prod.website-files.com/69a86ebfd9f90927de027b3d/69ba93eb3c55bbd26716b8db_NIC_8744.webp",
  "bernies":
    "https://bernies.no/wp-content/uploads/2021/08/bar.jpg",
  "pokalen-vulkan":
    "https://pokalenpub.no/wp-content/uploads/2022/10/P1944831-1-1024x768.jpg",

  // ─────────────────────────────────────────────────────────
  // 3) Curated stock for venuer uten egne bilder
  // ─────────────────────────────────────────────────────────
  "dubliner":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&h=560&fit=crop&q=80",
  "store-sta":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&h=560&fit=crop&q=80",
  "crafty-dog":
    "https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=900&h=560&fit=crop&q=80",
  "panda-restaurant":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=560&fit=crop&q=80",
  "gronland-boulebar":
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&h=560&fit=crop&q=80",
  "beer-palace":
    "https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=900&h=560&fit=crop&q=80",
  "hasle-linie-gastropub":
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&h=560&fit=crop&q=80",
  "lannisters":
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&h=560&fit=crop&q=80",
  "o-reillys":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=560&fit=crop&q=80",
  "sentralpuben":
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=900&h=560&fit=crop&q=80",
  "vesper":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&h=560&fit=crop&q=80",
  "lincoln-sportsbar":
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&h=560&fit=crop&q=80",
  "tgi-fridays-city":
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=560&fit=crop&q=80",
  "o-learys-vika":
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&h=560&fit=crop&q=80",
};

/**
 * Venues whose autoscraped og:image is just a logo/favicon.
 * (Now mostly covered by manualOverrides — left in for safety.)
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
 * Final fallback — varied per-category pools, picked deterministically by id.
 */
const unsplashByCategory: Record<string, string[]> = {
  fan_zone: [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=900&h=560&fit=crop&q=80",
  ],
  sports_bar: [
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1593069567131-53a0614dde1d?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&h=560&fit=crop&q=80",
  ],
  pub: [
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517637382994-f02da38c6728?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=900&h=560&fit=crop&q=80",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&h=560&fit=crop&q=80",
  ],
  street_food: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=560&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=900&h=560&fit=crop&q=80",
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
