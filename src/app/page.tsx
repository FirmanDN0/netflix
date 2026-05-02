import { getTopRated, getMostPopular, getRecentlyAdded } from "@/lib/api";
import ContinueWatching from "@/components/ContinueWatching";
import RowSection from "@/components/RowSection";
import ContentGrid from "@/components/ContentGrid";
import ContentList from "@/components/ContentList";

export const revalidate = 3600; // Revalidate data every hour

export default async function Home() {
  const [topRatedMovies, popularTv, recentMovies] = await Promise.all([
    getTopRated('movie'),
    getMostPopular('tv'),
    getRecentlyAdded('movie'),
  ]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* 1. Main prominent resume section */}
      <ContinueWatching />

      {/* 2. Top Rated Movies using a horizontal row (limited usage) */}
      <RowSection 
        title="Top Rated Movies" 
        items={topRatedMovies.slice(0, 15)} 
        type="movie" 
      />

      {/* 3. Popular TV Shows using a Grid layout */}
      <ContentGrid 
        title="Popular TV Shows" 
        items={popularTv.slice(0, 12)} 
        type="tv" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* We can add another grid or row here if needed */}
          <ContentGrid 
            title="More Top Movies" 
            items={topRatedMovies.slice(15, 23)} 
            type="movie" 
          />
        </div>
        <div>
          {/* 4. Recently added displayed as a vertical list */}
          <ContentList 
            title="Recently Added" 
            items={recentMovies.slice(0, 6)} 
            type="movie" 
          />
        </div>
      </div>
    </div>
  );
}
