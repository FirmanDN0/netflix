import { getMediaDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play, Calendar, Star, Info } from "lucide-react";

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const movie = await getMediaDetails(resolvedParams.id, 'movie');

  if (!movie) {
    notFound();
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* Backdrop */}
      <div className="absolute inset-0 h-[60vh] w-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        {movie.poster_path ? (
          <img 
            src={movie.poster_path} 
            alt={movie.title} 
            className="w-full h-full object-cover object-top opacity-30"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-[20vh] lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-48 md:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-border">
            {movie.poster_path ? (
              <img src={movie.poster_path} alt={movie.title} className="w-full h-auto object-cover" />
            ) : (
              <div className="w-full aspect-[2/3] bg-surface-hover flex items-center justify-center">
                No Poster
              </div>
            )}
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {movie.release_date.split('-')[0]}
                </span>
              )}
              {movie.vote_average ? (
                <span className="flex items-center gap-1 text-green-400 font-medium">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {movie.vote_average.toFixed(1)} Rating
                </span>
              ) : null}
            </div>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {movie.overview || "No description available for this title."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/watch/movie/${movie.id}`}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
