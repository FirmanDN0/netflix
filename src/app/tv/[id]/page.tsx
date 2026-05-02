import { getMediaDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import { Calendar, Star } from "lucide-react";
import EpisodeSelector from "@/components/EpisodeSelector";

export default async function TvDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const show = await getMediaDetails(resolvedParams.id, 'tv');

  if (!show) {
    notFound();
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* Backdrop */}
      <div className="absolute inset-0 h-[60vh] w-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        {show.poster_path ? (
          <img 
            src={show.poster_path} 
            alt={show.name} 
            className="w-full h-full object-cover object-top opacity-30"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-[20vh] lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-48 md:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-border">
            {show.poster_path ? (
              <img src={show.poster_path} alt={show.name} className="w-full h-auto object-cover" />
            ) : (
              <div className="w-full aspect-[2/3] bg-surface-hover flex items-center justify-center">
                No Poster
              </div>
            )}
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{show.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {show.first_air_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {show.first_air_date.split('-')[0]}
                </span>
              )}
              {show.vote_average ? (
                <span className="flex items-center gap-1 text-green-400 font-medium">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {show.vote_average.toFixed(1)} Rating
                </span>
              ) : null}
            </div>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {show.overview || "No description available for this title."}
            </p>
          </div>
        </div>

        {/* Episode Selection Section */}
        <div className="max-w-5xl mx-auto">
          <EpisodeSelector tvId={show.id.toString()} />
        </div>
      </div>
    </div>
  );
}
