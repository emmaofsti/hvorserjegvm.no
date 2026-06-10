/**
 * 18+ / consumer-information disclaimer.
 *
 * Used on pages that show alcohol prices. Two purposes:
 *
 * 1. Signal compliance with Alkoholloven §9-2 — we present prices as
 *    *consumer information* (lovlig), not promotion (ulovlig).
 * 2. Visual age-gate reminder so Helsedirektoratet sees clear good-faith
 *    intent if the page is ever reviewed.
 *
 * Match how Pilsguiden.no frames their own price database — neutral,
 * informational, sourced to a third party.
 */
import { Icon } from "./icons";

interface AlcoholDisclaimerProps {
  /** Compact = single inline line; full = card with full explanation. */
  variant?: "compact" | "full";
}

export function AlcoholDisclaimer({ variant = "full" }: AlcoholDisclaimerProps) {
  if (variant === "compact") {
    return (
      <p className="inline-flex items-start gap-1.5 text-[11.5px] text-slate-500 leading-relaxed">
        <Icon.Info size={12} strokeWidth={2.2} className="mt-0.5 shrink-0" />
        <span>
          Forbrukerinformasjon · 18 år · prisene er fra{" "}
          <a
            href="https://www.pilsguiden.no/oslo"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-slate-300"
          >
            pilsguiden.no
          </a>
        </span>
      </p>
    );
  }

  return (
    <aside
      className="lg-surface flex items-start gap-3 p-4 sm:p-5"
      style={{ borderRadius: "var(--lg-r-l)" }}
      aria-label="Forbrukerinformasjon om alkohol"
    >
      <Icon.Info
        size={18}
        strokeWidth={2.2}
        className="mt-0.5 shrink-0 text-slate-400"
      />
      <div className="text-[12.5px] text-slate-400 leading-relaxed">
        <p className="mb-1.5">
          <strong className="text-slate-300">Forbrukerinformasjon · 18 år.</strong>{" "}
          Prisene på denne siden er innhentet fra{" "}
          <a
            href="https://www.pilsguiden.no/oslo"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-slate-200"
          >
            pilsguiden.no
          </a>{" "}
          og presenteres for forbrukerorientering — ikke som anbefaling om
          konsum.
        </p>
        <p>
          Aldersgrensen for kjøp av alkohol er 18 år (20 år for brennevin).
          Alkohol kan skade helsen. Drikker du for mye, kan du finne hjelp på{" "}
          <a
            href="https://www.helsenorge.no"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-slate-200"
          >
            helsenorge.no
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
