import { getMediaDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import { Calendar, Star, Plus, Share2, Video, Tv, Play } from "lucide-react";
import EpisodeSelector from "@/components/EpisodeSelector";
import BackButton from "@/components/BackButton";

export const dynamic = 'force-dynamic';

export default async function TvDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    notFound();
  }

  const show = await getMediaDetails(resolvedParams.id, 'tv');

  if (!show) {
    notFound();
  }

  return (
    <div className="relative min-h-screen pb-20 bg-background overflow-hidden">
      {/* Backdrop with layered gradients */}
      <div className="absolute inset-0 h-[60vh] sm:h-[80vh] w-full z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
        {show.backdrop_path || show.poster_path ? (
          <img 
            src={show.backdrop_path || show.poster_path} 
            alt={show.name} 
            className="w-full h-full object-cover object-center opacity-40 scale-105 blur-[2px]"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-24 sm:pt-28 lg:px-8">
        <BackButton href="/tv" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start text-center lg:text-left mt-6 mb-16">
          {/* Poster Section */}
          <div className="w-48 xs:w-56 sm:w-80 shrink-0 rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/10 group relative">
            {show.poster_path ? (
              <img src={show.poster_path} alt={show.name} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full aspect-[2/3] bg-surface-hover flex items-center justify-center">
                No Poster
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="max-w-4xl w-full">
            <div className="flex flex-col items-center lg:items-start gap-3 sm:gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] sm:text-xs font-black rounded-full border border-primary/30 uppercase tracking-widest flex items-center gap-2">
                <Tv className="w-3 h-3" />
                TV Series
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-2 tracking-tighter drop-shadow-2xl leading-[1.1] sm:leading-tight">
                {show.name}
              </h1>
            </div>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[11px] sm:text-sm text-gray-300 mb-8 font-bold">
              {show.first_air_date && (
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 h-4 text-primary" />
                  {show.first_air_date.split('-')[0]}
                </span>
              )}
              {show.vote_average ? (
                <span className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20">
                  <Star className="w-3.5 h-3.5 sm:w-4 h-4" fill="currentColor" />
                  {show.vote_average.toFixed(1)} Rating
                </span>
              ) : null}
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="w-1.5 h-1.5 sm:w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                All Seasons
              </span>
            </div>

            <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl drop-shadow-lg font-medium opacity-90">
              {show.overview || "No description available for this title."}
            </p>

            {/* Buttons Grid */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button 
                onClick={() => {
                   const el = document.getElementById('episode-section');
                   el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all hover:scale-105 shadow-2xl shadow-primary/40 active:scale-95 group"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" fill="currentColor" />
                WATCH EPISODES
              </button>

              <div className="flex gap-3 justify-center">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all border border-white/10 active:scale-95 group">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
                  LIST
                </button>

                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all border border-white/10 active:scale-95">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  TRAILER
                </button>

                <button className="flex-none p-3.5 sm:p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl sm:rounded-2xl border border-white/10 transition-all">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="episode-section" className="max-w-6xl mx-auto pt-10 scroll-mt-24">
          <div className="mb-8 flex items-center gap-3 justify-center lg:justify-start">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">Select Episode</h2>
          </div>
          <EpisodeSelector tvId={show.id.toString()} />
        </div>
      </div>
    </div>
  );
}
