import { getMediaDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import Player from "@/components/Player";

export default async function WatchPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ type: string, id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { type, id } = resolvedParams;

  if (type !== 'movie' && type !== 'tv') {
    notFound();
  }

  const media = await getMediaDetails(id, type as 'movie' | 'tv');

  if (!media) {
    notFound();
  }

  const season = resolvedSearchParams.season ? Number(resolvedSearchParams.season) : undefined;
  const episode = resolvedSearchParams.episode ? Number(resolvedSearchParams.episode) : undefined;

  return (
    <Player 
      id={media.imdb_id || id}
      type={type as 'movie' | 'tv'}
      title={media.title || media.name || ""}
      poster={media.poster_path || ""}
      season={season}
      episode={episode}
    />
  );
}
