"use client";

import { useEffect, useState } from "react";
import { getWatchlist, WatchlistItem } from "@/lib/storage";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { BookmarkIcon } from "lucide-react";
import { GridSkeleton } from "@/components/Skeletons";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Slight delay just to show skeleton briefly or wait for hydration
    setItems(getWatchlist().sort((a, b) => b.addedAt - a.addedAt));
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <BookmarkIcon className="w-8 h-8 text-primary" />
        My Watchlist
      </h1>

      {loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState 
          icon={BookmarkIcon}
          title="Your watchlist is empty"
          description="Looks like you haven't added any movies or TV shows to your watchlist yet."
          actionLabel="Explore Content"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {items.map((item) => (
            <MovieCard 
              key={`${item.type}-${item.id}`} 
              item={{
                id: item.id,
                title: item.title,
                poster_path: item.poster,
              }} 
              type={item.type} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
