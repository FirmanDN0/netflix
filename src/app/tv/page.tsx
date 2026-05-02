import { discoverContent, getGenres } from "@/lib/api";
import ContentGrid from "@/components/ContentGrid";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import BrowseTracker from "@/components/BrowseTracker";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface TvPageProps {
  searchParams: Promise<{
    genre?: string;
    country?: string;
    year?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function TvPage({ searchParams }: TvPageProps) {
  const sParams = await searchParams;
  const genreId = sParams.genre;
  const currentPage = parseInt(sParams.page || "1");

  const [items, genres] = await Promise.all([
    discoverContent({
      type: 'tv',
      genre: genreId,
      country: sParams.country,
      year: sParams.year,
      sortBy: sParams.sortBy || 'popularity.desc',
      page: currentPage,
    }),
    getGenres('tv')
  ]);

  const activeGenre = genres.find(g => g.id.toString() === genreId)?.name;
  const title = activeGenre ? `${activeGenre} TV Shows` : "All TV Shows";

  return (
    <div className="container mx-auto px-4 lg:px-8 py-24">
      {/* Remember this page state */}
      <Suspense fallback={null}>
        <BrowseTracker />
      </Suspense>

      <FilterBar type="tv" />
      
      {items.length > 0 ? (
        <>
          <ContentGrid 
            title={title} 
            items={items} 
            type="tv" 
          />
          <Pagination currentPage={currentPage} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-xl font-medium">No results found for these filters.</p>
          <p className="text-sm">Try adjusting your selection.</p>
        </div>
      )}
    </div>
  );
}
