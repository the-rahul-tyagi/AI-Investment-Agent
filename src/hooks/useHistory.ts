"use client";

import { useEffect, useState } from "react";

export function useHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  function add(symbol: string) {
    const updated = [
      symbol,
      ...history.filter((s) => s !== symbol),
    ].slice(0, 10);

    setHistory(updated);

    localStorage.setItem(
      "history",
      JSON.stringify(updated)
    );
  }

  return {
    history,
    add,
  };
}