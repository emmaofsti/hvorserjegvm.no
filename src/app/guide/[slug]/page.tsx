import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { GUIDE_SLUGS, getGuide, getRelatedGuides, type Guide } from "@/lib/guides";
import { getVenues } from "@/lib/data";
import { getVenueImageUrl, isAIGeneratedImage } from "@/lib/venueImages";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui";
import type { Venue } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide ikke funnet" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://hvorserjegvm.no/guide/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `https://hvorserjegvm.no/guide/${guide.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Server-rendered venue card. Kept server-side so the venue list is in the
 * initial HTML — that's what Google indexes.
 * ──────────────────────────────────────────────────────────── */
function GuideVenueCard({
  venue,
  rank,
  highlight,
}: {
  venue: Venue;
  rank: number;
  highlight: Guide["highlight"];
}) {
  const imageUrl = venue.imageUrl ?? getVenueImageUrl(venue.id, venue.category);
  const isAI = isAIGeneratedImage(imageUrl);
  const catLabel = CATEGORY_LABEL[venue.category];

  return (
    <Link
      href={`/sted/${venue.id}`}
      className="lg-surface lg-energize group block overflow-hidden transition-colors hover:bg-white/[0.04]"
      style={{ borderRadius: "var(--lg-r-xl)" }}
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="relative h-44 w-full shrink-0 overflow-hidden bg-white/[0.04] sm:h-auto sm:w-56"
          style={{ aspectRatio: "16 / 10" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={isAI ? `${venue.name} (AI-illustrasjon)` : venue.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-black/70 px-2 text-[12px] font-bold text-white backdrop-blur-sm">
            #{rank}
          </span>
          {/* AI-illustrasjon badge — påkrevd merking. Plassert nederst venstre
              for å ikke kollidere med rank-badge øverst. */}
          {isAI && (
            <span
              className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm"
              title="AI-generert illustrasjon, ikke ekte foto"
            >
              AI-illustrasjon
            </span>
          )}
        </div>
        <div className="flex-1 p-4 sm:p-5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="eyebrow !mb-0">{catLabel}</span>
            {venue.neighborhood && (
              <span className="text-[12px] text-slate-500">·</span>
            )}
            {venue.neighborhood && (
              <span className="text-[12px] text-slate-500">
                {venue.neighborhood}
              </span>
            )}
          </div>
          <h3 className="text-[16px] font-semibold text-slate-100 leading-snug mb-2">
            {venue.name}
          </h3>
          {venue.description && (
            <p className="text-[13.5px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
              {venue.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            {!venue.ticketRequired && (
              <Badge tone="green">
                <Icon.Free size={11} strokeWidth={2.3} /> Gratis
              </Badge>
            )}
            {venue.ticketRequired && (
              <Badge tone="yellow">
                <Icon.Ticket size={11} strokeWidth={2.3} /> Billett
              </Badge>
            )}
            {highlight === "beer_price" && venue.beerPrice != null && (
              <Badge tone="default">
                <Icon.Beer size={11} strokeWidth={2.3} />
                <span className="tnum">{venue.beerPrice} kr</span>
              </Badge>
            )}
            {highlight === "capacity" && venue.capacity && (
              <Badge tone="default">
                <Icon.Users size={11} strokeWidth={2.3} />
                {venue.capacity}
              </Badge>
            )}
            {venue.outdoorViewing && (
              <Badge tone="blue">
                <Icon.CloudSun size={11} strokeWidth={2.3} /> Ute
              </Badge>
            )}
            {venue.familyFriendly && (
              <Badge tone="blue">
                <Icon.Baby size={11} strokeWidth={2.3} /> Familie
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  fan_zone: "Fan zone",
  sports_bar: "Sportsbar",
  pub: "Pub",
  restaurant: "Restaurant",
  street_food: "Street food",
};

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const allVenues = getVenues();
  const matched = allVenues.filter(guide.filter).sort(guide.sort);
  const visible = matched.slice(0, guide.limit);
  const overflow = matched.length - visible.length;
  const related = getRelatedGuides(slug);

  /* ── JSON-LD ──────────────────────────────────────────────────────── */

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: "https://hvorserjegvm.no" },
      { "@type": "ListItem", position: 2, name: "Guide", item: "https://hvorserjegvm.no/guide" },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.h1,
        item: `https://hvorserjegvm.no/guide/${guide.slug}`,
      },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.description,
    mainEntityOfPage: `https://hvorserjegvm.no/guide/${guide.slug}`,
    author: { "@type": "Organization", name: "hvorserjegvm.no", url: "https://hvorserjegvm.no" },
    publisher: {
      "@type": "Organization",
      name: "hvorserjegvm.no",
      logo: { "@type": "ImageObject", url: "https://hvorserjegvm.no/icon.jpg" },
    },
    datePublished: "2026-06-09",
    dateModified: "2026-06-10",
    image: "https://hvorserjegvm.no/opengraph-image.jpg",
    inLanguage: "nb-NO",
    isPartOf: { "@type": "WebSite", name: "hvorserjegvm.no", url: "https://hvorserjegvm.no" },
  };

  const faqPage =
    guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  /* ItemList helps Google surface the actual venues in rich results. */
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.h1,
    numberOfItems: visible.length,
    itemListElement: visible.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://hvorserjegvm.no/sted/${v.id}`,
      name: v.name,
    })),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 sm:py-10 pb-24 sm:pb-10">
      {/* Breadcrumb (visible) */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-[12.5px] text-slate-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-slate-300">
          Hjem
        </Link>
        <Icon.ChevronRight size={11} strokeWidth={2.4} />
        <Link href="/guide" className="hover:text-slate-300">
          Guide
        </Link>
        <Icon.ChevronRight size={11} strokeWidth={2.4} />
        <span className="text-slate-400 line-clamp-1">{guide.eyebrow}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="eyebrow mb-3">
          {guide.eyebrow} · Oppdatert {guide.lastUpdated}
        </p>
        <h1 className="display display-lg text-slate-50">{guide.h1}</h1>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-300">
          {guide.intro}
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-slate-500">
          <Icon.Free size={13} strokeWidth={2.2} />
          {matched.length} {matched.length === 1 ? "sted" : "steder"} matcher dette
        </div>
      </header>

      {/* Venue list */}
      <section className="mb-12">
        {visible.length === 0 ? (
          <div
            className="lg-surface p-8 text-center text-slate-400"
            style={{ borderRadius: "var(--lg-r-xl)" }}
          >
            {guide.emptyState}
          </div>
        ) : (
          <div className="grid gap-3">
            {visible.map((venue, i) => (
              <GuideVenueCard
                key={venue.id}
                venue={venue}
                rank={i + 1}
                highlight={guide.highlight}
              />
            ))}
          </div>
        )}
        {overflow > 0 && (
          <div className="mt-5 text-center">
            <Link
              href="/"
              className="lg-capsule inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-white/[0.05] text-slate-200 border border-white/[0.08] hover:bg-white/[0.09]"
            >
              Se alle {matched.length} stedene på forsiden
              <Icon.ChevronRight size={12} strokeWidth={2.4} />
            </Link>
          </div>
        )}
      </section>

      {/* FAQ — accessible + structured-data-friendly */}
      {guide.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="display display-sm text-slate-100 mb-5">
            Vanlige spørsmål
          </h2>
          <div className="space-y-3">
            {guide.faqs.map((f, i) => (
              <details
                key={i}
                className="lg-surface group p-5"
                style={{ borderRadius: "var(--lg-r-l)" }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium text-slate-100">
                  {f.q}
                  <Icon.ChevronDown
                    size={16}
                    strokeWidth={2.2}
                    className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="mt-3 text-[14.5px] text-slate-300 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related guides — internal link graph */}
      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="display display-sm text-slate-100 mb-5">
            Relaterte guider
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="lg-surface lg-energize block p-5 transition-colors hover:bg-white/[0.04]"
                style={{ borderRadius: "var(--lg-r-l)" }}
              >
                <h3 className="text-[14.5px] font-semibold text-slate-100 mb-1 leading-snug">
                  {g.h1}
                </h3>
                <p className="text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">
                  {g.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA back to hub */}
      <div className="text-center text-[13px] text-slate-500">
        <Link href="/guide" className="underline-offset-4 hover:underline hover:text-slate-300">
          Tilbake til alle guider
        </Link>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(article).replace(/</g, "\\u003c"),
        }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPage).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemList).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}

