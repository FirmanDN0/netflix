export interface MediaItem {
  id: string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  type?: 'movie' | 'tv';
  imdb_id?: string;
}

export interface Genre {
    id: number;
    name: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '3fd2be6f0c70a2a598f084ddfb75487c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const VIDAPI_MOVIES = 'https://vidapi.ru/movies/latest/page-';
const VIDAPI_TV = 'https://vidapi.ru/tvshows/latest/page-';

/**
 * Helper to filter out content that is likely not available on servers yet
 */
function filterAvailableContent(items: MediaItem[]): MediaItem[] {
  const now = new Date();
  return items.filter(item => {
    // 1. Must have a poster
    if (!item.poster_path || item.poster_path.includes("null")) return false;

    // 2. Must have a release date
    const dateStr = item.release_date || item.first_air_date;
    if (!dateStr) return false;

    // 3. Must be released (not in the future)
    const releaseDate = new Date(dateStr);
    if (releaseDate > now) return false;

    return true;
  });
}

export async function fetchMovies(): Promise<MediaItem[]> {
    try {
        const res = await fetch(`${VIDAPI_MOVIES}1.json`);
        if (res.ok) {
            const data = await res.json();
            const items = data.items.map((i: any) => ({
                id: i.imdb_id || i.tmdb_id?.toString(),
                title: i.title,
                poster_path: i.poster_url,
                type: 'movie',
                imdb_id: i.imdb_id,
                release_date: i.year?.toString()
            }));
            return filterAvailableContent(items);
        }
    } catch (e) {}
    return [];
}

export async function fetchTvShows(): Promise<MediaItem[]> {
    try {
        const res = await fetch(`${VIDAPI_TV}1.json`);
        if (res.ok) {
            const data = await res.json();
            const items = data.items.map((i: any) => ({
                id: i.imdb_id || i.tmdb_id?.toString(),
                title: i.title,
                poster_path: i.poster_url,
                type: 'tv',
                imdb_id: i.imdb_id,
                release_date: i.year?.toString()
            }));
            return filterAvailableContent(items);
        }
    } catch (e) {}
    return [];
}

export async function getRecentlyAdded(type: 'movie' | 'tv' = 'movie') {
  return type === 'movie' ? await fetchMovies() : await fetchTvShows();
}

export async function getTopRated(type: 'movie' | 'tv' = 'movie') {
    const res = await fetch(`${TMDB_BASE_URL}/${type}/top_rated?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const items = (data.results || []).map((item: any) => ({
        id: item.id?.toString() || "",
        title: item.title || item.name,
        poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
        type: type,
        release_date: item.release_date || item.first_air_date
    }));
    return filterAvailableContent(items);
}

export async function getMostPopular(type: 'movie' | 'tv' = 'movie') {
    const res = await fetch(`${TMDB_BASE_URL}/${type}/popular?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const items = (data.results || []).map((item: any) => ({
        id: item.id?.toString() || "",
        title: item.title || item.name,
        poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
        type: type,
        release_date: item.release_date || item.first_air_date
    }));
    return filterAvailableContent(items);
}

export async function getGenres(type: 'movie' | 'tv'): Promise<Genre[]> {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        return data.genres || [];
    } catch (e) {
        return [];
    }
}

export async function getCountries() {
    return [
        { code: 'US', name: 'USA' },
        { code: 'ID', name: 'Indonesia' },
        { code: 'KR', name: 'South Korea' },
        { code: 'JP', name: 'Japan' },
        { code: 'GB', name: 'UK' },
        { code: 'FR', name: 'France' },
        { code: 'ES', name: 'Spain' },
        { code: 'IN', name: 'India' },
    ];
}

export async function discoverContent(params: {
    type: 'movie' | 'tv';
    genre?: string;
    country?: string;
    year?: string;
    sortBy?: string;
    page?: number;
}): Promise<MediaItem[]> {
    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: params.sortBy || 'popularity.desc',
        page: (params.page || 1).toString()
    });

    if (params.genre) queryParams.set("with_genres", params.genre);
    if (params.country) queryParams.set("with_origin_country", params.country);
    if (params.year) {
        if (params.type === 'movie') queryParams.set("primary_release_year", params.year);
        else queryParams.set("first_air_date_year", params.year);
    }

    const url = `${TMDB_BASE_URL}/discover/${params.type}?${queryParams.toString()}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const items = (data.results || []).map((item: any) => ({
            id: item.id?.toString() || "",
            title: item.title || item.name,
            name: item.title || item.name,
            poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
            type: params.type,
            release_date: item.release_date || item.first_air_date,
            overview: item.overview
        }));
        return filterAvailableContent(items);
    } catch (e) {
        return [];
    }
}

export async function getMediaDetails(id: string, type: 'movie' | 'tv'): Promise<MediaItem | null> {
    if (!id) return null;
    
    try {
        const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`);
        if (res.ok) {
            const data = await res.json();
            const extRes = await fetch(`${TMDB_BASE_URL}/${type}/${id}/external_ids?api_key=${TMDB_API_KEY}`);
            const extData = await extRes.json();
            
            return {
                id: data.id?.toString() || id,
                title: data.title || data.name,
                name: data.title || data.name,
                poster_path: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : "",
                backdrop_path: data.backdrop_path ? `${IMAGE_BASE_URL}${data.backdrop_path}` : "",
                overview: data.overview,
                release_date: data.release_date || data.first_air_date,
                type,
                imdb_id: extData.imdb_id || (id?.startsWith('tt') ? id : undefined)
            };
        }
    } catch (e) {}

    return { id, title: "Loading...", poster_path: "", type, imdb_id: id?.startsWith('tt') ? id : undefined };
}

export async function searchContent(query: string): Promise<MediaItem[]> {
  if (!query || query.length < 2) return [];
  try {
      const res = await fetch(`${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      const items = (data.results || [])
          .filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv')
          .map((item: any) => ({
              id: item.id?.toString() || "",
              title: item.title || item.name,
              name: item.title || item.name,
              poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
              type: item.media_type,
              release_date: item.release_date || item.first_air_date,
              overview: item.overview
          }));
      return filterAvailableContent(items);
  } catch (error) {
      return [];
  }
}
