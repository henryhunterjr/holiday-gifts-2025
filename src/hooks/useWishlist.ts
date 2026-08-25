import { useCallback, useEffect, useState } from "react";

const KEY = "bgb.wishlist.v1";
const EVENT = "bgb-wishlist-change";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* storage full or blocked — keep the in-memory list working */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Saved-gift list backed by localStorage. Every hook instance listens for the
 * same custom event, so a heart tapped on one card updates the header count and
 * the drawer at once. Also syncs across tabs via the native storage event.
 */
export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
    const sync = () => setSlugs(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    write(next);
    return next.includes(slug);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { slugs, count: slugs.length, has, toggle, remove, clear };
}
