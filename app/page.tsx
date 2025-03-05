"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { Puff } from "react-loader-spinner";
import LayerSidebar from "./components/layer/layerSidebar";
import { NavbarWidget } from './components/navbar';
import useJalanStore from "./stores/jalan_store";
import useLayersStore from "./stores/layers_store";
import useYearStore from "./stores/year_store";

export default function Home() {

  const DynamicMap = useMemo(() => dynamic(() => import("./components/map"), {
    loading: () => (
      <Puff
        visible={true}
        height="40"
        width="40"
        color="#4fa94d"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    ),
    ssr: false,
  }), []);

  // const { data: session } = useSession();

  // const { fetchData: fetchDataJalan } = useJalanStore();
  // const { loadLayers: fetchDataLayers } = useLayersStore();
  const loadLayers = useLayersStore((state) => state.loadLayers);
  const loadRoads = useJalanStore((state) => state.fetchData);
  const getYears = useYearStore((state) => state.getYears);
  const { selectedYear } = useYearStore();
  
  useEffect(() => { 
    getYears();
  }, [getYears]);

  useEffect(() => { 
    loadLayers(selectedYear);
  }, [loadLayers, selectedYear]);

  useEffect(() => {
    loadRoads(selectedYear);
  }
  , [loadRoads, selectedYear]);
  // console.log("rerender")

  {console.log("rerender")}
  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />
      <main
      className="flex flex-row flex-grow w-full items-stretch sm:items-stretch overflow-x-hidden"
      // minus the height of the navbar
      style={{ height: "calc(100vh - 4rem)" }}>
        <div className="flex-grow bg-slate-100 w-full relative flex justify-center items-center">
          <DynamicMap />
        </div>
        
        <LayerSidebar />
      </main>
    </div>
  );
}
