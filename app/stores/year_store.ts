import { create } from "zustand";
import { getCurrentYear } from "../utils/helpers";


type YearStore = {
    selectedYear: number;
    years: any[];
    setSelectedYear: (year: number) => void;
    getYears: () => void;
};

const useYearStore = create<YearStore>((set, get) => ({
    selectedYear: getCurrentYear(),
    years: [],
    setSelectedYear: (year: number) => set({ selectedYear: year }),
    getYears: async () => {
        const response = await fetch("/api/layerYears");
        const data = await response.json();

        set({ years: data });
    },
}));

export default useYearStore;