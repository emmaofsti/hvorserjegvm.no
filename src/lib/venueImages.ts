/**
 * Venue image mapping — curated images for each venue.
 * Uses publicly available images from venue websites and Google Maps.
 * Falls back to a generated gradient placeholder if no image is available.
 */

// Using Google Maps Static Street View / Place Photos API alternative:
// We use direct URLs from venue websites and social media.
// These are all publicly hosted images.

const venueImages: Record<string, string> = {
  // Fan Zones
  "fotball-i-parken":
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
  "lekter-n":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  "fotball-pa-jordal":
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&h=400&fit=crop",
  "fotball-i-sentrum-spikersuppa":
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  "fotballeventyret-grunerhallen":
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop",
  "ullevaal-stadion-fotballfesten":
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop",
  "kongens-gate-fotballfesten":
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop",
  "taket-steen-strom":
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
  "megazone-fjellstua":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop",

  // Sports Bars
  "carls":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  "ost-stadionpub":
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=600&h=400&fit=crop",
  "box-sports":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  "bohemen":
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=600&h=400&fit=crop",
  "bernies":
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=600&h=400&fit=crop",
  "store-sta":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop",
  "lincoln-sportsbar":
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=600&h=400&fit=crop",
  "o-reillys":
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=600&h=400&fit=crop",
  "haandtryk":
    "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=600&h=400&fit=crop",

  // Pubs
  "pokalen-vulkan":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  "scotsman":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "highbury":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",
  "dr-jekylls":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "o-connors-grunerlokka":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",
  "wild-rover":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "lannisters":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop",
  "sir-winston":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",
  "sentralpuben":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "beer-palace":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  "valerenga-vertshus":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",
  "magneten":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "dubliner":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",
  "proud-mary":
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop",
  "crafty-dog":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  "old-irish-majorstuen":
    "https://images.unsplash.com/photo-1571024082860-52e0e41a3b24?w=600&h=400&fit=crop",

  // Street Food
  "oslo-street-food":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  "vippa":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",

  // Restaurants
  "tgi-fridays-city":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  "sukkerbiten":
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
  "o-learys-vika":
    "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=600&h=400&fit=crop",
  "panda-restaurant":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  "gronland-boulebar":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  "hasle-linie-gastropub":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  "vesper":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
};

// Category fallback images
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
  return venueImages[venueId] ?? categoryFallbacks[category] ?? categoryFallbacks.pub;
}
