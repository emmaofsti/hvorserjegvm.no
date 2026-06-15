import "server-only";
import crypto from "node:crypto";

/* Enkel passordbeskyttelse for /stats. Passordet ligger som
   miljøvariabelen STATS_PASSWORD og forlater aldri serveren. Etter
   innlogging settes en httpOnly-cookie med et token (hash av passordet),
   så selve passordet aldri lagres i nettleseren. */

export const STATS_COOKIE = "stats_auth";

export function tokenForPassword(pw: string): string {
  return crypto.createHash("sha256").update(`stats:${pw}`).digest("hex");
}

export function passwordConfigured(): boolean {
  return !!process.env.STATS_PASSWORD;
}

export function checkPassword(pw: string): boolean {
  const real = process.env.STATS_PASSWORD;
  if (!real) return false;
  const a = Buffer.from(pw);
  const b = Buffer.from(real);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const real = process.env.STATS_PASSWORD;
  if (!real) return false;
  const expected = Buffer.from(tokenForPassword(real));
  const got = Buffer.from(token);
  return expected.length === got.length && crypto.timingSafeEqual(expected, got);
}
