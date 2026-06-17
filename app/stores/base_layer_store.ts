import { create } from "zustand";

export type BaseLayerType = "esri" | "openstreetmap" | "stadia";

type BaseLayerStore = {
  baseLayer: BaseLayerType | null;
  setBaseLayer: (layer: BaseLayerType | null) => void;
};

const useBaseLayerStore = create<BaseLayerStore>((set) => ({
  baseLayer: "openstreetmap",
  setBaseLayer: (layer) => set({ baseLayer: layer }),
}));

export default useBaseLayerStore;


