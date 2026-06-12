/**
 * Programmatic SEO guides.
 *
 * Each guide is a curated landing page targeting a specific search intent.
 * Pages are generated from real venue/match data — never fabricated.
 *
 * Linking strategy:
 * - Hub at /guide lists all guides.
 * - Each guide links to 3-5 related guides at the bottom (internal link graph).
 * - All guides indexed via sitemap.
 * - Discreet footer link from layout (not main nav) so Googlebot follows from
 *   every page on the site.
 */
import type { Venue } from "./types";
import { vmScore } from "./score";
import { haversineKm } from "./utils";

const SENTRUM = { lat: 59.9131, lng: 10.7522 };

export type GuideFaq = { q: string; a: string };

export type GuideHighlight =
  | "beer_price"
  | "capacity"
  | "category"
  | "neighborhood"
  | "none";

export interface Guide {
  slug: string;
  /** Page <title> — keyword-rich, under 60 chars when possible. */
  title: string;
  /** Meta description — 140-160 chars, includes the keyword + a hook. */
  description: string;
  /** H1 on the page itself. */
  h1: string;
  /** Eyebrow above the H1 (small uppercase label). */
  eyebrow: string;
  /** 2-3 sentence intro shown under the H1. */
  intro: string;
  /** Primary keyword the page targets (used for og + bold mention in intro). */
  keyword: string;
  /** How to filter the venue list. */
  filter: (v: Venue) => boolean;
  /** How to sort the resulting list. */
  sort: (a: Venue, b: Venue) => number;
  /** What to highlight on each card (badge/stat). */
  highlight: GuideHighlight;
  /** Fallback text if filter returns < 3 venues. */
  emptyState: string;
  /** Max items to show before "+ N flere"-link to the full list. */
  limit: number;
  /** FAQs — rendered as schema.org/FAQPage + visible accordion. */
  faqs: GuideFaq[];
  /** Slugs of related guides. */
  related: string[];
  /** Last-updated label shown on the page. */
  lastUpdated: string;
}

const LAST_UPDATED = "10. juni 2026";

/* ──────────────────────────────────────────────────────────────────────────
 * Helper filters and sorts.
 * Kept inline (not exported) — only used by the guides below.
 * ──────────────────────────────────────────────────────────── */

function byScoreDesc(a: Venue, b: Venue): number {
  return vmScore(b).total - vmScore(a).total;
}

function distKm(v: Venue): number {
  if (v.lat == null || v.lng == null) return Infinity;
  return haversineKm({ lat: v.lat, lng: v.lng }, SENTRUM);
}

function isCentral(v: Venue): boolean {
  return distKm(v) < 1.2;
}

const SENTRUM_HOODS = new Set([
  "Sentrum",
  "Karl Johan",
  "Kvadraturen",
  "Slottsparken",
  "Nationaltheatret",
  "Hammersborg",
  "Jernbanetorget",
  "Oslo S",
  "Storgata",
  "Sentrum / Domkirken",
  "Sentrum / Nationaltheatret",
]);

const VIKA_BRYGGE_HOODS = new Set([
  "Aker Brygge",
  "Vika",
  "Solli plass",
  "Vippetangen",
]);

const GRUNERLOKKA_HOODS = new Set([
  "Grünerløkka",
  "Torshov",
  "Vulkan / Mathallen",
  "Carl Berners plass",
]);

const MAJORSTUEN_BISLETT_HOODS = new Set([
  "Majorstuen",
  "Bislett",
  "Bogstadveien",
]);

const BJØRVIKA_GRONLAND_HOODS = new Set([
  "Bjørvika",
  "Barcode / Bjørvika",
  "Grønland",
  "Vippetangen",
]);

/* ──────────────────────────────────────────────────────────────────────────
 * The guides.
 * ──────────────────────────────────────────────────────────── */

