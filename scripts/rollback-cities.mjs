// Rollback: tilbake til kun Oslo. Fjerner cityId og Trondheim+Follo-venuer.
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";

const venuesPath = new URL("../src/venues.json", import.meta.url);
const citiesPath = new URL("../src/cities.json", import.meta.url);
const data = JSON.parse(readFileSync(venuesPath, "utf8"));

const before = data.venues.length;
data.venues = data.venues.filter((v) => !v.cityId || v.cityId === "oslo");
const after = data.venues.length;
for (const v of data.venues) delete v.cityId;

data.meta.totalVenues = data.venues.length;
data.meta.notes = data.meta.notes
  .replace(" Trondheim og Follo lagt til juni 2026 — Trondheim fra sefotballvm2026/trondheim + adressa + 433.no. Follo har ingen aktiv VM-aggregator; dekningen er liten og merket needsVerification.", "");

writeFileSync(venuesPath, JSON.stringify(data, null, 2) + "\n");
if (existsSync(new URL(citiesPath))) unlinkSync(citiesPath);

console.log(`✓ ${before - after} venuer fjernet (Trondheim+Follo)`);
console.log(`✓ ${after} Oslo-venuer beholdt`);
console.log(`✓ cities.json slettet`);
