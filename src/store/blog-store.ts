import { create } from "zustand";
import { persist } from "zustand/middleware";

type BlogState = {
  query: string;
  selectedCategory: string;
  selectedTag: string;
  sortBy: "newest" | "oldest" | "read-desc" | "read-asc" | "title-asc";
  setQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (selectedTag: string) => void;
  setSortBy: (sortBy: BlogState["sortBy"]) => void;
  // For backwards compatibility
  source?: string;
  setSource?: (source: string) => void;
};

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      query: "",
      selectedCategory: "All",
      selectedTag: "All",
      sortBy: "newest",
      setQuery: (query) => set({ query }),
      setSelectedCategory: (selectedCategory) =>
        set({ selectedCategory, source: selectedCategory }),
      setSelectedTag: (selectedTag) => set({ selectedTag }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSource: (source) => set({ selectedCategory: source, source }),
    }),
    {
      name: "voldigoade-blog-store",
      partialize: (state) => ({
        query: state.query,
        selectedCategory: state.selectedCategory,
        selectedTag: state.selectedTag,
        sortBy: state.sortBy,
      }),
    },
  ),
);
