import { create } from "zustand";
import { JalanWithRuas, JalanWithRuasExtended, RuasWithSta } from "../types";

export type SimpleRuas = {
  idJalan: number,
  namaJalan: string,
  tahun: number,
  idRuas: number,
  nomorRuas: number,
  namaRuas: string,
  kecamatan: string,
  coordinates: Array<number>
}

export type JalanInformation = {
    id: number;
    // road: JalanWithRuas;
    road: JalanWithRuasExtended;
    color: string;
    visible: boolean;
  };

type JalanStore  = {
    data: JalanWithRuas[];
    roads: JalanInformation[];
    loading: boolean;
    deleteRoad: (roadId: number) => void;
    fetchData: (selectedYear: number) => Promise<void>;
    toggleJalanVisibility: (jalanId: number) => void;
    isJalanVisible: (jalanId: number) => boolean;
}

const useJalanStore = create<JalanStore>()((set, get) => ({
    data: [],
    roads: [],
    loading: false,
    deleteRoad: async (roadId: number) => {
      const response = await fetch(`/api/roads/${roadId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        set((state) => ({
          roads: state.roads.filter((l) => l.id !== roadId),
        }));
      }
    },
    fetchData: async (selectedYear: number) => {
        const response = await fetch(`/api/roads?year=${selectedYear}`);
        const data = await response.json();
        
        const result = data.flatMap((jalan: JalanWithRuas) =>
          {
            return {
              id: jalan.id,
              color: jalan.color,
              visible: true,
              road: jalan.ruas.map((ruas: RuasWithSta) => ({
                ...ruas,
                coordinates: ruas.sta.flatMap((sta: any) => sta.coordinates)
              }))
            } 
          }
        );

        
        set({ data: data, roads: result });
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