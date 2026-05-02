"use client";

import { MediaItem } from "@/lib/api";
import MovieCard from "./MovieCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RowSectionProps {
  title: string;
  items: MediaItem[];
  type?: 'movie' | 'tv';
}

export default function RowSection({ title, items, type = 'movie' }: RowSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 relative group/section">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        {title}
      </h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-black/80 text-white p-2 rounded-full opacity-0 group-hover/section:opacity-100 hover:bg-primary transition-all shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 px-1"
        >
          {items.map((item) => (
            <div key={`${type}-${item.id}`} className="min-w-[150px] sm:min-w-[180px] lg:min-w-[200px] snap-start">
              <MovieCard item={item} type={type} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-black/80 text-white p-2 rounded-full opacity-0 group-hover/section:opacity-100 hover:bg-primary transition-all shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
