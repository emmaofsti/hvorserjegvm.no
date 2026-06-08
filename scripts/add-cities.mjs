// Migrasjon: utvider data fra Oslo-only til flere byer (Oslo, Follo, Trondheim).
// Kjør: node scripts/add-cities.mjs
import { readFileSync, writeFileSync } from "node:fs";

const venuesPath = new URL("../src/venues.json", import.meta.url);
const citiesPath = new URL("../src/cities.json", import.meta.url);
const data = JSON.parse(readFileSync(venuesPath, "utf8"));

// 1) Markér alle eksisterende venuer som Oslo
let osloCount = 0;
for (const v of data.venues) {
  if (!v.cityId) {
    v.cityId = "oslo";
    osloCount++;
  }
}

// 2) Legg til Trondheim-venuer (12 stk)
const TRONDHEIM = [
  {
    id: "fotballfest-i-spektrum",
    name: "Fotballfest i Spektrum",
    address: "Klostergata 90, 7030 Trondheim",
    neighborhood: "Øya",
    lat: 63.4244, lng: 10.3967, coordsApproximate: true,
    website: "https://fotballfestispektrum.no/",
    category: "fan_zone",
    showsAllMatches: true, showsNorwayMatches: true,
    alcohol: true, familyFriendly: null,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: true, ticketRequired: true,
    ticketPrice: "Fasttrack fra 150 kr · Vennebord fra 1760 kr (6 pers) · Premiumbord fra 6656 kr (8 pers)",
    capacity: null, ageLimit: null, operator: null,
    description: "Byens største VM-arena. Gigantskjermer inne i Trondheim Spektrum med festivalstemning, food trucks, aktiviteter og fullt underholdningstilbud.",
    sources: ["https://fotballfestispektrum.no/", "https://www.sefotballvm2026.no/trondheim", "https://www.adressa.no/sport/fotball-vm/i/7pqlvB/her-kan-du-se-fotball-vm-i-trondheim"],
    verified: "primary",
  },
  {
    id: "fotball-i-dokken",
    name: "Fotball i Dokken",
    address: "Dokkparken, Solsiden, 7042 Trondheim",
    neighborhood: "Solsiden",
    lat: 63.4390, lng: 10.4075, coordsApproximate: true,
    website: "https://www.trondheimstage.no/no/konserter+og+billetter/fotball+i+dokken+solsiden",
    category: "fan_zone",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: null,
    outdoorViewing: true, indoorViewing: false,
    requiresReservation: false, ticketRequired: true,
    ticketPrice: "Billett via Ticketmaster",
    capacity: "stor utendørsplass",
    ageLimit: null,
    operator: "Trondheim Stage + Rosenborg Ballklub",
    description: "10×5 m storskjerm på KLP-dokken på Solsiden (tappet ned for VM). Største utendørsarrangementet i Trondheim, samarbeid med RBK.",
    sources: ["https://www.trondheimstage.no/no/konserter+og+billetter/fotball+i+dokken+solsiden", "https://www.sefotballvm2026.no/trondheim"],
    verified: "primary",
  },
  {
    id: "havet-arena",
    name: "Havet Arena",
    address: "Strandveien 104, 7067 Trondheim",
    neighborhood: "Nyhavna",
    lat: 63.4448, lng: 10.4218, coordsApproximate: true,
    website: "https://www.havetarena.no/",
    category: "fan_zone",
    showsAllMatches: null, showsNorwayMatches: true,
    alcohol: true, familyFriendly: true,
    outdoorViewing: true, indoorViewing: true,
    requiresReservation: false, ticketRequired: false,
    ticketPrice: "Gratis inngang",
    capacity: null, ageLimit: null, operator: null,
    description: "Møteplass på Nyhavna med storskjerm både ute og inne — fungerer uansett vær. Badstuer og kafé i samme bygg.",
    sources: ["https://www.havetarena.no/", "https://www.sefotballvm2026.no/trondheim"],
    verified: "secondary",
  },
  {
    id: "teknostallen",
    name: "Teknostallen",
    address: "Professor Brochs gate 6, 7030 Trondheim",
    neighborhood: "Teknobyen",
    lat: 63.4185, lng: 10.3954, coordsApproximate: true,
    website: "https://www.teknobyen.no/",
    category: "fan_zone",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: true,
    outdoorViewing: true, indoorViewing: true,
    requiresReservation: false, ticketRequired: false,
    ticketPrice: "Gratis inngang",
    capacity: null, ageLimit: null, operator: null,
    description: "Viser alle Norges kamper gratis på storskjerm i Hagen og Mellom. Mat og drikke. Åpent for alle.",
    sources: ["https://www.sefotballvm2026.no/trondheim", "https://www.adressa.no/sport/fotball-vm/i/7pqlvB/her-kan-du-se-fotball-vm-i-trondheim"],
    verified: "secondary",
  },
  {
    id: "three-lions-trondheim",
    name: "Three Lions",
    address: "Brattørgata 12B, 7010 Trondheim",
    neighborhood: "Sentrum",
    lat: 63.4364, lng: 10.4019, coordsApproximate: true,
    website: "https://threelions.no/",
    category: "pub",
    showsAllMatches: null, showsNorwayMatches: true,
    alcohol: true, familyFriendly: false,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Trondheims mest renommerte fotballpub. 4,5/5 på Google.",
    sources: ["https://threelions.no/", "https://www.sefotballvm2026.no/trondheim"],
    verified: "secondary",
  },
  {
    id: "mellomveien-trondheim",
    name: "Mellomveien",
    address: "Mellomveien 16, 7042 Trondheim",
    neighborhood: "Lademoen",
    lat: 63.4416, lng: 10.4310, coordsApproximate: true,
    website: "https://www.facebook.com/mellomveien",
    category: "pub",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: false,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Fotballpub på Lademoen. Skjenkeregler kan begrense sene kamper.",
    sources: ["https://www.sefotballvm2026.no/trondheim"],
    verified: "aggregator_only",
  },
  {
    id: "lille-london-trondheim",
    name: "Lille London",
    address: "Carl Johans gate 10, 7010 Trondheim",
    neighborhood: "Sentrum",
    lat: 63.4337, lng: 10.4014, coordsApproximate: true,
    website: "https://lillelondon.no/",
    category: "pub",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: false,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: true, ticketRequired: true,
    ticketPrice: "Billett på utvalgte VM-kvelder",
    capacity: null, ageLimit: null, operator: null,
    description: "Klassisk engelsk pub. Selger billetter for utvalgte VM-kvelder for å sikre plass.",
    sources: ["https://lillelondon.no/", "https://www.sefotballvm2026.no/trondheim"],
    verified: "secondary",
  },
  {
    id: "cafe-dublin-trondheim",
    name: "Cafe Dublin",
    address: "Kongens gate 15, 7013 Trondheim",
    neighborhood: "Torvet",
    lat: 63.4326, lng: 10.4006, coordsApproximate: true,
    website: "https://cafedublin.no/",
    category: "pub",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: false,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Irsk pub/restaurant på Trondheim Torg. Viser kamper innenfor ordinære åpningstider.",
    sources: ["https://cafedublin.no/", "https://www.sefotballvm2026.no/trondheim"],
    verified: "secondary",
  },
  {
    id: "brooklyn-diner-sportsbar",
    name: "Brooklyn Diner & Sportsbar",
    address: "Beddingen 2-4, 7042 Trondheim",
    neighborhood: "Solsiden",
    lat: 63.4395, lng: 10.4072, coordsApproximate: true,
    website: "https://brooklyndiner.no/",
    category: "sports_bar",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: true,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Amerikansk diner og sportsbar på Solsiden. Kamper innenfor åpningstider.",
    sources: ["https://brooklyndiner.no/", "https://www.sefotballvm2026.no/trondheim"],
    verified: "secondary",
  },
  {
    id: "clarion-hotel-trondheim",
    name: "Clarion Hotel Trondheim",
    address: "Brattørkaia 1, 7010 Trondheim",
    neighborhood: "Brattøra",
    lat: 63.4378, lng: 10.4070, coordsApproximate: true,
    website: "https://vm-festen.no/",
    category: "fan_zone",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: null,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: true, ticketRequired: true,
    ticketPrice: "Billett via vm-festen.no",
    capacity: null, ageLimit: null, operator: null,
    description: "Innendørs storskjerm i hotellet med plassbestilling. Studio med Rotsekk-podcast.",
    sources: ["https://www.sefotballvm2026.no/trondheim", "https://www.choicehotels.com/norway/trondheim/clarion-hotels/no121"],
    verified: "aggregator_only",
  },
  {
    id: "quality-hotel-prinsen",
    name: "Quality Hotel Prinsen",
    address: "Kongens gate 30, 7012 Trondheim",
    neighborhood: "Sentrum",
    lat: 63.4327, lng: 10.3974, coordsApproximate: true,
    website: "https://prinsenhotel.hoopla.no/",
    category: "restaurant",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: true, familyFriendly: null,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: true, ticketRequired: true,
    ticketPrice: "Billett inkludert middagsbuffet",
    capacity: null, ageLimit: null, operator: null,
    description: "Storsalen med matbuffé på utvalgte VM-kvelder.",
    sources: ["https://www.sefotballvm2026.no/trondheim"],
    verified: "aggregator_only",
  },
  {
    id: "trondheim-kino",
    name: "Trondheim Kino",
    address: "Prinsens gate 2B, 7011 Trondheim",
    neighborhood: "Sentrum",
    lat: 63.4322, lng: 10.3982, coordsApproximate: true,
    website: "https://www.trondheimkino.no/program/vm",
    category: "restaurant",
    showsAllMatches: false, showsNorwayMatches: true,
    alcohol: false, familyFriendly: true,
    outdoorViewing: false, indoorViewing: true,
    requiresReservation: true, ticketRequired: true,
    ticketPrice: "Kinobillett",
    capacity: null, ageLimit: null, operator: null,
    description: "Kinosaler med fantastisk lyd og krystallklart bilde — Norges gruppespill, semifinaler, finale og utvalgte storkamper.",
    sources: ["https://www.trondheimkino.no/program/vm", "https://www.adressa.no/sport/fotball-vm/i/7pqlvB/her-kan-du-se-fotball-vm-i-trondheim"],
    verified: "primary",
  },
];

