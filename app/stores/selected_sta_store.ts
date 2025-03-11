import { create } from "zustand";
import { StaWithPictures } from "../types";

type SelectedStaStore = {
  selected: StaWithPictures | null;
  isLoading: boolean;
  error: string | null;
  set: (ruas: StaWithPictures | null) => void;
};

const useSelectedStaStore = create<SelectedStaStore>((set) => ({
  selected: null,
  isLoading: false,
  error: null,
  set: (sta) => set({ selected: sta }),
}));

export default useSelectedStaStore;