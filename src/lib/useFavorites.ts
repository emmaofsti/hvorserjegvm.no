"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "hvorserjegvm_favorites";

// ── Shared external store so every hook instance stays in sync ──
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

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* quota exceeded — silently ignore */
  }
  emitChange();
}

// Snapshot for useSyncExternalStore — must return a referentially stable
// value when the underlying data hasn't changed.
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

// ── Hook ──
export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback(
    (id: string) => ids.includes(id),
    [ids],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const current = readIds();
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      writeIds(next);
    },
    [],
  );

  return {
    favoriteIds: ids,
    favoritesCount: ids.length,
    isFavorite,
    toggleFavorite,
  };
}
