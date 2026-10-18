import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HomeFocus =
  | "Tous"
  | "Rust & CLI"
  | "OSINT"
  | "Firmware"
  | "Local-First"
  | "All"
  | "Systèmes"
  | "Sécurité"
  | "Open Source"
  | "Outillage"
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