// 3) Legg til Follo-venuer (få bekreftede)
const FOLLO = [
  {
    id: "det-gamle-bageri-drobak",
    name: "Det Gamle Bageri Mat & Vinstue",
    address: "Havnegata 4, 1440 Drøbak",
    neighborhood: "Drøbak",
    lat: 59.6633, lng: 10.6308, coordsApproximate: true,
    website: "https://www.detgamlebageri.no/",
    category: "restaurant",
    showsAllMatches: null, showsNorwayMatches: null,
    alcohol: true, familyFriendly: true,
    outdoorViewing: true, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Gastrobar i et av Drøbaks eldste trehus (1735–60). Uteservering med varmelamper. VM-deltakelse ikke offisielt bekreftet — sjekk hvis du planlegger.",
    sources: ["https://www.detgamlebageri.no/", "https://www.visitdrobak.no/det-gamle-bageri/"],
    verified: "aggregator_only",
    needsVerification: ["showsAllMatches", "showsNorwayMatches"],
  },
  {
    id: "skipperstuen-drobak",
    name: "Skipperstuen",
    address: "Havnegata 4, 1440 Drøbak",
    neighborhood: "Drøbak havn",
    lat: 59.6636, lng: 10.6309, coordsApproximate: true,
    website: "https://www.facebook.com/Skipperstuendrobak/",
    category: "restaurant",
    showsAllMatches: null, showsNorwayMatches: null,
    alcohol: true, familyFriendly: true,
    outdoorViewing: true, indoorViewing: true,
    requiresReservation: null, ticketRequired: false,
    ticketPrice: "Gratis",
    capacity: null, ageLimit: null, operator: null,
    description: "Sjøkant-restaurant i Drøbak havn. VM-deltakelse ikke bekreftet — bekreft hvis du planlegger å se kamp her.",
    sources: ["https://www.facebook.com/Skipperstuendrobak/"],
    verified: "aggregator_only",
    needsVerification: ["showsAllMatches", "showsNorwayMatches", "alcohol", "outdoorViewing"],
  },
];

