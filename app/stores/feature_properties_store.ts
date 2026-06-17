import { create } from 'zustand';
import { FeatureProperty } from '../types';

type FeaturePropertiesStore = {
  properties: Record<number, FeatureProperty[]>,
  isLoading: Record<number, boolean>,
  fetchedIds: Set<number>,
  fetchProperties: (featureId: number) => void,
  propertiesOf: (featureId: number) => FeatureProperty[],
  isLoadingPropertiesOf: (featureId: number) => boolean,
}

const useFeaturePropertiesStore = create<FeaturePropertiesStore>((set, get) => ({
  properties: {},
  isLoading: {},
  fetchedIds: new Set(),
  fetchProperties: async (featureId) => {
    set((state) => ({
      isLoading: {
        ...state.isLoading,
        [featureId]: true,
      }
    }));

    const response = await fetch(`/api/features/${featureId}/properties`);
    const data = await response.json();

    set((state) => ({
      properties: {
        ...state.properties,
        [featureId]: data,
      },
      isLoading: {
        ...state.isLoading,
        [featureId]: false,
      },
      fetchedIds: state.fetchedIds.add(featureId),
    }));
  },
  propertiesOf: (id) => get().properties[id] || [],
  isLoadingPropertiesOf: (id) => get().isLoading[id] || false,
}));

export default useFeaturePropertiesStore;
