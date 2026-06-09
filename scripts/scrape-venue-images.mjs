// Henter og:image fra hver venues nettside.
// Fallback-rekkefølge: og:image → twitter:image → eksisterende placeholder.
import { readFileSync, writeFileSync } from "node:fs";

const venuesPath = new URL("../src/venues.json", import.meta.url);
const outPath = new URL("../src/lib/venueImagesScraped.json", import.meta.url);

const venues = JSON.parse(readFileSync(venuesPath, "utf8")).venues;

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

function absolutize(url, base) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return "https:" + url;
  try {
    const b = new URL(base);
    if (url.startsWith("/")) return b.origin + url;
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

function extractImage(html, baseUrl) {
  // 1) og:image (with or without :secure_url)
  const ogPatterns = [
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const p of ogPatterns) {
    const m = html.match(p);
    if (m && m[1]) return { src: absolutize(m[1], baseUrl), via: "og:image" };
  }
  // 2) twitter:image
  const twPatterns = [
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const p of twPatterns) {
    const m = html.match(p);
    if (m && m[1]) return { src: absolutize(m[1], baseUrl), via: "twitter:image" };
  }
  // 3) <link rel="apple-touch-icon">
  const apple = html.match(/<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
  if (apple && apple[1]) return { src: absolutize(apple[1], baseUrl), via: "apple-touch-icon" };
  return null;
}

async function fetchOne(v) {
  if (!v.website) return { id: v.id, ok: false, reason: "no website" };
  try {
    const r = await fetch(v.website, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { id: v.id, ok: false, reason: `HTTP ${r.status}` };
    const html = await r.text();
    const got = extractImage(html, r.url || v.website);
    if (!got || !got.src) return { id: v.id, ok: false, reason: "no og/twitter image" };
    return { id: v.id, ok: true, src: got.src, via: got.via };
  } catch (e) {
    return { id: v.id, ok: false, reason: e.message || String(e) };
  }
}

const results = {};
let ok = 0;
let fail = 0;

// Kjør 5 og 5 parallelt
const batches = [];
const concurrency = 5;
for (let i = 0; i < venues.length; i += concurrency) {
  batches.push(venues.slice(i, i + concurrency));
}

for (const batch of batches) {
  const settled = await Promise.all(batch.map(fetchOne));
  for (const r of settled) {
    if (r.ok) {
      results[r.id] = r.src;
      ok++;
      console.log(`✓ ${r.id}  (${r.via})  ${r.src.slice(0, 90)}`);
    } else {
      fail++;
      console.log(`✗ ${r.id}  — ${r.reason}`);
    }
  }
}

writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");
console.log(`\n✓ ${ok} hentet · ✗ ${fail} feilet · skrevet til ${outPath.pathname}`);
