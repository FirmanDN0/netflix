"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { searchContent, MediaItem } from "@/lib/api";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Instant search: no long debounce, search even for 1 character
    const performSearch = async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        const data = await searchContent(query);
        setResults(data.slice(0, 8)); // Show up to 8 results
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timer = setTimeout(performSearch, 150); // Small debounce for performance but feels instant
    return () => clearTimeout(timer);
  }, [query]);

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <span key={i} className="text-primary font-bold underline decoration-2">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center bg-surface border border-border rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-primary focus-within:w-80 transition-all duration-300">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-gray-500"
          autoComplete="off"
        />
        {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin ml-2" />}
        {query && !isLoading && (
          <button onClick={() => setQuery("")} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full min-w-[320px] right-0 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 glass-panel">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-border/50 mb-1">
                Matching Titles
              </div>
              <ul>
                {results.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={`/${item.type}/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                    >
                      {item.poster_path ? (
                        <img src={item.poster_path} alt="" className="w-10 h-14 object-cover rounded shadow-md" />
                      ) : (
                        <div className="w-10 h-14 bg-border rounded flex-shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate">
                          {highlightMatch(item.title || item.name || "", query)}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase mt-0.5">
                          {item.type} • {item.release_date || item.first_air_date}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            !isLoading && (
              <div className="p-8 text-center text-sm text-gray-400">
                <p>No results found for "<span className="text-white italic">{query}</span>"</p>
                <p className="text-xs mt-1 italic">Try searching for something else</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
