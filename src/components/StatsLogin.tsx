import { Icon } from "./icons";

/* Innloggingsskjerm for /stats. Ren HTML-form som poster til
   /api/stats/login — ingen klient-JS nødvendig. */
export default function StatsLogin({
  error,
  configured,
}: {
  error: boolean;
  configured: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="lg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon.Flame size={20} className="text-red-400" />
          <h1 className="text-[18px] font-semibold">Statistikk</h1>
        </div>

        {!configured ? (
          <p className="text-[13px] leading-relaxed text-amber-300/90">
            Passord er ikke satt opp ennå. Legg til miljøvariabelen{" "}
            <code className="text-[12.5px]">STATS_PASSWORD</code> i Vercel.
          </p>
        ) : (
          <form method="POST" action="/api/stats/login" className="space-y-3">
            <p className="text-[13px] text-[var(--text-muted)]">
              Skriv inn passordet for å se besøksstatistikken.
            </p>
            <input
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              placeholder="Passord"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-[15px] text-white placeholder:text-slate-500 focus:border-red-400/60 focus:outline-none"
            />
            {error && (
              <p className="text-[13px] text-red-400">Feil passord. Prøv igjen.</p>
            )}
            <button
              type="submit"
              className="lg-capsule w-full bg-red-500 px-4 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-400"
            >
              Logg inn
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
