import { create } from "zustand";
import { JalanWithRuas } from "../types";

export type JalanInformation = {
    id: number;
    road: JalanWithRuas;
    visible: boolean;
  };

interface JalanStore {
    data: JalanWithRuas[];
    roads: JalanInformation[];
    fetchData: () => Promise<void>;
}

const useJalanStore = create<JalanStore>()((set) => ({
    data: [],
    roads: [],
    fetchData: async () => {
        const response = await fetch("/api/jalan");
        const data = await response.json();

        console.log("rerender");

        set({ data: data, roads: data.map((jalan: JalanWithRuas) => ({ id: jalan.id, road: jalan, visible: true })) });
    },
}));

export default useJalanStore;