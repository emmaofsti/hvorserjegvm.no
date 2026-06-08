export type Category = "fan_zone" | "sports_bar" | "pub" | "restaurant" | "street_food";

export type Verified = "primary" | "secondary" | "aggregator_only";

export interface Venue {
  id: string;
  name: string;
  address: string | null;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  coordsApproximate: boolean | null;
  website: string;
  category: Category;
  showsAllMatches: boolean | null;
  showsNorwayMatches: boolean;
  alcohol: boolean | null;
  familyFriendly: boolean | null;
  outdoorViewing: boolean | null;
  indoorViewing: boolean | null;
  requiresReservation: boolean | null;
  ticketRequired: boolean;
  ticketPrice: string | null;
  beerPrice: number | null;
  beerPriceCurrency: string | null;
  beerPriceVolume: string | null;
  beerPriceSource: string | null;
  beerPriceUpdated: string | null;
  capacity: string | null;
  ageLimit: number | null;
  operator: string | null;
  description: string;
  sources: string[];
  verified: Verified;
  needsVerification?: string[];
}

export type Stage =
  | "Gruppespill"
  | "16-delsfinale"
  | "8-delsfinale"
  | "Kvartfinale"
  | "Semifinale"
  | "Bronsefinale"
  | "Finale";

export interface Match {
  id: string;
  slug: string;
  date: string;
  kickoff: string;
  home: string;
  away: string;
  stage: Stage;
  group?: string;
  norwayMatch?: boolean;
  tvNorway?: string;
  stadium?: string;
  city?: string;
  isOpener?: boolean;
}

export interface VenuesData {
  meta: {
    generated: string;
    tournament: string;
    scope: string;
    tournamentStarts: string;
    tournamentEnds: string;
    primarySource: string;
    totalVenues: number;
    notes: string;
    categories: Record<Category, string>;
    verifiedLevels: Record<Verified, string>;
  };
  venues: Venue[];
}

export interface MatchesData {
  meta: {
    generated: string;
    tournament: string;
    starts: string;
    ends: string;
    totalMatches: number;
    teams: number;
    timeZone: string;
  };
  groups: Record<string, string[]>;
  matches: Match[];
}

export type AgeFilter = "all" | "no_limit" | "max_18" | "max_20";

export interface FilterState {
  freeOnly: boolean;
  alcohol: boolean;
  familyFriendly: boolean;
  outdoor: boolean;
  indoor: boolean;
  allMatches: boolean;
  norwayOnly: boolean;
  ticketed: boolean;
  maxMinutesAway: number | null;
  maxBeerPrice: number | null;
  category: Category | "all";
  age: AgeFilter;
}