export const GUIDES: Guide[] = [
  /* 1) Primary keyword landing — "hvor ser jeg vm i oslo" */
  {
    slug: "hvor-se-vm-i-oslo",
    title: "Hvor ser jeg VM 2026 i Oslo? Komplett guide til alle 43 stedene",
    description:
      "Komplett oversikt over hvor du kan se Fotball-VM 2026 i Oslo — fan zones, sportsbarer og puber med kart, ølpriser og TV-kanal for hver kamp.",
    h1: "Hvor ser jeg VM 2026 i Oslo?",
    eyebrow: "Oppdatert guide",
    keyword: "hvor ser jeg VM i Oslo",
    intro:
      "Hvor ser jeg VM i Oslo? Vi har samlet 43 steder i hovedstaden som viser Fotball-VM 2026 på storskjerm — fra fan zonen i Spikersuppa til Lekter'n, Fotball i Parken, Jordal Amfi og dusinvis av puber. Filtrer på det som er viktig for deg: gratis inngang, alkohol, familievennlig, uteservering eller avstand fra der du er.",
    filter: () => true,
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen steder funnet.",
    limit: 12,
    faqs: [
      {
        q: "Hvor ser jeg VM 2026 i Oslo?",
        a: "Du kan se VM 2026 på 43 forskjellige steder i Oslo: store fan zones som Fotball i Parken, Jordal Amfi og Lekter'n, samt en rekke sportsbarer og puber i sentrum, på Grünerløkka og Aker Brygge. De største utendørs-arenaene tar over 2000 personer hver.",
      },
      {
        q: "Finnes det en gratis fan zone for VM i Oslo?",
        a: "Ja — flere av de største arrangementene er helt gratis å besøke. Spikersuppa midt i sentrum, Lekter'n på Aker Brygge og Fotballeventyret i Grünerhallen er noen av de største gratis-tilbudene i Oslo under VM 2026.",
      },
      {
        q: "Hvor kan jeg se Norges kamper i Oslo?",
        a: "Alle fan zones og de aller fleste sportsbarene i Oslo viser Norges kamper. Spikersuppa, Fotball i Parken og Jordal Amfi har de største storskjermene. NRK sender alle Norges kamper gratis på lineær TV.",
      },
      {
        q: "Hva koster en øl på VM-stedene i Oslo?",
        a: "Gjennomsnittlig registrert pris for en halvliter pils ligger på rundt 118 kr ifølge pilsguiden.no. Prisen varierer mellom venuer og kan endre seg under turneringen. Sjekk pris hos hvert enkelt sted.",
      },
      {
        q: "Hvilken kanal sender VM 2026 i Norge?",
        a: "NRK og TV 2 deler rettighetene til VM 2026 i Norge. Begge sender gratis på lineær TV. Alle Norges kamper og finalen sendes på NRK. Vi har TV-kanalen oppført på hver av de 104 kampene.",
      },
    ],
    related: ["gratis-vm-oslo", "fan-zone-oslo-vm", "norge-pa-storskjerm-oslo", "billig-ol-vm-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 2) Gratis */
  {
    slug: "gratis-vm-oslo",
    title: "Gratis VM 2026 i Oslo — alle stedene uten inngangspenger",
    description:
      "Alle gratis steder i Oslo som viser Fotball-VM 2026 på storskjerm. Fan zones, puber og uteservering uten billett — oppdatert oversikt.",
    h1: "Gratis VM 2026 i Oslo",
    eyebrow: "Gratis inngang",
    keyword: "gratis VM Oslo",
    intro:
      "Du trenger ikke betale for å se VM 2026 i Oslo. Vi har samlet alle stedene med gratis inngang — fra de store fan zonene som Spikersuppa og Lekter'n til puber over hele byen. Bare møt opp.",
    filter: (v) => !v.ticketRequired,
    sort: byScoreDesc,
    highlight: "category",
    emptyState: "Ingen gratis steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Er det gratis å se VM 2026 i Oslo?",
        a: "Ja. De aller fleste stedene i Oslo som viser VM 2026 har gratis inngang. Spikersuppa, Lekter'n, Fotballeventyret i Grünerhallen og samtlige sportsbarer og puber er åpne for alle uten billett.",
      },
      {
        q: "Hvilke fan zones er gratis i Oslo?",
        a: "Spikersuppa i sentrum, Lekter'n på Aker Brygge og Fotballeventyret i Grünerhallen er gratis. Fotball i Parken og Jordal Amfi krever billett til enkelte kamper, men har også gratis arrangementer.",
      },
      {
        q: "Må jeg reservere bord på de gratis stedene?",
        a: "På de store fan zonene reserverer du ikke — det er først til mølla. På sportsbarer og puber lønner det seg å reservere før Norges kamper og knockout-kampene.",
      },
    ],
    related: ["fan-zone-oslo-vm", "utendors-vm-oslo", "billig-ol-vm-oslo", "norge-pa-storskjerm-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 3) Beer prices — neutral consumer information. Bevisst nøytral
     framing (Alkoholloven §9-2): vi gjengir priser fra pilsguiden.no
     som forbrukerinformasjon, vi promoterer ikke konsum. */
  {
    slug: "billig-ol-vm-oslo",
    title: "Ølpriser i Oslo under VM 2026 — forbrukerinformasjon",
    description:
      "Oversikt over registrerte priser på 0,5 L pils ved VM-stedene i Oslo. Data fra pilsguiden.no. 18 års aldersgrense.",
    h1: "Ølpriser ved VM-stedene i Oslo",
    eyebrow: "Forbrukerinformasjon",
    keyword: "ølpriser Oslo VM",
    intro:
      "Denne siden gjengir registrerte priser på 0,5 L pils ved venuene som viser Fotball-VM 2026 i Oslo. Tallene er hentet fra pilsguiden.no og presenteres som offentlig forbrukerinformasjon. Aldersgrensen for kjøp av alkohol er 18 år.",
    filter: (v) => v.beerPrice != null,
    sort: (a, b) => (a.beerPrice ?? 9999) - (b.beerPrice ?? 9999),
    highlight: "beer_price",
    emptyState: "Ingen ølpriser registrert.",
    limit: 25,
    faqs: [
      {
        q: "Hvor får jeg en oversikt over ølpriser i Oslo?",
        a: "Pilsguiden.no er den mest komplette databasen over ølpriser i Oslo. Vi gjengir tallene derfra for venuene som viser VM 2026. Sjekk venuens egen nettside for oppdatert pris før du går.",
      },
      {
        q: "Hva er gjennomsnittlig ølpris i Oslo?",
        a: "Gjennomsnittlig registrert pris for en halvliter pils ligger på rundt 118 kroner ifølge pilsguiden.no. Medianprisen er 122 kr. Prisen kan variere mellom dag og kveld og under arrangementer.",
      },
      {
        q: "Endrer ølprisene seg under VM?",
        a: "Ja, noen venuer har egne event-priser under turneringen. Tallene vi gjengir er normalprisene fra pilsguiden.no, og kan avvike fra eventuelle VM-spesifikke priser. Sjekk alltid med venuet.",
      },
      {
        q: "Hvor kommer ølprisene fra?",
        a: "Prisene er hentet fra pilsguiden.no, en uavhengig database over ølpriser i Oslo. Vi presenterer dem som forbrukerinformasjon — ikke som anbefaling om konsum.",
      },
    ],
    related: ["gratis-vm-oslo", "vm-pub-oslo", "vm-sentrum-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 4) Family */
  {
    slug: "familievennlig-vm-oslo",
    title: "Familievennlig VM 2026 i Oslo — se kampene med barn",
    description:
      "Hvor kan du se VM 2026 i Oslo med barn? Familievennlige fan zones, puber uten aldersgrense og steder med barnemeny — oppdatert oversikt.",
    h1: "Familievennlig VM 2026 i Oslo",
    eyebrow: "For hele familien",
    keyword: "familievennlig VM Oslo",
    intro:
      "Skal du se VM med ungene? Vi har samlet stedene i Oslo som er åpne for hele familien — uten aldersgrense, med barnemeny eller bare med god plass og rolig stemning rundt skjermen.",
    filter: (v) => v.familyFriendly === true,
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen familievennlige steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Kan jeg ta med barn på fan zonen i Oslo?",
        a: "Ja. De store fan zonene som Spikersuppa, Lekter'n og Fotballeventyret i Grünerhallen er åpne for hele familien. Fotball i Parken og Jordal Amfi har egne familieområder.",
      },
      {
        q: "Hvilke steder har aldersgrense?",
        a: "De fleste sportsbarer og puber har 18- eller 20-årsgrense etter et visst klokkeslett, ofte fra kl. 20 eller 22. Vi markerer aldersgrensene tydelig på hvert sted.",
      },
      {
        q: "Finnes det familievennlige steder med uteservering?",
        a: "Ja. Spikersuppa er åpent for alle, og flere av de mindre fan zonene har dedikerte familieområder utendørs. Sjekk filteret 'utendørs' kombinert med 'familievennlig'.",
      },
    ],
    related: ["gratis-vm-oslo", "fan-zone-oslo-vm", "utendors-vm-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 5) Outdoor */
  {
    slug: "utendors-vm-oslo",
    title: "VM 2026 utendørs i Oslo — uteservering og storskjerm",
    description:
      "Alle stedene i Oslo med utendørs storskjerm under Fotball-VM 2026. Fan zones, uteserveringer og parker — fra Spikersuppa til Vippetangen.",
    h1: "VM 2026 utendørs i Oslo",
    eyebrow: "Uteservering",
    keyword: "VM utendørs Oslo",
    intro:
      "Sol, øl og fotball — det er noe annet med uteservering. Vi har samlet alle stedene i Oslo som viser VM 2026 på storskjerm utendørs, fra de store fan zonene til intime takterrasser.",
    filter: (v) => v.outdoorViewing === true,
    sort: byScoreDesc,
    highlight: "capacity",
    emptyState: "Ingen utendørs steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Hvilke fan zones i Oslo er utendørs?",
        a: "Spikersuppa, Lekter'n, Fotball i Parken, Jordal Amfi og flere mindre arenaer er helt eller delvis utendørs. Spikersuppa er den mest sentralt plasserte.",
      },
      {
        q: "Hva skjer hvis det regner?",
        a: "De fleste utendørs-arenaene har telt eller overbygg over hovedskjermen, mens publikum står ute. Sportsbarer med uteservering har som regel både ute- og innendørs skjermer.",
      },
      {
        q: "Hva er den største utendørs-arenaen i Oslo under VM?",
        a: "Fotball i Parken og Jordal Amfi er de største arenaene, med kapasitet på flere tusen. Lekter'n er den mest karakteristiske med sjøutsikt på Aker Brygge.",
      },
    ],
    related: ["fan-zone-oslo-vm", "gratis-vm-oslo", "vm-aker-brygge-vika", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 6) Norway */
  {
    slug: "norge-pa-storskjerm-oslo",
    title: "Se Norge spille VM 2026 på storskjerm i Oslo",
    description:
      "Hvor ser jeg Norges kamper i VM 2026 i Oslo? Alle fan zones og sportsbarer som viser Norge på storskjerm — med kart og TV-kanal.",
    h1: "Norges kamper på storskjerm i Oslo",
    eyebrow: "🇳🇴 Norge spiller",
    keyword: "Norge VM storskjerm Oslo",
    intro:
      "Norge er tilbake i VM for første gang siden 1998. Alle de store fan zonene og sportsbarene i Oslo viser Norges kamper på storskjerm — NRK sender alle kampene gratis. Her er stedene som garanterer norsk stemning.",
    filter: (v) => v.showsNorwayMatches === true,
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Hvor kan jeg se Norge spille VM 2026 i Oslo?",
        a: "Samtlige fan zones i Oslo viser Norges kamper, og det gjør også alle sportsbarer og puber. Spikersuppa, Fotball i Parken og Jordal Amfi har de største skjermene og den beste stemningen.",
      },
      {
        q: "Hvilken kanal sender Norge i VM 2026?",
        a: "NRK sender alle Norges kamper i VM 2026 gratis på lineær TV og NRK TV-appen. TV 2 sender utvalgte andre kamper. Vi har TV-kanalen oppført på hver av de 104 kampene.",
      },
      {
        q: "Er det reservasjon på Norges kamper?",
        a: "Anbefales sterkt — særlig på de små sportsbarene. På fan zonene er det først til mølla. Møt opp i god tid, helst 1-2 timer før kampstart.",
      },
    ],
    related: ["fan-zone-oslo-vm", "gratis-vm-oslo", "vm-sentrum-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 7) Fan zone */
  {
    slug: "fan-zone-oslo-vm",
    title: "Fan zone Oslo VM 2026 — alle de store visningsarenaene",
    description:
      "Alle fan zones i Oslo under Fotball-VM 2026: Fotball i Parken, Jordal Amfi, Lekter'n, Spikersuppa og flere. Kapasitet, billettpris og åpningstider.",
    h1: "Fan zones i Oslo under VM 2026",
    eyebrow: "Visningsarenaer",
    keyword: "fan zone Oslo VM",
    intro:
      "En \"fan zone\" er ikke et FIFA-offisielt begrep i Oslo — VM spilles i USA, Canada og Mexico — men det er navnet folk bruker om de store visningsarenaene. Vi har samlet alle dem: Fotball i Parken, Jordal Amfi, Lekter'n, Spikersuppa, Vinslottet og flere. Her er kapasiteten, prisene og hva som skiller dem.",
    filter: (v) => v.category === "fan_zone",
    sort: byScoreDesc,
    highlight: "capacity",
    emptyState: "Ingen fan zones funnet.",
    limit: 12,
    faqs: [
      {
        q: "Hva er en fan zone?",
        a: "En fan zone er en arena der mange ser kampene sammen på storskjerm, oftest utendørs eller i en stor hall. Begrepet er ikke offisielt fra FIFA i Oslo — vertsbyene i USA, Canada og Mexico har FIFA Fan Festival — men brukes på norsk om de største visningsarrangementene.",
      },
      {
        q: "Hvor mange fan zones er det i Oslo?",
        a: "Vi har telt 9 fan zones og store visningsarenaer i Oslo under VM 2026. De største er Fotball i Parken (over 2000 personer), Jordal Amfi (flere tusen) og Lekter'n på Aker Brygge.",
      },
      {
        q: "Koster det penger å gå på fan zone?",
        a: "Noen er gratis (Spikersuppa, Lekter'n, Fotballeventyret), andre krever billett til enkelte kamper (Fotball i Parken, Jordal Amfi). Sjekk hver enkelt for nøyaktig pris.",
      },
      {
        q: "Hvilken fan zone er størst i Oslo?",
        a: "Fotball i Parken og Jordal Amfi er de største, med kapasitet på flere tusen. Fotballeventyret i Grünerhallen følger tett med dedikerte familieområder.",
      },
    ],
    related: ["gratis-vm-oslo", "utendors-vm-oslo", "norge-pa-storskjerm-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 8) Sentrum */
  {
    slug: "vm-sentrum-oslo",
    title: "Se VM 2026 i Oslo sentrum — fan zones og puber innenfor Ring 1",
    description:
      "Alle steder i Oslo sentrum som viser Fotball-VM 2026 på storskjerm. Karl Johan, Kvadraturen, Spikersuppa og puber innenfor Ring 1.",
    h1: "VM 2026 i Oslo sentrum",
    eyebrow: "Bydel: Sentrum",
    keyword: "VM Oslo sentrum",
    intro:
      "Bor du på hotell eller skal du møte folk på vei hjem fra jobben? Vi har samlet alle stedene innenfor Ring 1 som viser VM 2026 — fra Spikersuppa midt på Karl Johan til Lannisters i Kvadraturen.",
    filter: (v) =>
      (v.neighborhood != null && SENTRUM_HOODS.has(v.neighborhood)) ||
      (isCentral(v) && v.neighborhood !== "Aker Brygge"),
    sort: byScoreDesc,
    highlight: "neighborhood",
    emptyState: "Ingen sentrumssteder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Hvor er den mest sentrale fan zonen i Oslo?",
        a: "Spikersuppa midt på Karl Johan er den mest sentrale fan zonen i Oslo under VM 2026. Den ligger 5 minutter fra Nationaltheatret stasjon og er gratis.",
      },
      {
        q: "Finnes det puber i sentrum som viser VM?",
        a: "Ja, et stort antall. Lannisters, Sentralpuben, Beer Palace, Crafty Dog og en rekke andre puber innenfor Ring 1 viser alle VM-kampene.",
      },
      {
        q: "Hvor ligger Spikersuppa?",
        a: "Spikersuppa ligger mellom Stortinget og Nationaltheatret, midt på Karl Johans gate. T-bane: Nationaltheatret eller Stortinget. Tilgjengelig fra alle innfartsårer.",
      },
    ],
    related: ["fan-zone-oslo-vm", "gratis-vm-oslo", "vm-pub-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 9) Grünerløkka */
  {
    slug: "vm-grunerlokka-oslo",
    title: "Se VM 2026 på Grünerløkka — fan zone Grünerhallen + puber",
    description:
      "Hvor ser jeg VM 2026 på Grünerløkka? Fotballeventyret i Grünerhallen, puber langs Markveien og Mathallen — komplett oversikt.",
    h1: "VM 2026 på Grünerløkka",
    eyebrow: "Bydel: Grünerløkka",
    keyword: "VM Grünerløkka",
    intro:
      "Grünerløkka er kanskje den beste bydelen i Oslo for VM-stemning. Fotballeventyret i Grünerhallen er en av de største innendørs visningsarenaene i hovedstaden, og rundt det finner du puber, takterrasser og Mathallen for før- og etterspill.",
    filter: (v) =>
      v.neighborhood != null && GRUNERLOKKA_HOODS.has(v.neighborhood),
    sort: byScoreDesc,
    highlight: "neighborhood",
    emptyState: "Ingen steder på Grünerløkka funnet.",
    limit: 12,
    faqs: [
      {
        q: "Hvor er den største fan zonen på Grünerløkka?",
        a: "Fotballeventyret i Grünerhallen er den største visningsarenaen på Grünerløkka. Den har storskjerm, mat- og baroppsett, og er gratis.",
      },
      {
        q: "Hvilke puber på Grünerløkka viser VM?",
        a: "Flere puber langs Markveien og Thorvald Meyers gate viser kampene. Bohemen og Magneten er blant favorittene.",
      },
    ],
    related: ["fan-zone-oslo-vm", "vm-sentrum-oslo", "vm-pub-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 10) Aker Brygge & Vika */
  {
    slug: "vm-aker-brygge-vika-oslo",
    title: "Se VM 2026 på Aker Brygge og Vika — Lekter'n og takterrasser",
    description:
      "Hvor ser jeg VM 2026 på Aker Brygge? Lekter'n med fjordutsikt, Vippa på Vippetangen og barer i Vika — oppdatert oversikt.",
    h1: "VM 2026 på Aker Brygge og Vika",
    eyebrow: "Bydel: Aker Brygge / Vika",
    keyword: "VM Aker Brygge",
    intro:
      "Lekter'n med fjordutsikt er kanskje det mest fotogene VM-stedet i Oslo. Aker Brygge og Vika har også flere sportsbarer og takterrasser med storskjerm — perfekt hvis du vil kombinere kampen med en spasertur langs sjøen.",
    filter: (v) =>
      v.neighborhood != null && VIKA_BRYGGE_HOODS.has(v.neighborhood),
    sort: byScoreDesc,
    highlight: "neighborhood",
    emptyState: "Ingen steder på Aker Brygge eller i Vika funnet.",
    limit: 12,
    faqs: [
      {
        q: "Hvor er Lekter'n?",
        a: "Lekter'n ligger ytterst på Aker Brygge med utsikt mot Oslofjorden. Det er en flytende restaurant og bar som under VM 2026 har stor storskjerm og er gratis å besøke.",
      },
      {
        q: "Hva er Vippa?",
        a: "Vippa er en street food-hall på Vippetangen, mellom Aker Brygge og Bjørvika. Under VM viser de kampene på flere storskjermer og har mat fra hele verden.",
      },
    ],
    related: ["utendors-vm-oslo", "fan-zone-oslo-vm", "vm-sentrum-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 11) Sports bar */
  {
    slug: "vm-sportsbar-oslo",
    title: "Beste sportsbarer for VM 2026 i Oslo — 10 anbefalinger",
    description:
      "De beste sportsbarene i Oslo for VM 2026: storskjermer, gode ølpriser og fotballfokus. Komplett liste med kart og åpningstider.",
    h1: "Beste sportsbarer for VM 2026 i Oslo",
    eyebrow: "Sportsbar",
    keyword: "sportsbar Oslo VM",
    intro:
      "Sportsbarer er bygd for dette. Flere skjermer, øl på fat, ofte uten cover charge — og lyden skrudd opp. Vi har samlet de 10 beste sportsbarene i Oslo for VM 2026, sortert etter samlet anbefaling.",
    filter: (v) => v.category === "sports_bar",
    sort: byScoreDesc,
    highlight: "beer_price",
    emptyState: "Ingen sportsbarer funnet.",
    limit: 12,
    faqs: [
      {
        q: "Hva er forskjellen på en sportsbar og en pub?",
        a: "Sportsbarer er spesialisert på sport — mange skjermer, ofte lyd, dedikert til seerne. Puber er mer generelle og kan vise utvalgte kamper. For VM-finalen og Norges kamper er begge gode valg.",
      },
      {
        q: "Finnes det en oversikt over ølpriser ved sportsbarene?",
        a: "Ja — vi gjengir registrerte priser fra pilsguiden.no på siden Ølpriser i Oslo. Tallene presenteres som forbrukerinformasjon. Sjekk venuens egen nettside for oppdatert pris.",
      },
      {
        q: "Må jeg reservere bord på sportsbar under VM?",
        a: "På Norges kamper, knockout-kamper og finalen: ja, hvis du vil sitte. Til vanlige gruppespillkamper kommer du som regel inn uten reservasjon, men kom tidlig.",
      },
    ],
    related: ["vm-pub-oslo", "billig-ol-vm-oslo", "vm-sentrum-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 12) Pub */
  {
    slug: "vm-pub-oslo",
    title: "Beste puber for VM 2026 i Oslo — irsk pub og fotball",
    description:
      "Beste puber i Oslo for VM 2026: irske puber, britiske puber og lokale brun-puber med storskjerm. 16 alternativer over hele byen.",
    h1: "Beste puber for VM 2026 i Oslo",
    eyebrow: "Pub",
    keyword: "pub Oslo VM",
    intro:
      "Det er noe spesielt med en irsk pub under VM — det halvmørke rommet, øl-fjellet på skjenken og et stuffed publikum. Vi har samlet de beste pubene i Oslo som viser VM 2026, både de irske, de britiske og de lokale brun-pubene.",
    filter: (v) => v.category === "pub",
    sort: byScoreDesc,
    highlight: "beer_price",
    emptyState: "Ingen puber funnet.",
    limit: 16,
    faqs: [
      {
        q: "Hvor finner jeg ølpriser ved pubene?",
        a: "Vi gjengir registrerte priser fra pilsguiden.no på siden Ølpriser i Oslo. Tallene presenteres som forbrukerinformasjon. Sjekk venuens egen nettside for oppdatert pris før du går.",
      },
      {
        q: "Hvilke irske puber i Oslo viser VM?",
        a: "Dubliner, O'Reilly's, Old Irish, Bohemen og flere er klassiske irske puber i Oslo som viser alle VM-kampene.",
      },
    ],
    related: ["vm-sportsbar-oslo", "billig-ol-vm-oslo", "vm-sentrum-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 13) Big screen */
  {
    slug: "vm-storskjerm-oslo",

    title: "VM 2026 på storskjerm i Oslo — de største skjermene",
    description:
      "Alle de største storskjermene i Oslo under Fotball-VM 2026. Fan zones med skjermer på 50 m² og oppover — fra Spikersuppa til Lekter'n.",
    h1: "VM 2026 på storskjerm i Oslo",
    eyebrow: "Stor skjerm",
    keyword: "VM storskjerm Oslo",
    intro:
      "Skal du se VM, skal du se det stort. Vi har samlet alle stedene i Oslo med ekte storskjerm — fan zones, takterrasser og barer med skjermer som er gjort for fellesopplevelsen.",
    filter: (v) =>
      v.category === "fan_zone" || v.category === "street_food" || v.outdoorViewing === true,
    sort: byScoreDesc,
    highlight: "capacity",
    emptyState: "Ingen storskjerm-steder funnet.",
    limit: 16,
    faqs: [
      {
        q: "Hvor er den største storskjermen i Oslo under VM 2026?",
        a: "Fotball i Parken og Jordal Amfi har de største skjermene i Oslo. Også Spikersuppa midt i sentrum og Lekter'n på Aker Brygge har skjermer som er bygd for fellesopplevelsen.",
      },
      {
        q: "Er storskjermene gratis å se?",
        a: "Spikersuppa, Lekter'n og Fotballeventyret er gratis. Fotball i Parken og Jordal Amfi har billett til enkelte kamper. Alle puber og sportsbarer med storskjerm er gratis å gå inn på.",
      },
    ],
    related: ["fan-zone-oslo-vm", "utendors-vm-oslo", "gratis-vm-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 14) Norges kamper — program, tider, motstandere */
  {
    slug: "norges-kamper-vm-2026",
    title: "Norges kamper VM 2026 — program, tider og TV-kanal",
    description:
      "Komplett program for Norges tre VM-kamper: Irak 17. juni (natt), Senegal 23. juni (natt) og Frankrike 26. juni (kveld). Klokkeslett i norsk tid og TV-kanal.",
    h1: "Norges kamper i VM 2026",
    eyebrow: "🇳🇴 Norges program",
    keyword: "Norges kamper VM 2026",
    intro:
      "Norge er tilbake i VM for første gang siden 1998. I gruppe I møter de Irak natt til onsdag 17. juni (kl. 00:00, TV 2), Senegal natt til tirsdag 23. juni (kl. 02:00, NRK) og Frankrike fredag 26. juni kl. 21:00 (NRK). Her er programmet og de beste stedene i Oslo å følge hvert eneste spark.",
    filter: (v) => v.showsNorwayMatches === true,
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Når spiller Norge i VM 2026?",
        a: "Norge spiller tre gruppespill-kamper: Irak–Norge natt til onsdag 17. juni kl. 00:00, Norge–Senegal natt til tirsdag 23. juni kl. 02:00, og Norge–Frankrike fredag 26. juni kl. 21:00. Alle tidspunkter er norsk tid (CEST, UTC+2).",
      },
      {
        q: "Hvem spiller Norge mot i VM 2026?",
        a: "Norge er plassert i gruppe I sammen med Frankrike, Senegal og Irak. De to beste fra gruppen, pluss fire av de beste treerne, går videre til 16-delsfinale. Frankrike er gruppens klare favoritt, men Norge og Senegal kjemper om andreplassen.",
      },
      {
        q: "Hvilken kanal sender Norges kamper i VM 2026?",
        a: "Irak–Norge (17. juni) sendes på TV 2. Begge de andre kampene — Norge–Senegal (23. juni) og Norge–Frankrike (26. juni) — sendes gratis på NRK. Du kan følge NRK direkte i nettleseren uten abonnement.",
      },
      {
        q: "Er Norges kamper midt på natten?",
        a: "To av tre gruppespill-kamper sparkes i gang midt på natten norsk tid: Irak–Norge begynner kl. 00:00 natt til 17. juni, og Norge–Senegal begynner kl. 02:00 natt til 23. juni. Kampene spilles i USA, som er 6–9 timer bak norsk tid. Den siste kampen mot Frankrike er mer gunstig: kl. 21:00 fredag 26. juni.",
      },
      {
        q: "Hva tid er avspark i norsk tid for alle Norges kamper?",
        a: "Irak–Norge: 17. juni kl. 00:00 (TV 2). Norge–Senegal: 23. juni kl. 02:00 (NRK). Norge–Frankrike: 26. juni kl. 21:00 (NRK). Alle tidspunkter er CEST (norsk sommertid, UTC+2).",
      },
    ],
    related: ["norge-pa-storskjerm-oslo", "fan-zone-oslo-vm", "vm-finalen-oslo-2026", "gratis-vm-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 15) VM-finalen */
  {
    slug: "vm-finalen-oslo-2026",
    title: "Se VM-finalen 2026 i Oslo — 19. juli kl. 21:00 på NRK",
    description:
      "VM-finalen 2026 spilles søndag 19. juli kl. 21:00 norsk tid og sendes på NRK. Her er de beste stedene i Oslo å se finalen på storskjerm med folkemengden.",
    h1: "Se VM-finalen 2026 i Oslo",
    eyebrow: "🏆 Finale · 19. juli",
    keyword: "VM-finalen 2026 Oslo",
    intro:
      "VM-finalen 2026 spilles søndag 19. juli kl. 21:00 norsk tid på MetLife Stadium i New Jersey — og sendes gratis på NRK. Oslo vil pakke alle fan zones og sportsbarer til randen. Her er de beste stedene å oppleve finalen med folkemengden, og hvilke som krever billett.",
    filter: (v) => v.category === "fan_zone" || v.category === "sports_bar",
    sort: byScoreDesc,
    highlight: "capacity",
    emptyState: "Ingen steder funnet.",
    limit: 12,
    faqs: [
      {
        q: "Når er VM-finalen 2026?",
        a: "VM-finalen 2026 spilles søndag 19. juli kl. 21:00 norsk tid (CEST). Kampen holdes på MetLife Stadium i East Rutherford, New Jersey, USA. Sendes gratis på NRK.",
      },
      {
        q: "Hvilken kanal sender VM-finalen 2026 i Norge?",
        a: "VM-finalen 2026 sendes på NRK — gratis, uten abonnement, både på lineær TV og via NRK TV-appen i nettleseren eller på mobil.",
      },
      {
        q: "Må jeg reservere plass for å se VM-finalen i Oslo?",
        a: "Ja, absolutt — til finalen er alle steder fulle. Sportsbarer og puber bør reserveres dagene i forkant. Fan zones som Spikersuppa og Lekter'n er gratis og uten reservasjon, men møt opp god tid i forveien.",
      },
      {
        q: "Hvilken fan zone er best for å se finalen i Oslo?",
        a: "Fotball i Parken i Slottsparken og Jordal Amfi er de største arenaene med best stemning til finaler. Spikersuppa er mest sentralt og alltid gratis. Lekter'n på Aker Brygge er det mest stemningsfulle valget med fjordutsikt.",
      },
      {
        q: "Hva skjer etter bronsefinalen?",
        a: "Bronsefinalen (3.-plassoppgjøret) spilles lørdag 18. juli kl. 23:00 norsk tid, dagen før finalen. Begge kampene sendes på NRK. Mange steder i Oslo vil arrangere finalhelg-program fra lørdag til søndag.",
      },
    ],
    related: ["fan-zone-oslo-vm", "gratis-vm-oslo", "norges-kamper-vm-2026", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 16) Innendørs */
  {
    slug: "innendors-vm-oslo",
    title: "VM 2026 innendørs i Oslo — se kampen tørr uansett vær",
    description:
      "De beste innendørs stedene i Oslo for VM 2026: fan zones i store haller, sportsbarer og puber der du slipper regnet. Komplett oversikt med kart.",
    h1: "VM 2026 innendørs i Oslo",
    eyebrow: "Innendørs",
    keyword: "VM innendørs Oslo",
    intro:
      "Norsk sommer er uforutsigbar. Vi har samlet alle stedene i Oslo der du kan se VM 2026 innendørs — store fan zones i haller, sportsbarer og puber der du slipper regnet og likevel får storskjerm og god stemning.",
    filter: (v) => v.indoorViewing === true,
    sort: byScoreDesc,
    highlight: "capacity",
    emptyState: "Ingen innendørs steder funnet.",
    limit: 20,
    faqs: [
      {
        q: "Hvilke fan zones i Oslo er innendørs?",
        a: "Fotballeventyret i Grünerhallen, Fotball på Jordal i Kampen, TAKET Steen & Strøm og Fjellstua (Megazone) på Hammersborg er store innendørs fan zones i Oslo. Alle er åpne for alle og viser kampene på storskjerm.",
      },
      {
        q: "Kan jeg se VM gratis innendørs i Oslo?",
        a: "Ja. Fotballeventyret i Grünerhallen, Jordal og Fjellstua (Megazone) er gratis å gå inn på. De fleste sportsbarer og puber er også gratis. TAKET Steen & Strøm kan ha billettpriser til spesielle kamper — sjekk deres nettside.",
      },
      {
        q: "Hva er fordelen med innendørs VM-visning?",
        a: "Innendørs arenaer er uavhengige av vær, har bedre lydforhold og er gjerne mer komfortable for lengre opphold. Under de norske nattekampene (kl. 00:00 og 02:00) er innendørs-alternativet også varmere.",
      },
      {
        q: "Finnes det innendørs steder med god ølpris?",
        a: "Ja — mange puber og sportsbarer med innendørs visning har normale pubpriser. Sjekk oversikten vår over ølpriser ved VM-stedene i Oslo for en nøytral sammenstilling av registrerte priser fra pilsguiden.no.",
      },
    ],
    related: ["fan-zone-oslo-vm", "vm-sportsbar-oslo", "vm-pub-oslo", "utendors-vm-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 17) Majorstuen / Bislett */
  {
    slug: "vm-majorstuen-bislett",
    title: "VM 2026 på Majorstuen og Bislett — puber og sportsbarer",
    description:
      "Alle VM-steder på Majorstuen, Bislett og i Bogstadveien-kvartalet. The Old Irish Pub, Store Stå Pub og Highbury — de beste stedene vest i Oslo.",
    h1: "VM 2026 på Majorstuen og Bislett",
    eyebrow: "Bydel: Majorstuen / Bislett",
    keyword: "VM Majorstuen Oslo",
    intro:
      "Majorstuen og Bislett er gode baser for VM — nær T-bane og med et knippe gode puber og sportsbarer som viser alle kampene. The Old Irish Pub er et klassiker på Majorstuen, Store Stå er en av Oslos mest dedikerte sportsbarer på Bislett, og Highbury på Bogstadveien er for den fotballglade.",
    filter: (v) =>
      v.neighborhood != null && MAJORSTUEN_BISLETT_HOODS.has(v.neighborhood),
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen steder funnet i dette området.",
    limit: 10,
    faqs: [
      {
        q: "Finnes det gode puber for VM på Majorstuen?",
        a: "Ja. The Old Irish Pub Majorstuen er den mest kjente, med storskjerm og god pub-stemning. De viser alle VM-kampene og har greie åpningstider gjennom hele turneringen.",
      },
      {
        q: "Hva er Store Stå Pub på Bislett?",
        a: "Store Stå Pub er en dedikert sportsbar på Bislett med storskjerm og fokus på levende sport. Adressen er midt i Bislett-kvartalet, lett tilgjengelig med trikk og T-bane.",
      },
      {
        q: "Hva er Highbury på Bogstadveien?",
        a: "Highbury er en britisk-inspirert pub på Bogstadveien oppkalt etter Arsenals gamle hjemmebane. Stedet er kjent blant fotballentusiaster og viser VM-kamper på storskjerm.",
      },
      {
        q: "Hvordan kommer jeg meg til Majorstuen?",
        a: "T-bane linje 1, 2, 3 og 6 stopper på Majorstuen stasjon. Derfra er det gangavstand til alle stedene i dette kvartalet.",
      },
    ],
    related: ["vm-sentrum-oslo", "vm-pub-oslo", "vm-sportsbar-oslo", "gratis-vm-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 18) Bjørvika / Grønland */
  {
    slug: "vm-bjørvika-gronland",
    title: "Se VM 2026 i Bjørvika og på Grønland — Barcode og Vippa",
    description:
      "VM-steder i Bjørvika, Barcode og på Grønland: Vippa på Vippetangen, Vesper Bar, Bernie's og Grønland Boulebar. Oppdatert oversikt med kart.",
    h1: "VM 2026 i Bjørvika og på Grønland",
    eyebrow: "Bydel: Bjørvika / Grønland",
    keyword: "VM Bjørvika Oslo",
    intro:
      "Bjørvika med Barcode-kvartalet og nabolaget Grønland byr på noen av Oslos mest varierte VM-steder. Vippa på Vippetangen er en av de mest stemningsfulle street food-arenaene, mens Grønland har gode sportsbarer og restauranter tett på Oslo S.",
    filter: (v) =>
      v.neighborhood != null && BJØRVIKA_GRONLAND_HOODS.has(v.neighborhood),
    sort: byScoreDesc,
    highlight: "none",
    emptyState: "Ingen steder funnet i dette området.",
    limit: 10,
    faqs: [
      {
        q: "Hva er Vippa på Vippetangen?",
        a: "Vippa er en street food-hall på Vippetangen mellom Aker Brygge og Bjørvika. Under VM 2026 viser de kampene på storskjerm med mat fra ulike land. Gratis inngang.",
      },
      {
        q: "Finnes det sportsbarer på Grønland?",
        a: "Ja — Bernie's på Grønland er en god sportsbar med storskjerm og fokus på levende sport. Grønland Boulebar er et annet alternativ som kombinerer mat, bowling og VM-visning.",
      },
      {
        q: "Er det noe å gjøre i Bjørvika under VM?",
        a: "Sukkerbiten på Sørenga og Vesper Bar i Barcode er to gode alternativ. Bjørvika ligger dessuten midt mellom sentrum og Grønland — lett å kombinere med andre steder i Oslo.",
      },
      {
        q: "Hvordan kommer jeg meg til Bjørvika og Grønland?",
        a: "Oslo S er navet — Grønland stasjon (T-bane og trikk) og Oslo S (tog, T-bane, buss) gir deg gangavstand til alle stedene. Fra sentrum er det 10 minutters gange.",
      },
    ],
    related: ["vm-sentrum-oslo", "fan-zone-oslo-vm", "utendors-vm-oslo", "hvor-se-vm-i-oslo"],
    lastUpdated: LAST_UPDATED,
  },

  /* 19) Afterwork */
  {
    slug: "vm-afterwork-oslo",
    title: "VM 2026 afterwork i Oslo — se kampen etter jobb",
    description:
      "De beste stedene i Oslo for VM-afterwork: sportsbarer og puber uten reservasjon der du kan gå rett fra kontoret. Kamper fra kl. 18 og 21 under hele turneringen.",
    h1: "VM 2026 afterwork i Oslo",
    eyebrow: "Etter jobb",
    keyword: "VM afterwork Oslo",
    intro:
      "Mange VM-kamper sparkes i gang kl. 18 eller 21 — perfekt for en spontan afterwork. Her er stedene i Oslo der du kan gå rett fra kontoret til en god plass foran storskjermen, uten å ha bestilt bord på forhånd. Ingen billett, bare terskelen ned og ølglasset opp.",
    filter: (v) =>
      !v.ticketRequired &&
      v.requiresReservation !== true &&
      (v.category === "sports_bar" || v.category === "pub"),
    sort: byScoreDesc,
    highlight: "beer_price",
    emptyState: "Ingen steder funnet.",
    limit: 16,
    faqs: [
      {
        q: "Hvilke VM-kamper begynner om ettermiddagen eller kvelden?",
        a: "De fleste kamper i gruppespillet sparkes i gang kl. 18:00, 21:00 eller 00:00 norsk tid. Kveldsrunden kl. 21:00 er den beste afterwork-timen — og den siste kampen i hvert gruppe-par spilles ofte parallelt kl. 21:00 for å hindre taktisk spill.",
      },
      {
        q: "Trenger jeg å reservere bord for afterwork-kamper?",
        a: "Til hverdagskamper i gruppespillet og til kampene som ikke involverer Norge: sjelden nødvendig. Til Norges kamper, alle kvartfinaler, semifinaler og finalen bør du derimot reservere, særlig på de mindre sportsbarene.",
      },
      {
        q: "Hvilke sportsbarer er best for et spontant VM-besøk i Oslo?",
        a: "Bohemen Sportspub i sentrum, Haandtryk i Kvadraturen og Carls på Carl Berners plass er steder der du som regel finner en ledig plass til de vanlige gruppespill-kampene. Kom 30 minutter før avspark for å være sikker.",
      },
      {
        q: "Hva koster en øl på sportsbarene i Oslo?",
        a: "Gjennomsnittlig registrert pris på 0,5 L pils ved VM-stedene er rundt 118 kr ifølge pilsguiden.no. Prisen varierer — se vår nøytrale oversikt over ølpriser for mer informasjon.",
      },
    ],
    related: ["vm-sportsbar-oslo", "vm-pub-oslo", "billig-ol-vm-oslo", "vm-sentrum-oslo"],
    lastUpdated: LAST_UPDATED,
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(slug: string): Guide[] {
  const guide = getGuide(slug);
  if (!guide) return [];
  return guide.related
    .map((s) => getGuide(s))
    .filter((g): g is Guide => g != null);
}