// Sett cityId før push
for (const v of TRONDHEIM) {
  v.cityId = "trondheim";
  v.beerPrice = null; v.beerPriceCurrency = null; v.beerPriceVolume = null;
  v.beerPriceSource = null; v.beerPriceUpdated = null;
  data.venues.push(v);
}
for (const v of FOLLO) {
  v.cityId = "follo";
  v.beerPrice = null; v.beerPriceCurrency = null; v.beerPriceVolume = null;
  v.beerPriceSource = null; v.beerPriceUpdated = null;
  data.venues.push(v);
}

data.meta.notes += " Trondheim og Follo lagt til juni 2026 — Trondheim fra sefotballvm2026/trondheim + adressa + 433.no. Follo har ingen aktiv VM-aggregator; dekningen er liten og merket needsVerification.";
data.meta.totalVenues = data.venues.length;

writeFileSync(venuesPath, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ ${osloCount} Oslo-venuer merket med cityId="oslo"`);
console.log(`✓ ${TRONDHEIM.length} Trondheim-venuer lagt til`);
console.log(`✓ ${FOLLO.length} Follo-venuer lagt til`);
console.log(`→ Totalt ${data.venues.length} venuer`);

// 4) Cities-registry
const cities = {
  cities: [
    {
      id: "oslo",
      slug: "oslo",
      name: "Oslo",
      lat: 59.9139, lng: 10.7522,
      defaultZoom: 13,
      description: "Norges hovedstad — over 40 fan zones og sportsbarer fra Aker Brygge til Vålerenga.",
      population: 717710,
    },
    {
      id: "follo",
      slug: "follo",
      name: "Follo",
      lat: 59.6633, lng: 10.6308,
      defaultZoom: 11,
      description: "Drøbak, Ski, Ås, Nesodden, Vestby og Enebakk. Få VM-spesifikke fan zones — hjelp oss kartlegge!",
      population: 165000,
    },
    {
      id: "trondheim",
      slug: "trondheim",
      name: "Trondheim",
      lat: 63.4305, lng: 10.3951,
      defaultZoom: 13,
      description: "Rosenborg-by med Spektrum-arena, Dokken-storskjerm og pubene rundt Solsiden og Torvet.",
      population: 218800,
    },
  ],
};
writeFileSync(citiesPath, JSON.stringify(cities, null, 2) + "\n");
console.log(`✓ cities.json skrevet med ${cities.cities.length} byer`);
