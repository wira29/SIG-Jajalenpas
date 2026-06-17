import { create } from "zustand";


type CurrentPositionStore = {
  position: GeolocationPosition | null,
  updatePosition: () => Promise<void>,
}

const useCurrentPositionStore = create<CurrentPositionStore>((set, get) => ({
  position: null,
  updatePosition: async () => {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    set(() => ({
      position,
    }));
  },
}));

export default useCurrentPositionStore;

