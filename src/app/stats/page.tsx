import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isValidToken, STATS_COOKIE, passwordConfigured } from "@/lib/statsAuth";
import StatsDashboard from "@/components/StatsDashboard";
import StatsLogin from "@/components/StatsLogin";

export const metadata: Metadata = {
  title: "Statistikk",
  robots: { index: false, follow: false },
};

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const store = await cookies();
  const authed = isValidToken(store.get(STATS_COOKIE)?.value);

  if (!authed) {
    const sp = await searchParams;
    return <StatsLogin error={!!sp.error} configured={passwordConfigured()} />;
  }
  return <StatsDashboard />;
}
