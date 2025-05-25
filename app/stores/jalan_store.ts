import { create } from "zustand";
import { JalanWithRuas, JalanWithRuasExtended } from "../types";

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
    tahun: number;
    name: string;
    road: JalanWithRuasExtended;
    color: string;
    visible: boolean;
    is_kewenangan: boolean;
    desc_kewenangan: string;
    weight: number;
    dash: number;
    dashLength: number;
  };

type JalanStore  = {
    data: JalanWithRuas[];
    road: JalanWithRuas | null;
    roads: JalanInformation[];
    loading: boolean;
    error: string | null; 
    deleteRoad: (roadId: number) => void;
    updateRoad: (roadId: number, road: Record<string, any>) => void;
    fetchData: (selectedYear: number) => Promise<void>;
    loadRoad: (id: number) => void;
    toggleJalanVisibility: (jalanId: number) => void;
    isJalanVisible: (jalanId: number) => boolean;
}

const useJalanStore = create<JalanStore>()((set, get) => ({
    data: [],
    road: null,
    roads: [],
    loading: false,
    error: null,
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
    updateRoad: async (roadId, road) => {
      const response = await fetch(`/api/roads/${roadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(road),
      });
  
      if (response.ok) {
        await get().loadRoad(roadId);
      }
    },
    fetchData: async (selectedYear: number) => {
        const response = await fetch(`/api/roads?year=${selectedYear}`);
        const data = await response.json();

        // set({ data: data, roads: data.map((jalan: JalanWithRuas) => ({ id: jalan.id, weight: jalan.weight, dash: jalan.dash, dashLength: jalan.dashLength, road: jalan, visible: true, name: jalan.nama, color: jalan.color, is_kewenagan: jalan.is_kewenangan, desc_kewenangan: jalan.desc_kewenangan })) });
        
        
        const result = data.flatMap((jalan: JalanWithRuas) =>
          {
            return {
              id: jalan.id,
              tahun: jalan.tahun,
              color: jalan.color,
              name: jalan.nama,
              visible: true,
              is_kewenangan: jalan.is_kewenangan, 
              desc_kewenangan: jalan.desc_kewenangan,
              weight: jalan.weight, 
              dash: jalan.dash, 
              dashLength: jalan.dashLength,
              road: jalan.ruas.map((ruas: any) => ({
                ...ruas,
                coordinates: ruas.sta.flatMap((sta: any) => sta.coordinates)
              }))
            } 
          }
        );

        
        set({ data: data, roads: result });
    },
    loadRoad: async (id: number) => {
      set({ loading: true });
      try {
        const response = await fetch(`/api/roads/${id}`);
        const road = await response.json();
        set((state) => {
          const newRoads = state.roads.map((l) => {
            if (l.id === id) {
              return { ...l, road };
            }
            return l;
          });
  
          return {
            roads: newRoads,
            road,
            loading: false,
          };
        });
      } catch (error) {
        set({ error: "Gagal memuat data kondisi jalan", loading: false });
      }
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