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
        selectedRuas || selectedSta
          ? "lg:w-4/6 xl:w-1/3 w-full p-4 shrink-0"
          : "w-0 p-0",
        "transition-all duration-500 ease-in-out overflow-y-auto border-r h-full  bg-white"
      )}
    >
      <div>
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
