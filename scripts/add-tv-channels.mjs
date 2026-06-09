// Migrasjon: legger til tvChannel per VM-kamp basert på NRK/TV 2-rettigheter.
// Kilder: strim.no, sefotballvm2026.no/pa-tv, oddspodden.com, fotball.no (Norge).
// NRK og TV 2 deler alle 104 kamper. Knockout-kanaler er ikke alltid bestemt
// av selve kampen, men oftest av hvilke lag som spiller.
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../src/matches.json", import.meta.url);
const data = JSON.parse(readFileSync(path, "utf8"));

// Mapping: "YYYY-MM-DD|home|away" → channel
// Konsensus fra strim.no, oddspodden.com og sefotballvm2026.no/pa-tv.
// "NRK" = NRK1 / NRK TV (gratis). "TV 2" = TV 2 Direkte / TV 2 Play.
const TV = {
  // Gruppespill
  "2026-06-11|Mexico|Sør-Afrika": "TV 2",
  "2026-06-12|Sør-Korea|Tsjekkia": "NRK",
  "2026-06-12|Canada|Bosnia-Hercegovina": "NRK",
  "2026-06-13|USA|Paraguay": "TV 2",
  "2026-06-13|Qatar|Sveits": "NRK",
  "2026-06-14|Brasil|Marokko": "TV 2",
  "2026-06-14|Haiti|Skottland": "TV 2",
  "2026-06-14|Australia|Tyrkia": "TV 2",
  "2026-06-14|Tyskland|Curaçao": "NRK",
  "2026-06-14|Nederland|Japan": "TV 2",
  "2026-06-15|Elfenbenskysten|Ecuador": "TV 2",
  "2026-06-15|Sverige|Tunisia": "TV 2",
  "2026-06-15|Spania|Kapp Verde": "TV 2",
  "2026-06-15|Belgia|Egypt": "NRK",
  "2026-06-16|Saudi-Arabia|Uruguay": "NRK",
  "2026-06-16|Iran|New Zealand": "NRK",
  "2026-06-16|Frankrike|Senegal": "TV 2",
  "2026-06-17|Irak|Norge": "TV 2",
  "2026-06-17|Argentina|Algerie": "NRK",
  "2026-06-17|Østerrike|Jordan": "NRK",
  "2026-06-17|Portugal|DR Kongo": "NRK",
  "2026-06-17|England|Kroatia": "TV 2",
  "2026-06-18|Ghana|Panama": "TV 2",
  "2026-06-18|Uzbekistan|Colombia": "TV 2",
  "2026-06-18|Tsjekkia|Sør-Afrika": "NRK",
  "2026-06-18|Sveits|Bosnia-Hercegovina": "TV 2",
  "2026-06-19|Canada|Qatar": "TV 2",
  "2026-06-19|Mexico|Sør-Korea": "TV 2",
  "2026-06-19|USA|Australia": "NRK",
  "2026-06-20|Skottland|Marokko": "NRK",
  "2026-06-20|Brasil|Haiti": "NRK",
  "2026-06-20|Tyrkia|Paraguay": "NRK",
  "2026-06-20|Nederland|Sverige": "NRK",
  "2026-06-20|Tyskland|Elfenbenskysten": "TV 2",
  "2026-06-21|Ecuador|Curaçao": "TV 2",
  "2026-06-21|Tunisia|Japan": "NRK",
  "2026-06-21|Spania|Saudi-Arabia": "NRK",
  "2026-06-21|Belgia|Iran": "TV 2",
  "2026-06-22|Uruguay|Kapp Verde": "TV 2",
  "2026-06-22|New Zealand|Egypt": "TV 2",
  "2026-06-22|Argentina|Østerrike": "TV 2",
  "2026-06-22|Frankrike|Irak": "NRK",
  "2026-06-23|Norge|Senegal": "NRK",
  "2026-06-23|Jordan|Algerie": "TV 2",
  "2026-06-23|Portugal|Uzbekistan": "TV 2",
  "2026-06-23|England|Ghana": "NRK",
  "2026-06-24|Panama|Kroatia": "NRK",
  "2026-06-24|Colombia|DR Kongo": "TV 2",
  "2026-06-24|Sveits|Canada": "NRK",
  "2026-06-24|Bosnia-Hercegovina|Qatar": "NRK",
  "2026-06-25|Marokko|Haiti": "NRK",
  "2026-06-25|Skottland|Brasil": "NRK",
  "2026-06-25|Sør-Afrika|Sør-Korea": "TV 2",
  "2026-06-25|Mexico|Tsjekkia": "TV 2",
  "2026-06-25|Tsjekkia|Mexico": "TV 2",
  "2026-06-25|Curaçao|Elfenbenskysten": "TV 2",
  "2026-06-25|Ecuador|Tyskland": "TV 2",
  "2026-06-26|Tunisia|Nederland": "TV 2",
  "2026-06-26|Japan|Sverige": "TV 2",
  "2026-06-26|Tyrkia|USA": "NRK",
  "2026-06-26|Paraguay|Australia": "NRK",
  "2026-06-26|Norge|Frankrike": "NRK",
  "2026-06-26|Senegal|Irak": "NRK",
  "2026-06-27|Kapp Verde|Saudi-Arabia": "NRK",
  "2026-06-27|Uruguay|Spania": "NRK",
  "2026-06-27|New Zealand|Belgia": "TV 2",
  "2026-06-27|Egypt|Iran": "TV 2",
  "2026-06-27|Panama|England": "TV 2",
  "2026-06-27|Kroatia|Ghana": "TV 2",
  "2026-06-28|Colombia|Portugal": "NRK",
  "2026-06-28|DR Kongo|Uzbekistan": "NRK",
  "2026-06-28|Algerie|Østerrike": "NRK",
  "2026-06-28|Jordan|Argentina": "NRK",
};

