import { executor_projects } from "@prisma/client";
import { create } from "zustand";


type ProjectStore = {
    projects: executor_projects[];
    loading: boolean;
    loadProject: (tahun: number) => void;
    isProjectVisible: boolean;
    toggleProjectVisibility: () => void;
}

let currentController: AbortController | null = null;

const useProjectStore = create<ProjectStore>()((set, get) => ({
    projects: [],
    loading: false,
    loadProject: async (tahun: number) => {
        if (currentController) {
            currentController.abort();
        }
        currentController = new AbortController();

        set({ loading: true });
        try {
            const response = await fetch(`/api/projects?year=${tahun}`, {
                signal: currentController.signal
            });
            const data = await response.json();

            set({
                projects: data,
                loading: false
            })
        } catch (error: any) {
            if (error.name === 'AbortError') {
                return;
            }
            console.error("Failed to load projects:", error);
            set({ loading: false });
        }
    },
    isProjectVisible: true,
    toggleProjectVisibility: () => {
        set((state) => ({
            isProjectVisible: !state.isProjectVisible
        }))
    }
}))

export default useProjectStore;