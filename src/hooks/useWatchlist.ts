"use client";

import { useEffect, useState } from "react";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");

    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  function add(symbol: string) {
    if (watchlist.includes(symbol)) return;

    const updated = [...watchlist, symbol];

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  }

  function remove(symbol: string) {
    const updated = watchlist.filter((s) => s !== symbol);

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  }

  return {
    watchlist,
    add,
    remove,
  };
}