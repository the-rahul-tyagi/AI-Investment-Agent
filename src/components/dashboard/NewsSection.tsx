import { NewsArticle } from "@/types";
import { Newspaper, ExternalLink, Calendar } from "lucide-react";

interface Props {
  news: NewsArticle[];
}

export default function NewsSection({ news }: Props) {
  return (
    <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 shadow-xl border border-white/5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Newspaper size={20} className="text-emerald-400" />
            Market Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Latest related press and media coverage
          </p>
        </div>
        <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
          {news.length} Articles
        </span>
      </div>

      <div className="space-y-4">
        {news.slice(0, 5).map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row gap-4 rounded-xl p-4 border border-white/0 hover:border-white/5 hover:bg-white/5 transition duration-300 relative overflow-hidden"
          >
            {article.image && (
              <div className="h-32 w-full sm:w-48 overflow-hidden rounded-lg bg-slate-800 border border-white/5 shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    {article.source}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                    <Calendar size={10} />
                    {new Date(article.publishedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition duration-200 line-clamp-2">
                  {article.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400/80 group-hover:text-emerald-400 transition duration-200">
                Read full article <ExternalLink size={12} />
              </div>
            </div>
          </a>
        ))}

        {news.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm">
            No news articles available for this ticker.
          </p>
        )}
      </div>
    </div>
  );
}