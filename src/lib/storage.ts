export interface ProgressData {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  progress: number;
  duration: number;
  lastUpdated: number;
  season?: number;
  episode?: number;
}

export interface WatchlistItem {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  addedAt: number;
}

const PROGRESS_KEY = 'streaming_progress';
const WATCHLIST_KEY = 'streaming_watchlist';

// --- Continue Watching ---

export function getContinueWatching(): ProgressData[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    const parsed: ProgressData[] = data ? JSON.parse(data) : [];
    return parsed.sort((a, b) => b.lastUpdated - a.lastUpdated);
  } catch (e) {
    console.error('Error reading progress', e);
    return [];
  }
}

export function saveProgress(data: Omit<ProgressData, 'lastUpdated'>) {
  if (typeof window === 'undefined') return;
  const current = getContinueWatching();
  const index = current.findIndex(p => p.id === data.id && p.type === data.type);
  
  const newProgress: ProgressData = {
    ...data,
    lastUpdated: Date.now(),
  };

  if (index >= 0) {
    current[index] = newProgress;
  } else {
    current.push(newProgress);
  }

  // Optional: remove if completed (> 90%)
  const filtered = current.filter(p => {
    if (p.duration > 0 && (p.progress / p.duration) > 0.9) {
      // It's completed
      return false; // Remove completed items from continue watching
    }
    return true;
  });

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(filtered));
}

export function getProgress(id: string, type: 'movie' | 'tv'): ProgressData | undefined {
  const current = getContinueWatching();
  return current.find(p => p.id === id && p.type === type);
}

// --- Watchlist ---

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading watchlist', e);
    return [];
  }
}

export function toggleWatchlist(item: Omit<WatchlistItem, 'addedAt'>): boolean {
  if (typeof window === 'undefined') return false;
  const current = getWatchlist();
  const index = current.findIndex(w => w.id === item.id && w.type === item.type);
  
  let isAdded = false;
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push({ ...item, addedAt: Date.now() });
    isAdded = true;
  }
  
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(current));
  return isAdded;
}

export function isInWatchlist(id: string, type: 'movie' | 'tv'): boolean {
  const current = getWatchlist();
  return current.some(w => w.id === id && w.type === type);
}
