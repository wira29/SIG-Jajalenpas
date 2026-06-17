import { ruas } from "@prisma/client";
import { create } from "zustand";
import { RuasWithSta } from "../types";
import { swapLngLat } from "../utils/helpers";

type SelectedRuasStore = {
  selected: RuasWithSta | null;
  isLoading: boolean;
  error: string | null;
  set: (ruas: ruas | null) => Promise<void>;
  setByNoRuas: (noRuas: number | null) => void;
  refresh(): Promise<void>;
};

const useSelectedRuasStore = create<SelectedRuasStore>((set, get) => ({
  selected: null,
  isLoading: false,
  error: null,
  set: async (ruas) => {
    if (!ruas) {
      set({ selected: null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/ruas/${ruas.id}`);
      const result = await response.json() as RuasWithSta;

      // Pre-swap coordinates to avoid doing it in the render loop
      if (result.sta) {
        result.sta = result.sta.map(s => ({
          ...s,
          coordinates: swapLngLat(s.coordinates as any) as any
        }));
      }

      set({ selected: result, isLoading: false });
    } catch (error) {
      console.error("Error setting selected ruas:", error);
      set({ error: "Gagal memuat data kondisi jalan", isLoading: false });
    }
  },
  setByNoRuas: async (noRuas) => {

    if (!noRuas) {
      get().set(null);
      return;
    }

    const response = await fetch(`/api/sta/ruas/${noRuas}`);
    const data = await response.json();
    
    get().set(data);
  },
  refresh: async () => {
    const ruas = get().selected;
    if (ruas) {
      await get().set(ruas);
    }
  }
}));

export default useSelectedRuasStore;