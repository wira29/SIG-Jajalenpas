import { create } from "zustand";
import { FeatureWithProperties } from "../types";

type SelectedFeatureStore = {
  selectedFeature: FeatureWithProperties | null;
  setSelectedFeature: (feature: FeatureWithProperties | null) => void;
};

const useSelectedFeatureStore = create<SelectedFeatureStore>((set) => ({
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}));

export default useSelectedFeatureStore;