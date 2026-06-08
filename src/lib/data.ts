import venuesJson from "@/venues.json";
import matchesJson from "@/matches.json";
import type { VenuesData, MatchesData, Venue, Match } from "./types";

const venuesData = venuesJson as unknown as VenuesData;
const matchesData = matchesJson as unknown as MatchesData;

export function getVenues(): Venue[] {
  return venuesData.venues;
}

export function getVenue(id: string): Venue | undefined {
  return venuesData.venues.find((v) => v.id === id);
}

export function getMatches(): Match[] {
  return matchesData.matches;
}

export function getMatch(slug: string): Match | undefined {
  return matchesData.matches.find((m) => m.slug === slug);
}

export function getNorwayMatches(): Match[] {
  return matchesData.matches.filter((m) => m.norwayMatch === true);
}

export function getGroups(): Record<string, string[]> {
  return matchesData.groups;
}

export function getMeta() {
  return {
    venues: venuesData.meta,
    matches: matchesData.meta,
  };
}
