import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HomeFocus =
  | "Tous"
  | "Systèmes"
  | "Sécurité"
  | "Open Source"
  | "Outillage"
  | "All"
  | "Systems"
  | "Security"
  | "Tooling";

type HomeState = {
  focus: HomeFocus;
  setFocus: (focus: HomeFocus) => void;
};

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      focus: "Tous",
      setFocus: (focus) => set({ focus }),
    }),
    {
      name: "home-store",
      partialize: (state) => ({ focus: state.focus }),
    },
  ),
);
