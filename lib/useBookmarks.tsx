import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Local storage for bookmarks, recent chapters and recent searches.
 *
 * All values use stable string keys so the same data can later be
 * served from / synced with an admin backend.
 */

const STORAGE_KEY = "smart_teknik_bookmarks_v1";
const RECENT_KEY = "smart_teknik_recent_chapters_v1";
const RECENT_SEARCHES_KEY = "smart_teknik_recent_searches_v1";

const MAX_RECENT = 12;
const MAX_RECENT_SEARCHES = 8;

interface BookmarksContextValue {
  bookmarks: string[]; // chapter ids
  recent: string[]; // chapter ids — most recent first
  recentSearches: string[];
  toggleBookmark: (chapterId: string) => Promise<void>;
  isBookmarked: (chapterId: string) => boolean;
  trackRead: (chapterId: string) => Promise<void>;
  addRecentSearch: (query: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
}

const defaultValue: BookmarksContextValue = {
  bookmarks: [],
  recent: [],
  recentSearches: [],
  toggleBookmark: async () => {},
  isBookmarked: () => false,
  trackRead: async () => {},
  addRecentSearch: async () => {},
  clearRecentSearches: async () => {},
};

const BookmarksContext = createContext<BookmarksContextValue>(defaultValue);

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [b, r, s] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(RECENT_KEY),
          AsyncStorage.getItem(RECENT_SEARCHES_KEY),
        ]);
        setBookmarks(safeParse<string[]>(b, []));
        setRecent(safeParse<string[]>(r, []));
        setRecentSearches(safeParse<string[]>(s, []));
      } catch {}
    })();
  }, []);

  const persist = useCallback(
    async (key: string, value: unknown) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },
    []
  );

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (id: string) => {
      setBookmarks((prev) => {
        const next = prev.includes(id)
          ? prev.filter((b) => b !== id)
          : [id, ...prev];
        void persist(STORAGE_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const trackRead = useCallback(
    async (id: string) => {
      setRecent((prev) => {
        const next = [id, ...prev.filter((c) => c !== id)].slice(0, MAX_RECENT);
        void persist(RECENT_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const addRecentSearch = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (q.length < 2) return;
      setRecentSearches((prev) => {
        const next = [
          q,
          ...prev.filter((s) => s.toLowerCase() !== q.toLowerCase()),
        ].slice(0, MAX_RECENT_SEARCHES);
        void persist(RECENT_SEARCHES_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    await persist(RECENT_SEARCHES_KEY, []);
  }, [persist]);

  const value = useMemo<BookmarksContextValue>(
    () => ({
      bookmarks,
      recent,
      recentSearches,
      toggleBookmark,
      isBookmarked,
      trackRead,
      addRecentSearch,
      clearRecentSearches,
    }),
    [
      bookmarks,
      recent,
      recentSearches,
      toggleBookmark,
      isBookmarked,
      trackRead,
      addRecentSearch,
      clearRecentSearches,
    ]
  );

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarksContext);
