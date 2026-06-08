import type { Venue } from "./types";
import { haversineKm } from "./utils";

const CAPACITY_REGEX = /(\d[\d\s]{2,})/;

function parseCapacity(raw: string | null): number {
  if (!raw) return 0;
  const match = raw.match(CAPACITY_REGEX);
  if (!match) return 0;
  const n = parseInt(match[1].replace(/\s/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

const SENTRUM = { lat: 59.9131, lng: 10.7522 };

export interface ScoreBreakdown {
  total: number;
  size: number;
  coverage: number;
  central: number;
  bigScreen: number;
  atmosphere: number;
  capacity: number;
}

export function vmScore(venue: Venue): ScoreBreakdown {
  const cap = parseCapacity(venue.capacity);

  let size = 0;
  if (cap >= 10000) size = 25;
  else if (cap >= 2000) size = 20;
  else if (cap >= 500) size = 14;
  else if (cap >= 200) size = 9;
  else if (cap > 0) size = 5;

  const coverage = venue.showsAllMatches === true ? 20 : venue.showsAllMatches === false ? 6 : 12;

  let central = 0;
  if (venue.lat && venue.lng) {
    const km = haversineKm({ lat: venue.lat, lng: venue.lng }, SENTRUM);
    if (km < 0.6) central = 15;
    else if (km < 1.2) central = 12;
    else if (km < 2.5) central = 8;
    else central = 4;
  }

  let bigScreen = 0;
  if (venue.category === "fan_zone") bigScreen = 15;
  else if (venue.category === "sports_bar") bigScreen = 12;
  else if (venue.category === "street_food") bigScreen = 11;
  else if (venue.category === "pub") bigScreen = 9;
  else bigScreen = 7;

  let atmosphere = 0;
  if (venue.outdoorViewing) atmosphere += 6;
  if (venue.alcohol) atmosphere += 3;
  if (venue.category === "fan_zone") atmosphere += 6;
  if (venue.verified === "primary") atmosphere += 2;

  let capacity = 0;
  if (cap >= 1000) capacity = 10;
  else if (cap >= 300) capacity = 7;
  else if (cap >= 100) capacity = 4;
  else if (cap > 0) capacity = 2;

  const total = size + coverage + central + bigScreen + atmosphere + capacity;
  return { total, size, coverage, central, bigScreen, atmosphere, capacity };
}

export interface RecommendationFilters {
  wantsAlcohol: boolean;
  familyFriendly: boolean;
  freeOnly: boolean;
  maxKm: number;
  userLocation: { lat: number; lng: number } | null;
  match?: { norwayMatch?: boolean } | null;
}

export interface Recommendation {
  venue: Venue;
  score: number;
  reasons: string[];
}

export function recommend(venues: Venue[], opts: RecommendationFilters): Recommendation[] {
  const center = opts.userLocation ?? SENTRUM;
  return venues
    .map((v) => {
      const reasons: string[] = [];
      let score = vmScore(v).total;

      if (opts.wantsAlcohol && v.alcohol === true) {
        score += 6;
        reasons.push("alkoholservering");
      }
      if (opts.wantsAlcohol && v.alcohol === false) score -= 30;

      if (opts.familyFriendly && v.familyFriendly === true) {
        score += 10;
        reasons.push("familievennlig");
      }
      if (opts.familyFriendly && v.ageLimit && v.ageLimit >= 18) score -= 40;

      if (opts.freeOnly && !v.ticketRequired) {
        score += 6;
        reasons.push("gratis inngang");
      }
      if (opts.freeOnly && v.ticketRequired) score -= 50;

      if (opts.match?.norwayMatch && v.showsNorwayMatches) {
        score += 4;
        reasons.push("viser Norges kamper");
      }

      let km = Infinity;
      if (v.lat && v.lng) {
        km = haversineKm({ lat: v.lat, lng: v.lng }, center);
        if (km <= opts.maxKm) {
          const dist = (opts.maxKm - km) / opts.maxKm;
          score += Math.round(dist * 8);
          if (km < 0.5) reasons.push("svært nær deg");
        } else {
          score -= 60;
        }
      }

      return { venue: v, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
