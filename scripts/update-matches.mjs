#!/usr/bin/env node

/**
 * Henter oppdatert kampdata fra football-data.org API (v4)
 * og oppdaterer src/matches.json med faktiske lagnavn.
 *
 * Bruk: FOOTBALL_DATA_API_KEY=din_nøkkel node scripts/update-matches.mjs
 *
 * API-dokumentasjon: https://docs.football-data.org/general/v4/index.html
 * VM 2026 competition code: WC
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MATCHES_PATH = path.join(__dirname, "..", "src", "matches.json");

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error("❌ Mangler FOOTBALL_DATA_API_KEY environment variable");
  process.exit(1);
}

const API_BASE = "https://api.football-data.org/v4";
const COMPETITION = "WC"; // FIFA World Cup

// Mapping fra engelske lagnavn til norske
const TEAM_NAMES = {
  "Mexico": "Mexico",
  "South Korea": "Sør-Korea",
  "South Africa": "Sør-Afrika",
  "Canada": "Canada",
  "Switzerland": "Sveits",
  "Qatar": "Qatar",
  "Brazil": "Brasil",
  "Morocco": "Marokko",
  "Haiti": "Haiti",
  "Scotland": "Skottland",
  "USA": "USA",
  "United States": "USA",
  "Paraguay": "Paraguay",
  "Australia": "Australia",
  "Germany": "Tyskland",
  "Curaçao": "Curaçao",
  "Curacao": "Curaçao",
  "Ivory Coast": "Elfenbenskysten",
  "Côte d'Ivoire": "Elfenbenskysten",
  "Ecuador": "Ecuador",
  "Netherlands": "Nederland",
  "Japan": "Japan",
  "Tunisia": "Tunisia",
  "Belgium": "Belgia",
  "Egypt": "Egypt",
  "Spain": "Spania",
  "Cape Verde": "Kapp Verde",
  "Cabo Verde": "Kapp Verde",
  "Saudi Arabia": "Saudi-Arabia",
  "Uruguay": "Uruguay",
  "Iran": "Iran",
  "New Zealand": "New Zealand",
  "France": "Frankrike",
  "Norway": "Norge",
  "Senegal": "Senegal",
  "Iraq": "Irak",
  "Argentina": "Argentina",
  "Algeria": "Algerie",
  "Austria": "Østerrike",
  "Jordan": "Jordan",
  "Portugal": "Portugal",
  "Uzbekistan": "Uzbekistan",
  "Colombia": "Colombia",
  "England": "England",
  "Croatia": "Kroatia",
  "Ghana": "Ghana",
  "Panama": "Panama",
  "Italy": "Italia",
  "Denmark": "Danmark",
  "Sweden": "Sverige",
  "Poland": "Polen",
  "Serbia": "Serbia",
  "Ukraine": "Ukraina",
  "Chile": "Chile",
  "Peru": "Peru",
  "Cameroon": "Kamerun",
  "Nigeria": "Nigeria",
  "Turkey": "Tyrkia",
  "Wales": "Wales",
  "Czech Republic": "Tsjekkia",
  "Czechia": "Tsjekkia",
  "Hungary": "Ungarn",
  "Romania": "Romania",
  "Greece": "Hellas",
  "Costa Rica": "Costa Rica",
  "Honduras": "Honduras",
  "Jamaica": "Jamaica",
  "Iceland": "Island",
  "Republic of Ireland": "Irland",
  "Northern Ireland": "Nord-Irland",
  "Bosnia and Herzegovina": "Bosnia-Hercegovina",
  "North Macedonia": "Nord-Makedonia",
  "Montenegro": "Montenegro",
  "Albania": "Albania",
  "Georgia": "Georgia",
  "Slovakia": "Slovakia",
  "Slovenia": "Slovenia",
  "Finland": "Finland",
  "Bulgaria": "Bulgaria",
  "DR Congo": "DR Kongo",
  "Bahrain": "Bahrain",
  "Palestine": "Palestina",
  "Oman": "Oman",
  "Syria": "Syria",
  "China PR": "Kina",
  "Indonesia": "Indonesia",
  "Thailand": "Thailand",
  "Vietnam": "Vietnam",
  "Philippines": "Filippinene",
  "Malaysia": "Malaysia",
  "India": "India",
  "Singapore": "Singapore",
};

function translateTeam(name) {
  if (!name) return "TBD";
  return TEAM_NAMES[name] || name;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ä/g, "a")
    .replace(/ç/g, "c").replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Map API stage names to our Norwegian names
function translateStage(stage) {
  const map = {
    "GROUP_STAGE": "Gruppespill",
    "ROUND_OF_32": "16-delsfinale",
    "LAST_32": "16-delsfinale",
    "ROUND_OF_16": "8-delsfinale",
    "LAST_16": "8-delsfinale",
    "QUARTER_FINALS": "Kvartfinale",
    "SEMI_FINALS": "Semifinale",
    "THIRD_PLACE": "Bronsefinale",
    "FINAL": "Finale",
  };
  return map[stage] || stage;
}

// Convert API match date to Oslo time
function toOsloTime(utcDate) {
  const d = new Date(utcDate);
  // Format in Oslo timezone
  const dateStr = d.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }); // YYYY-MM-DD
  const timeStr = d.toLocaleTimeString("sv-SE", { timeZone: "Europe/Oslo", hour: "2-digit", minute: "2-digit" }); // HH:MM
  return { date: dateStr, kickoff: timeStr };
}

async function fetchAPI(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`  Henter: ${url}`);
  const res = await fetch(url, {
    headers: { "X-Auth-Token": API_KEY },
  });
  if (!res.ok) {
    throw new Error(`API-feil ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  console.log("🏟️  Henter VM 2026-data fra football-data.org...\n");

  // Load existing matches
  const existing = JSON.parse(fs.readFileSync(MATCHES_PATH, "utf-8"));
  const existingById = new Map(existing.matches.map((m) => [m.id, m]));

  // Fetch all matches from the API
  let apiMatches;
  try {
    const data = await fetchAPI(`/competitions/${COMPETITION}/matches`);
    apiMatches = data.matches;
    console.log(`\n  ✅ Hentet ${apiMatches.length} kamper fra API\n`);
  } catch (err) {
    console.error(`\n  ❌ Kunne ikke hente kamper: ${err.message}`);
    console.log("  Prøver å matche på dato/tid i stedet...\n");
    // If API fails, exit gracefully without changes
    process.exit(0);
  }

  let updatedCount = 0;

  // Try to match API matches to our existing matches by date + kickoff
  for (const apiMatch of apiMatches) {
    const homeTeam = apiMatch.homeTeam?.name || apiMatch.homeTeam?.shortName;
    const awayTeam = apiMatch.awayTeam?.name || apiMatch.awayTeam?.shortName;

    // Skip if both teams are still TBD in the API
    if (!homeTeam && !awayTeam) continue;

    const homeNo = translateTeam(homeTeam);
    const awayNo = translateTeam(awayTeam);

    // Convert to Oslo time
    const { date, kickoff } = toOsloTime(apiMatch.utcDate);
    const stage = translateStage(apiMatch.stage);

    // Find matching existing match by date + time + stage
    let match = null;

    for (const [id, m] of existingById) {
      if (m.date === date && m.kickoff === kickoff) {
        match = m;
        break;
      }
    }

    // Also try matching by stage + approximate time (within 2 hours)
    if (!match) {
      const apiTime = new Date(apiMatch.utcDate).getTime();
      for (const [id, m] of existingById) {
        const mTime = new Date(`${m.date}T${m.kickoff}:00+02:00`).getTime();
        if (Math.abs(apiTime - mTime) < 2 * 60 * 60 * 1000 && translateStage(apiMatch.stage) === m.stage) {
          match = m;
          break;
        }
      }
    }

    if (!match) continue;

    let changed = false;

    // Update home team if it was TBD
    if ((match.home === "TBD" || match.home.startsWith("TBD")) && homeNo !== "TBD") {
      console.log(`  📝 ${match.id}: ${match.home} → ${homeNo}`);
      match.home = homeNo;
      changed = true;
    }

    // Update away team if it was TBD
    if ((match.away === "TBD" || match.away.startsWith("TBD")) && awayNo !== "TBD") {
      console.log(`  📝 ${match.id}: ${match.away} → ${awayNo}`);
      match.away = awayNo;
      changed = true;
    }

    // Update slug if teams changed
    if (changed) {
      const newSlug = slugify(`${match.home}-${match.away}`);
      if (match.slug.includes("tbd") || match.slug.includes("r32") || match.slug.includes("r16") || match.slug.includes("qf") || match.slug.includes("sf")) {
        match.slug = newSlug;
      }

      // Check if Norway is playing
      if (match.home === "Norge" || match.away === "Norge") {
        match.norwayMatch = true;
      }

      updatedCount++;
    }

    // Update stadium/city if available
    if (apiMatch.venue && !match.stadium) {
      match.stadium = apiMatch.venue;
      changed = true;
    }
  }

  if (updatedCount === 0) {
    console.log("  ℹ️  Ingen endringer — kampdata er allerede oppdatert.\n");
    process.exit(0);
  }

  // Update meta
  existing.meta.generated = new Date().toISOString().split("T")[0];

  // Write back
  fs.writeFileSync(MATCHES_PATH, JSON.stringify(existing, null, 2) + "\n");
  console.log(`\n  ✅ Oppdaterte ${updatedCount} kamper i matches.json\n`);
}

main().catch((err) => {
  console.error("❌ Feil:", err);
  process.exit(1);
});
