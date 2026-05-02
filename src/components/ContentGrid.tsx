import { MediaItem } from "@/lib/api";
import MovieCard from "./MovieCard";

interface ContentGridProps {
  title: string;
  items: MediaItem[];
  type?: 'movie' | 'tv';
}

export default function ContentGrid({ title, items, type = 'movie' }: ContentGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
        {items.map((item) => (
          <MovieCard key={`${type}-${item.id}`} item={item} type={type} />
        ))}
      </div>
    </section>
  );
}
