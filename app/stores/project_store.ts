import { executor_projects } from "@prisma/client";
import { create } from "zustand";


type ProjectStore = {
    projects: executor_projects[];
    loading: boolean;
    loadProject: (tahun: number) => void;
    isProjectVisible: boolean;
    toggleProjectVisibility: () => void;
}

const useProjectStore = create<ProjectStore>()((set, get) => ({
    projects: [],
    loading: false,
    loadProject: async (tahun: number) => {
        console.log(tahun)
        const response = await fetch(`/api/projects?year=${tahun}`);
        const data = await response.json();

        set({
            projects: data
        })
    },
    isProjectVisible: true,
    toggleProjectVisibility: () => {
        set((state) => ({
            isProjectVisible: !state.isProjectVisible
        }))
    }
}))

export default useProjectStore;