"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Match-favoritter — separat fra venue-favoritter.
 * Lagrer match.slug (mer stabilt enn match.id ved omimport).
 */

const STORAGE_KEY = "hvorserjegvm_favorite_matches";

let listeners: (() => void)[] = [];
function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}
function emitChange() {
  for (const l of listeners) l();
}

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* quota exceeded — silently ignore */
  }
  emitChange();
}

let cachedSnapshot: string[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = raw ? (JSON.parse(raw) as string[]) : [];
  }
  return cachedSnapshot;
}

function getServerSnapshot(): string[] {
  return [];
}

export function useFavoriteMatches() {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs],
  );

  const toggleFavorite = useCallback((slug: string) => {
    const current = readSlugs();
    const next = current.includes(slug)
      ? current.filter((x) => x !== slug)
      : [...current, slug];
    writeSlugs(next);
  }, []);

  return {
    favoriteSlugs: slugs,
    favoritesCount: slugs.length,
    isFavorite,
    toggleFavorite,
  };
}
