/* eslint-disable @next/next/no-img-element */
import useSelectedRuasStore from "@/app/stores/selected_ruas_store";
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import clsx from "clsx";
import { useState } from "react";
import RoadCondition from "./roadCondition";
import Sta from "./sta";

export default function RoadConditionSidebar() {
  const [isStaDetail, setIsStaDetail] = useState(false);
  const { selected: selectedRuas, set: setSelectedRuas } = useSelectedRuasStore();

    const { selected: selectedSta, set: setSelectedSta } = useSelectedStaStore();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-16 bottom-0 z-[2000] transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-xl border-r border-slate-200 overflow-y-auto custom-scrollbar",
        selectedRuas || selectedSta
          ? "md:w-2/3 lg:w-1/3 xl:w-1/4 w-full p-6 shadow-2xl"
          : "w-0 p-0 overflow-hidden"
      )}
    >
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        {selectedSta ? (
          <Sta />
        ) : (
          <RoadCondition
            selectedRuas={selectedRuas}
            setSelectedRuas={setSelectedRuas}
          />
        )}
      </div>
    </aside>
  );
}
