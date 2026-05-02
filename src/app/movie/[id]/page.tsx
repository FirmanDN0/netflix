import { getMediaDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play, Calendar, Star, Plus, Share2, Video, Info } from "lucide-react";
import BackButton from "@/components/BackButton";

// Force dynamic rendering to prevent prerendering errors with missing params
export const dynamic = 'force-dynamic';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    notFound();
  }

  const movie = await getMediaDetails(resolvedParams.id, 'movie');

  if (!movie) {
    notFound();
  }

  return (
    <div className="relative min-h-screen pb-20 bg-background overflow-hidden">
      {/* Backdrop with layered gradients */}
      <div className="absolute inset-0 h-[80vh] w-full z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
        {movie.backdrop_path || movie.poster_path ? (
          <img 
            src={movie.backdrop_path || movie.poster_path} 
            alt={movie.title} 
            className="w-full h-full object-cover object-center opacity-40 scale-105 blur-[2px]"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-28 lg:px-8">
        <BackButton href="/movies" />

        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start text-center lg:text-left">
          <div className="w-64 md:w-80 shrink-0 rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/10 group relative">
            {movie.poster_path ? (
              <img src={movie.poster_path} alt={movie.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full aspect-[2/3] bg-surface-hover flex items-center justify-center">
                No Poster
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="max-w-4xl">
            <div className="flex flex-col items-center lg:items-start gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black rounded-full border border-primary/30 uppercase tracking-widest">
                Feature Film
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter drop-shadow-2xl">{movie.title}</h1>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 mb-8 font-bold">
              {movie.release_date && (
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-primary" />
                  {movie.release_date.split('-')[0]}
                </span>
              )}
              {movie.vote_average ? (
                <span className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {movie.vote_average.toFixed(1)} Rating
                </span>
              ) : null}
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                HD • 4K
              </span>
            </div>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl drop-shadow-lg font-medium italic opacity-90">
              {movie.overview || "No description available for this title."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link 
                href={`/watch/movie/${movie.id}`}
                className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-2xl shadow-primary/40 active:scale-95 group"
              >
                <Play className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" />
                WATCH NOW
              </Link>

              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 hover:border-white/30 active:scale-95 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                MY LIST
              </button>

              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold transition-all border border-white/10 active:scale-95">
                <Video className="w-5 h-5 text-red-500" />
                TRAILER
              </button>

              <button className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all hover:text-primary">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
