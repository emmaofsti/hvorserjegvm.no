import { cookies } from "next/headers";
import { isValidToken, STATS_COOKIE } from "@/lib/statsAuth";
import { getStats } from "@/lib/ga";

// Slipper bare gjennom gyldige GA-datouttrykk, ikke vilkårlig input.
function validDate(s: string | null, fallback: string): string {
  if (
    s &&
    (/^\d{4}-\d{2}-\d{2}$/.test(s) ||
      /^(today|yesterday)$/.test(s) ||
      /^\d{1,3}daysAgo$/.test(s))
  ) {
    return s;
  }
  return fallback;
}

export async function GET(req: Request) {
  const store = await cookies();
  if (!isValidToken(store.get(STATS_COOKIE)?.value)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const sp = new URL(req.url).searchParams;
    const from = validDate(sp.get("from"), "90daysAgo");
    const to = validDate(sp.get("to"), "today");
    const hourFrom = validDate(sp.get("hourFrom"), "3daysAgo");
    const hourTo = validDate(sp.get("hourTo"), "today");
    const data = await getStats(from, to, hourFrom, hourTo);
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
