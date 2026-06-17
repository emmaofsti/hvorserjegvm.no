import { cookies } from "next/headers";
import { isValidToken, STATS_COOKIE } from "@/lib/statsAuth";
import { getStats } from "@/lib/ga";

export async function GET(req: Request) {
  const store = await cookies();
  if (!isValidToken(store.get(STATS_COOKIE)?.value)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const period =
      new URL(req.url).searchParams.get("period") === "today" ? "today" : "all";
    const data = await getStats(period);
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
