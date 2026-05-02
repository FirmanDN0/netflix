"use client";

import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/api";
import { useState, useEffect } from "react";
import { isInWatchlist, toggleWatchlist } from "@/lib/storage";

interface MovieCardProps {
  item: MediaItem;
  type?: 'movie' | 'tv';
  progress?: number; // percentage 0-100
}

export default function MovieCard({ item, type = 'movie', progress }: MovieCardProps) {
  const [saved, setSaved] = useState(false);
  
  // To avoid hydration errors with localStorage
  useEffect(() => {
    setSaved(isInWatchlist(item.id.toString(), type));
  }, [item.id, type]);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleWatchlist({
      id: item.id.toString(),
      type,
      title: item.title || item.name || "",
      poster: item.poster_path || "",
    });
    setSaved(isNowSaved);
  };

  const linkHref = `/${type}/${item.id}`;

  return (
    <div className="group relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg bg-surface">
      <Link href={linkHref} className="block w-full h-full">
        <div className="aspect-[2/3] w-full relative">
          {item.poster_path ? (
            <img 
              src={item.poster_path} 
              alt={item.title || item.name} 
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-surface-hover flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-hover mb-2 transition-transform hover:scale-110">
              <Play className="w-5 h-5 ml-1" fill="currentColor" />
            </button>
            
            <h4 className="text-white font-semibold text-sm line-clamp-1">
              {item.title || item.name}
            </h4>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
              <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
              {item.vote_average ? (
                <span className="flex items-center text-green-400 font-medium">
                  ★ {item.vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>
            
            <button 
              onClick={handleToggleWatchlist}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/20"
              title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
