import { create } from "zustand";
import { JalanWithRuas } from "../types";

export type JalanInformation = {
    id: number;
    road: JalanWithRuas;
    visible: boolean;
  };

type JalanStore  = {
    data: JalanWithRuas[];
    roads: JalanInformation[];
    loading: boolean;
    fetchData: (selectedYear: number) => Promise<void>;
    toggleJalanVisibility: (jalanId: number) => void;
    isJalanVisible: (jalanId: number) => boolean;
}

const useJalanStore = create<JalanStore>()((set, get) => ({
    data: [],
    roads: [],
    loading: false,
    fetchData: async (selectedYear: number) => {
        const response = await fetch(`/api/roads?year=${selectedYear}`);
        const data = await response.json();

        console.log(data)

        
        set({ data: data, roads: data.map((jalan: JalanWithRuas) => ({ id: jalan.id, road: jalan, visible: true })) });
    },
    toggleJalanVisibility: (layerId) =>
        set((state) => ({
          roads: state.roads.map((l) => {
            if (l.id === layerId) {
              const visibility = !l.visible;
              // localStorage.setItem(`jalan-${l.id}`, JSON.stringify(visibility));
              return { ...l, visible: visibility };
            }
            return l;
          }),
        })),
      isJalanVisible: (layerId) => {
        // const visibility = localStorage.getItem(`jalan-${layerId}`);
    
        // return visibility ? JSON.parse(visibility) : true;
        let isVisible = false;
        get().roads.forEach((l) => {
          if (l.id === layerId) {
            isVisible =  l.visible;
          }
        });
        return isVisible;
    },
}));

export default useJalanStore;