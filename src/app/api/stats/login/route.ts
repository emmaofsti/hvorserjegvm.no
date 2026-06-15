import { NextRequest, NextResponse } from "next/server";
import { STATS_COOKIE, checkPassword, tokenForPassword } from "@/lib/statsAuth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const pw = String(form.get("password") ?? "");

  if (!checkPassword(pw)) {
    // 303 → tving GET tilbake til innloggingssiden med feilmelding
    return NextResponse.redirect(new URL("/stats?error=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/stats", req.url), 303);
  res.cookies.set(STATS_COOKIE, tokenForPassword(pw), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dager
  });
  return res;
}
