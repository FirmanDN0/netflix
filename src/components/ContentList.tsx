import { MediaItem } from "@/lib/api";
import Link from "next/link";
import { Play } from "lucide-react";

interface ContentListProps {
  title: string;
  items: MediaItem[];
  type?: 'movie' | 'tv';
}

export default function ContentList({ title, items, type = 'movie' }: ContentListProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => {
          const linkHref = `/${type}/${item.id}`;
          return (
            <Link key={`${type}-${item.id}`} href={linkHref}>
              <div className="group flex items-center gap-4 bg-surface hover:bg-surface-hover p-2 rounded-xl transition-colors border border-transparent hover:border-border cursor-pointer">
                <span className="text-2xl font-bold text-gray-700 w-8 text-center shrink-0">
                  {idx + 1}
                </span>
                
                <div className="h-20 w-14 sm:h-24 sm:w-16 shrink-0 relative rounded overflow-hidden">
                  {item.poster_path ? (
                    <img src={item.poster_path} alt={item.title || item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-border" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                    {item.vote_average && (
                      <span className="text-green-400">★ {item.vote_average.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
