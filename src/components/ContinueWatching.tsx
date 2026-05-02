"use client";

import { useEffect, useState } from "react";
import { getContinueWatching, ProgressData } from "@/lib/storage";
import Link from "next/link";
import { Play } from "lucide-react";

export default function ContinueWatching() {
  const [items, setItems] = useState<ProgressData[]>([]);

  useEffect(() => {
    setItems(getContinueWatching().slice(0, 4)); // Get top 4 most recent
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Continue Watching
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
          const linkHref = `/${item.type}/${item.id}`;
          
          return (
            <div key={`${item.type}-${item.id}`} className="group relative rounded-xl overflow-hidden bg-surface shadow-lg border border-border/50 hover:border-primary/50 transition-colors">
              <Link href={linkHref} className="flex flex-row h-32 md:h-40">
                <div className="w-1/3 relative shrink-0">
                  {item.poster ? (
                    <img 
                      src={item.poster} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  {/* Progress overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                      <Play className="w-4 h-4 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</h3>
                    {item.type === 'tv' && item.season !== undefined && item.episode !== undefined && (
                      <p className="text-xs text-primary mt-1">
                        S{item.season} E{item.episode}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{Math.round(progressPercent)}% completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
