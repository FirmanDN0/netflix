"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

interface EpisodeSelectorProps {
  tvId: string;
}

export default function EpisodeSelector({ tvId }: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  
  // Mock data for seasons and episodes since API might not provide full lists easily
  // In a real scenario, this data would be fetched from the API based on the tvId
  const mockSeasons = [1, 2, 3];
  const mockEpisodes = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="mt-12 bg-surface p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Episodes</h2>
        
        <select 
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-background border border-border text-foreground px-4 py-2 rounded-lg outline-none focus:border-primary"
        >
          {mockSeasons.map(s => (
            <option key={s} value={s}>Season {s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockEpisodes.map(ep => (
          <Link 
            key={ep}
            href={`/watch/tv/${tvId}?season=${selectedSeason}&episode=${ep}`}
            className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-surface-hover border border-transparent hover:border-border transition-colors group"
          >
            <div>
              <span className="text-sm text-gray-400 block mb-1">Episode {ep}</span>
              <span className="font-medium text-white group-hover:text-primary transition-colors">
                Watch Episode
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface group-hover:bg-primary flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 ml-1 text-white" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
