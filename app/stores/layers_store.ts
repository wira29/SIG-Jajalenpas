import { create } from "zustand";
import { FeatureCollectionFull } from "../types";

export type LayerInformation = {
  id: number;
  layer: FeatureCollectionFull;
  visible: boolean;
};

type LayersStore = {
  layers: LayerInformation[];
  isLoading: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadLayers: (selectedYear: number) => void;
  addLayer: (layer: FeatureCollectionFull) => void;
  deleteLayer: (layerId: number) => void;
  updateLayer: (layerId: number, layer: Record<string, any>) => void;
  loadLayer: (layerId: number) => Promise<FeatureCollectionFull>;
  toggleLayerVisibility: (layerId: number) => void;
  isLayerVisible: (layerId: number) => boolean;
};

const useLayersStore = create<LayersStore>((set, get) => ({
  layers: [],
  isLoading: false,
  isVisible: false,
  years: [],
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadLayers: async (selectedYear: number) => {
    set({ isLoading: true });

    const response = await fetch(`/api/layers?year=${selectedYear}`, { next: { revalidate: 10 }});
    const data = await response.json();

    // sort data bridge, road, area
    const score: { [key: string]: number } = {
      bridge: 0,
      road: 1,
      area: 2,
    };

    data.sort((a: FeatureCollectionFull, b: FeatureCollectionFull) => {
      return score[a.type] - score[b.type];
    });

    set({
      layers: data.map((layer: FeatureCollectionFull) => ({
        id: layer.id,
        layer,
        visible: true,
      })),
      isLoading: false,
    });
  },
  addLayer: (layer) => {
    set((state) => ({
      layers: [...state.layers, { id: layer.id, layer, visible: true }],
    }));
  },
  deleteLayer: async (layerId: number) => {
    const response = await fetch(`/api/layers/${layerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      set((state) => ({
        layers: state.layers.filter((l) => l.id !== layerId),
      }));
    }
  },
  updateLayer: async (layerId, layer) => {
    try {
      const response = await fetch(`/api/layers/${layerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layer),
      });
  
      if (response.ok) {
        await get().loadLayer(layerId);
      }
    } catch (error) {
      console.log(error);
    }
  },
  loadLayer: async (layerId) => {
    const response = await fetch(`/api/layers/${layerId}`);
    const layer = await response.json();

    set((state) => {
      const newLayers = state.layers.map((l) => {
        if (l.id === layerId) {
          return { ...l, layer };
        }
        return l;
      });

      return {
        layers: newLayers,
      };
    });

    return layer as FeatureCollectionFull;
  },
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id === layerId) {
          const visibility = !l.visible;

          // localStorage.setItem(`layer-${l.id}`, JSON.stringify(visibility));
          return { ...l, visible: !l.visible };
        }
        return l;
      }),
    })),
  isLayerVisible: (layerId) => {
    // const visibility = localStorage.getItem(`layer-${layerId}`);

    // return visibility ? JSON.parse(visibility) : true;
    let isVisible = false;
    get().layers.forEach((l) => {
      if (l.id === layerId) {
        isVisible =  l.visible;
      }
    });
    return isVisible;
    // return false;
  },
}));

export default useLayersStore;
