// Migrasjon: legger til ølpris per venue.
// Kilde: pilsguiden.no/oslo (hentet 8. juni 2026). Prisene er for 0,5 L pils,
// vanlig pris (ikke happy hour).
// Kjør: node scripts/add-beer-prices.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../src/venues.json", import.meta.url);
const data = JSON.parse(readFileSync(path, "utf8"));

const SOURCE_URL = "https://www.pilsguiden.no/oslo";
const FETCHED = "2026-06-08";

// venue.id → pris i NOK (null = ikke listet i pilsguiden eller event-priset)
const PRICES = {
  "old-irish-majorstuen": 49,
  "panda-restaurant": 95,
  "bernies": 96,
  "o-reillys": 98,
  "haandtryk": 99,
  "bohemen": 103,
  "sir-winston": 110,
  "magneten": 112,
  "store-sta": 112,
  "lincoln-sportsbar": 114,
  "vippa": 115,
  "ost-stadionpub": 115,
  "lannisters": 116,
  "dr-jekylls": 118,
  "sentralpuben": 119,
  "scotsman": 122,
  "dubliner": 122,
  "oslo-street-food": 122,       // Låven Bar
  "gronland-boulebar": 122,
  "sukkerbiten": 123,
  "wild-rover": 123,
  "o-connors-grunerlokka": 124,
  "pokalen-vulkan": 128,
  "carls": 130,
  "hasle-linie-gastropub": 132,
  "beer-palace": 134,
  "crafty-dog": 135,             // BD57 BrewDog
  "vesper": 135,
  "megazone-fjellstua": 144,
  "o-learys-vika": 149,
  "tgi-fridays-city": 151,
};

let withPrice = 0;
let without = [];
for (const v of data.venues) {
  const p = PRICES[v.id];
  if (p) {
    v.beerPrice = p;
    v.beerPriceCurrency = "NOK";
    v.beerPriceVolume = "0.5L";
    v.beerPriceSource = SOURCE_URL;
    v.beerPriceUpdated = FETCHED;
    withPrice++;
  } else {
    v.beerPrice = null;
    v.beerPriceCurrency = null;
    v.beerPriceVolume = null;
    v.beerPriceSource = null;
    v.beerPriceUpdated = null;
    without.push(v.id);
  }
}

data.meta.notes += " Ølpriser hentet fra pilsguiden.no juni 2026 (0,5 L vanlig pris). Event-pris kan avvike.";
data.meta.beerPriceSource = SOURCE_URL;
data.meta.beerPriceUpdated = FETCHED;

writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ ${withPrice} venuer fikk ølpris`);
console.log(`✗ ${without.length} uten pilsguiden-data: ${without.join(", ")}`);
