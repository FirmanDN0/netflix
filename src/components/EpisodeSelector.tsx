"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, List } from "lucide-react";

interface EpisodeSelectorProps {
  tvId: string;
}

export default function EpisodeSelector({ tvId }: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  
  // Mock data for seasons and episodes
  const mockSeasons = [1, 2, 3, 4, 5];
  const mockEpisodes = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="mt-8 sm:mt-12 bg-surface p-4 sm:p-8 rounded-2xl border border-white/5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <List className="w-6 h-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Episodes</h2>
        </div>
        
        <div className="flex items-center gap-3 bg-background/50 border border-white/5 p-1 rounded-xl">
          {mockSeasons.slice(0, 3).map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedSeason === s 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              S{s}
            </button>
          ))}
          {mockSeasons.length > 3 && (
            <select 
              value={selectedSeason > 3 ? selectedSeason : ""}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-transparent text-gray-400 font-bold text-sm outline-none px-2 cursor-pointer"
            >
              <option value="" disabled>More</option>
              {mockSeasons.slice(3).map(s => (
                <option key={s} value={s} className="bg-surface">S{s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {mockEpisodes.map(ep => (
          <Link 
            key={ep}
            href={`/watch/tv/${tvId}?season=${selectedSeason}&episode=${ep}`}
            className="group flex items-center justify-between p-4 bg-background/40 rounded-xl hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {ep}
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Episode</span>
                <span className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                  Episode {ep}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
