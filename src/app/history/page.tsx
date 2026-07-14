"use client";

import Link from "next/link";
import { useHistory } from "@/hooks/useHistory";

export default function HistoryPage() {
  const { history } = useHistory();

  return (
    <main className="container-custom py-20">

      <h1 className="mb-8 text-4xl font-bold">
        Search History
      </h1>

      {history.length === 0 ? (
        <p>No searches yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((symbol) => (
            <Link
              key={symbol}
              href={`/dashboard?company=${symbol}`}
              className="block rounded-lg bg-slate-900 p-5 hover:bg-slate-800"
            >
              {symbol}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}