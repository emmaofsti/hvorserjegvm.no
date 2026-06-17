import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/* Henter tall fra Google Analytics Data API (GA4) på server-siden.
   Krever to miljøvariabler:
     - GA_PROPERTY_ID          (tallet, f.eks. 541473664)
     - GA_SERVICE_ACCOUNT_JSON (hele service-account-nøkkelen som JSON)
   Nøkkelen forlater aldri serveren — klienten får bare ferdig-aggregerte
   tall via /api/stats. */

const PROPERTY_ID = process.env.GA_PROPERTY_ID;

let cachedClient: BetaAnalyticsDataClient | null = null;
function getClient(): BetaAnalyticsDataClient {
  if (cachedClient) return cachedClient;
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GA_SERVICE_ACCOUNT_JSON mangler");
  if (!PROPERTY_ID) throw new Error("GA_PROPERTY_ID mangler");
  const creds = JSON.parse(raw);
  cachedClient = new BetaAnalyticsDataClient({
    projectId: creds.project_id,
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  });
  return cachedClient;
}

const property = () => `properties/${PROPERTY_ID}`;
const num = (v: string | null | undefined) => Number(v ?? 0) || 0;

export type Stats = {
  realtime: { total: number; byCountry: { country: string; users: number }[] };
  totals: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    views: number;
    engagementPerSession: number; // sekunder
    viewsPerSession: number;
    engagementRate: number; // 0–100
    totalEngagedHours: number;
  };
  hourly: { dateHour: string; users: number }[]; // dateHour = YYYYMMDDHH
  topPages: { title: string; views: number }[];
  channels: { channel: string; sessions: number }[];
  countries: { country: string; users: number }[];
  events: { name: string; count: number }[];
  fetchedAt: string;
};

// Enkel in-memory-cache så flere samtidige seere (og hyppig polling) ikke
// brenner GA-kvoten. Lever bare så lenge serverinstansen er varm.
// Datoene er GA-uttrykk: "today", "yesterday", "NdaysAgo" eller "YYYY-MM-DD".
// from/to styrer totaltallene, hourFrom/hourTo styrer time-for-time-grafen.
const cache: Record<string, { data: Stats; ts: number }> = {};
const TTL_MS = 45_000;

export async function getStats(
  from: string,
  to: string,
  hourFrom: string,
  hourTo: string,
): Promise<Stats> {
  const key = `${from}|${to}|${hourFrom}|${hourTo}`;
  const cached = cache[key];
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.data;

  const client = getClient();
  const range = [{ startDate: from, endDate: to }];
  const hourlyRange = [{ startDate: hourFrom, endDate: hourTo }];

  const [
    [totalsRes],
    [hourlyRes],
    [pagesRes],
    [channelsRes],
    [countriesRes],
    [eventsRes],
    [realtimeRes],
  ] = await Promise.all([
    client.runReport({
      property: property(),
      dateRanges: range,
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "userEngagementDuration" },
        { name: "screenPageViewsPerSession" },
        { name: "engagementRate" },
      ],
    }),
    client.runReport({
      property: property(),
      dateRanges: hourlyRange,
      dimensions: [{ name: "dateHour" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "dateHour" } }],
      limit: 200,
    }),
    client.runReport({
      property: property(),
      dateRanges: range,
      dimensions: [{ name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    }),
    client.runReport({
      property: property(),
      dateRanges: range,
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    client.runReport({
      property: property(),
      dateRanges: range,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 8,
    }),
    client.runReport({
      property: property(),
      dateRanges: range,
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 8,
    }),
    client.runRealtimeReport({
      property: property(),
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    }),
  ]);

  const t = totalsRes.rows?.[0]?.metricValues ?? [];
  const sessions = num(t[2]?.value);
  const engagementDuration = num(t[4]?.value);

  const realtimeRows =
    realtimeRes.rows?.map((r) => ({
      country: r.dimensionValues?.[0]?.value ?? "Ukjent",
      users: num(r.metricValues?.[0]?.value),
    })) ?? [];

  const data: Stats = {
    realtime: {
      total: realtimeRows.reduce((s, r) => s + r.users, 0),
      byCountry: realtimeRows,
    },
    totals: {
      activeUsers: num(t[0]?.value),
      newUsers: num(t[1]?.value),
      sessions,
      views: num(t[3]?.value),
      engagementPerSession: sessions ? engagementDuration / sessions : 0,
      viewsPerSession: num(t[5]?.value),
      engagementRate: num(t[6]?.value) * 100,
      totalEngagedHours: engagementDuration / 3600,
    },
    hourly:
      hourlyRes.rows?.map((r) => ({
        dateHour: r.dimensionValues?.[0]?.value ?? "",
        users: num(r.metricValues?.[0]?.value),
      })) ?? [],
    topPages:
      pagesRes.rows?.map((r) => ({
        title: r.dimensionValues?.[0]?.value ?? "",
        views: num(r.metricValues?.[0]?.value),
      })) ?? [],
    channels:
      channelsRes.rows?.map((r) => ({
        channel: r.dimensionValues?.[0]?.value ?? "",
        sessions: num(r.metricValues?.[0]?.value),
      })) ?? [],
    countries:
      countriesRes.rows?.map((r) => ({
        country: r.dimensionValues?.[0]?.value ?? "",
        users: num(r.metricValues?.[0]?.value),
      })) ?? [],
    events:
      eventsRes.rows?.map((r) => ({
        name: r.dimensionValues?.[0]?.value ?? "",
        count: num(r.metricValues?.[0]?.value),
      })) ?? [],
    fetchedAt: new Date().toISOString(),
  };

  cache[key] = { data, ts: Date.now() };
  return data;
}
