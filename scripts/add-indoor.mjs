// Migrasjon: legger til indoorViewing på alle venuer basert på bekreftet beskrivelse/kilder.
// Kjør: node scripts/add-indoor.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../src/venues.json", import.meta.url);
const data = JSON.parse(readFileSync(path, "utf8"));

// Kategorisering fra kildemateriale (juni 2026):
// - indoor: kun innendørs (eller har innendørs som primær løsning)
// - outdoor: kun utendørs / ikke under tak
// - both:    har både innendørs og utendørs visning
// - null:    ikke bekreftet
const INDOOR_MAP = {
  "fotball-i-parken": "outdoor",           // Lille Slottsparken — park med trær/plen
  "lekter-n": "outdoor",                   // "Outdoor venue with rooftop seating"
  "fotball-pa-jordal": "indoor",           // Ishockeyhall
  "oslo-street-food": "indoor",            // Mathall (Låven + Bassenget)
  "vippa": "both",                         // Mathall med uteservering
  "fotball-i-sentrum-spikersuppa": "outdoor", // Spikersuppa-plassen, ute
  "fotballeventyret-grunerhallen": "indoor",  // Sportshall
  "ullevaal-stadion-fotballfesten": "outdoor", // Stadion
  "kongens-gate-fotballfesten": "outdoor",     // Bygate
  "taket-steen-strom": "both",             // "inneområde og terrasse"
  "carls": "both",                         // Indoor café/bar/restaurant + outdoor seating
  "ost-stadionpub": "both",                // 80 inne + 80 ute + 800m² torg
  "pokalen-vulkan": "both",                // Pub innendørs + utendørs storskjerm
  "box-sports": "indoor",                  // Sportsbar
  "tgi-fridays-city": "indoor",            // Restaurant
  "sukkerbiten": "outdoor",                // Utendørs ved sjøen
  "o-learys-vika": "indoor",               // Sportsbar innendørs
  "scotsman": "both",                      // Pub + uteservering Karl Johan
  "highbury": "indoor",                    // Engelsk pub
  "dr-jekylls": "indoor",                  // To etasjer pub
  "megazone-fjellstua": "indoor",          // Innendørs (lasertag/streetcurling)
  "o-connors-grunerlokka": "indoor",       // Irsk pub
  "bohemen": "indoor",                     // Sports pub
  "wild-rover": "indoor",                  // Pub
  "lannisters": "indoor",                  // Bar
  "panda-restaurant": "indoor",            // Restaurant (antatt)
  "gronland-boulebar": "indoor",           // Indoor boulebane
  "sir-winston": "indoor",                 // Klassisk pub
  "sentralpuben": "indoor",                // Inne på Oslo S
  "beer-palace": "indoor",                 // Ølpub
  "hasle-linie-gastropub": "both",         // 250 inne + 200 ute sommer
  "valerenga-vertshus": "both",            // Pub + bakgård
  "bernies": "indoor",                     // Sportsbar
  "store-sta": "both",                     // 8 inne + 2 ute skjermer
  "magneten": "both",                      // Pub + uteservering
  "dubliner": "indoor",                    // Irsk pub
  "vesper": "indoor",                      // Gastrobar
  "proud-mary": "indoor",                  // Pub
  "lincoln-sportsbar": "indoor",           // Sportsbar
  "crafty-dog": "indoor",                  // Craftbeer-bar
  "o-reillys": "indoor",                   // Sportsbar
  "old-irish-majorstuen": "indoor",        // Pub
  "haandtryk": "indoor",                   // Sportsbar/restaurant
};

let updated = 0;
let unknown = [];
for (const v of data.venues) {
  const m = INDOOR_MAP[v.id];
  if (!m) { unknown.push(v.id); continue; }
  v.indoorViewing = m === "indoor" || m === "both";
  v.outdoorViewing = m === "outdoor" || m === "both";
  updated++;
}

if (unknown.length) {
  console.error("Mangler i map:", unknown);
  process.exit(1);
}

data.meta.notes += " Felt 'indoorViewing' lagt til i juni 2026 — bekreftet via kildebeskrivelser per venue.";

writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ Oppdaterte ${updated} venuer med indoorViewing`);
