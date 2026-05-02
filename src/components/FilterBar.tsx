"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Genre, getGenres, getCountries } from "@/lib/api";
import { Filter, ChevronDown, X, Check } from "lucide-react";

interface FilterBarProps {
  type: 'movie' | 'tv';
}

export default function FilterBar({ type }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<{code: string, name: string}[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    genre: searchParams.get("genre") || "",
    country: searchParams.get("country") || "",
    year: searchParams.get("year") || "",
    sortBy: searchParams.get("sortBy") || "popularity.desc"
  });

  useEffect(() => {
    async function loadData() {
      const [g, c] = await Promise.all([getGenres(type), getCountries()]);
      setGenres(g);
      setCountries(c);
    }
    loadData();
  }, [type]);

  useEffect(() => {
    setLocalFilters({
      genre: searchParams.get("genre") || "",
      country: searchParams.get("country") || "",
      year: searchParams.get("year") || "",
      sortBy: searchParams.get("sortBy") || "popularity.desc"
    });
  }, [searchParams]);

  const activeGenreName = genres.find(g => g.id.toString() === searchParams.get("genre"))?.name;
  const pageTitle = activeGenreName ? `${activeGenreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}` : (type === 'movie' ? 'Movies' : 'TV Shows');

  // New function for instant genre application
  const handleGenreClick = (genreId: string) => {
    const newGenre = localFilters.genre === genreId ? "" : genreId;
    setLocalFilters(prev => ({ ...prev, genre: newGenre }));
    
    // Apply immediately to URL
    const params = new URLSearchParams(searchParams.toString());
    if (newGenre) params.set("genre", newGenre);
    else params.delete("genre");
    
    router.push(`/${type === 'movie' ? 'movies' : 'tv'}?${params.toString()}`);
  };

  const applyFilters = () => {
    setIsApplying(true);
    const params = new URLSearchParams();
    if (localFilters.genre) params.set("genre", localFilters.genre);
    if (localFilters.country) params.set("country", localFilters.country);
    if (localFilters.year) params.set("year", localFilters.year);
    if (localFilters.sortBy) params.set("sortBy", localFilters.sortBy);
    
    router.push(`/${type === 'movie' ? 'movies' : 'tv'}?${params.toString()}`);
    setTimeout(() => setIsApplying(false), 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applyFilters();
  };

  const clearFilters = () => {
    setLocalFilters({ genre: "", country: "", year: "", sortBy: "popularity.desc" });
    router.push(`/${type === 'movie' ? 'movies' : 'tv'}`);
  };

  const hasFilters = localFilters.genre || localFilters.country || localFilters.year || localFilters.sortBy !== "popularity.desc";

  return (
    <div className="mb-8 relative z-30">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h1>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isOpen ? "bg-primary border-primary text-white" : "bg-surface border-border text-gray-300 hover:border-gray-500"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm bg-surface/50 px-3 py-1.5 rounded-full border border-border/50"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={localFilters.sortBy}
            onChange={(e) => {
              const newVal = e.target.value;
              setLocalFilters(prev => ({ ...prev, sortBy: newVal }));
              const params = new URLSearchParams(searchParams.toString());
              params.set("sortBy", newVal);
              router.push(`/${type === 'movie' ? 'movies' : 'tv'}?${params.toString()}`);
            }}
            className="bg-surface border border-border text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="primary_release_date.desc">Newest</option>
          </select>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-6 bg-surface border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Category</label>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGenreClick(g.id.toString())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      localFilters.genre === g.id.toString() 
                        ? "bg-primary text-white" 
                        : "bg-surface-hover text-gray-400 hover:text-white"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Country</label>
                <select 
                  value={localFilters.country}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-surface-hover border border-border text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Year</label>
                <input 
                  type="number"
                  placeholder="e.g. 2024"
                  value={localFilters.year}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full bg-surface-hover border border-border text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end items-end">
              <button
                onClick={applyFilters}
                disabled={isApplying}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isApplying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-5 h-5" />
                )}
                APPLY FILTERS
              </button>
              <p className="text-[10px] text-gray-500 mt-2 italic">Press Enter to apply filters faster</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
