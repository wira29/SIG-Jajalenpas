"use client";

import { Toaster } from "@/components/ui/toaster";
import nextDynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { Puff } from "react-loader-spinner";
import FeatureSidebar from "./components/feature/featureSidebar";
import LayerSidebar from "./components/layer/layerSidebar";
import NavbarWidget from "./components/navbar";
import MapErrorBoundary from "./components/mapErrorBoundary";
import RoadConditionSidebar from "./components/roadCondition/roadConditionSidebar";
import SearchRuas from "./components/searchRuas";
import HomeOverlay from "./components/homeOverlay";
import useJalanStore from "./stores/jalan_store";
import useLayersStore from "./stores/layers_store";
import useProjectStore from "./stores/project_store";
import useYearStore from "./stores/year_store";

const DynamicMap = nextDynamic(() => import("./components/map"), {
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <Puff
        visible={true}
        height="40"
        width="40"
        color="#4fa94d"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  ),
  ssr: false,
});

export default function Home() {

  // const { data: session } = useSession();

  // const { fetchData: fetchDataJalan } = useJalanStore();
  // const { loadLayers: fetchDataLayers } = useLayersStore();
  const loadLayers = useLayersStore((state) => state.loadLayers);
  const loadRoads = useJalanStore((state) => state.fetchData);
  const getYears = useYearStore((state) => state.getYears);
  const { selectedYear } = useYearStore();
  const { layers } = useLayersStore();
  const { loadProject } = useProjectStore();
  const { years } = useYearStore()
  
  useEffect(() => { 
    getYears();
  }, [getYears, layers]);

  useEffect(() => {
    if (selectedYear) {
      loadLayers(selectedYear);
      loadProject(selectedYear);
      loadRoads(selectedYear);
    }
  }, [selectedYear, loadLayers, loadProject, loadRoads]);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />
      <main
      className="flex flex-row flex-grow w-full items-stretch sm:items-stretch overflow-x-hidden overflow-y-hidden"
      // minus the height of the navbar
      style={{ height: "calc(100vh - 4rem)" }}>

        <FeatureSidebar />
        <RoadConditionSidebar />
        <SearchRuas />

        <div className="flex-grow bg-slate-100 w-full relative flex justify-center items-center">
          <MapErrorBoundary>
            <DynamicMap />
          </MapErrorBoundary>
        </div>
        
        <LayerSidebar />
        <Toaster />
      </main>
    </div>
  );
}