// Knockout-stadier: spesifikke kamper er ikke alltid kjent på forhånd
// (avhenger av hvem som går videre). For 16-dels/8-dels viser vi
// rettighetsholderen som er kjent fra kilden — der det er usikkert,
// merker vi "NRK / TV 2" (begge har rettigheter til \"å vise\").
const STAGE_DEFAULTS = {
  "16-delsfinale": "NRK / TV 2",
  "8-delsfinale": "NRK / TV 2",
  Kvartfinale: "NRK / TV 2",
  Semifinale: "TV 2",       // Per oddspodden.com — semifinalene på TV 2
  Bronsefinale: "NRK",      // Per kilder — 3.-plass på NRK
  Finale: "NRK",            // Finalen 19. juli på NRK1
};

let matched = 0;
let knockoutDefaults = 0;
let unmatched = [];

for (const m of data.matches) {
  const key = `${m.date}|${m.home}|${m.away}`;
  const ch = TV[key];
  if (ch) {
    m.tvChannel = ch;
    matched++;
  } else if (STAGE_DEFAULTS[m.stage]) {
    m.tvChannel = STAGE_DEFAULTS[m.stage];
    knockoutDefaults++;
  } else {
    m.tvChannel = "NRK / TV 2";
    unmatched.push(key);
  }
  // Behold tvNorway for kompatibilitet, men sett den lik tvChannel hvis ikke satt
  if (!m.tvNorway && m.norwayMatch) m.tvNorway = ch;
}

data.meta.tvChannelSource =
  "Sammensatt fra strim.no, oddspodden.com og sefotballvm2026.no/pa-tv. NRK = NRK1/NRK TV. TV 2 = TV 2 Direkte/TV 2 Play. Begge er gratis.";
data.meta.tvChannelUpdated = "2026-06-09";

writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ ${matched} gruppespillkamper fikk eksakt TV-kanal`);
console.log(`✓ ${knockoutDefaults} KO-kamper fikk stage-default kanal`);
if (unmatched.length) console.log(`⚠ ${unmatched.length} kamper falt tilbake til "NRK / TV 2":`, unmatched.slice(0, 5));
