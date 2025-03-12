/* eslint-disable @next/next/no-img-element */
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ConditionDetail from "./condition_detail";
// import AdminOnly from "../AdminOnly";
// import AuthenticatedOnly from "../AuthenticatedOnly";
// import ConditionDetail from "./ConditionDetail";
// import ConditionEditor from "./ConditionEditior";
// import ConditionHistory from "./ConditionHistory";

export default function RoadCondition({
  selectedRuas,
  setSelectedRuas,
}: {
  selectedRuas: any;
  setSelectedRuas: (value: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-md sm:text-lg md:text-xl font-bold">
          {selectedRuas && selectedRuas.namaRuas}
        </h1>

        <button
          className="text-xl font-bold"
          onClick={() => {
            setSelectedRuas(null);
          }}
        >
          <IoClose />
        </button>
      </div>
      <TabGroup>
        <TabList className="flex space-x-1  p-1">
          <Tab
            key="tab_data"
            className={({ selected }) =>
              clsx(
                "w-full py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                selected
                  ? "bg-white text-gray-700 border-b-4 border-green-500"
                  : "text-gray-500 hover:bg-white/[0.12] hover:text-green-500"
              )
            }
          >
            Data
          </Tab>
          {/* <AuthenticatedOnly> */}
            <Tab
              key="tab_riwayat"
              className={({ selected }) =>
                clsx(
                  "w-full py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                  selected
                    ? "bg-white text-gray-700 border-b-4 border-green-500"
                    : "text-gray-500 hover:bg-white/[0.12] hover:text-green-500"
                )
              }
            >
              Riwayat
            </Tab>
          {/* </AuthenticatedOnly> */}
        </TabList>
        <TabPanels>
          <TabPanel key="tab_data" className="py-4">
            <Transition
            as={"div"}
              appear
              show={true}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* <AdminOnly> */}
                <button
                  className={`mb-4 w-full py-2 pl-4 pr-2 rounded  flex justify-between items-center ${
                    isEditing ? "bg-red-500" : "bg-green-700"
                  } transition-all duration-300`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <p className="text-white text-md sm:text-lg md:text-lg font-bold">
                    {isEditing ? "Batal" : "Edit"}
                  </p>
                  <div className="p-2 bg-white rounded">
                    {isEditing ? (
                      <IoClose className="text-red-500" />
                    ) : (
                      <FaPencilAlt className="text-green-700" />
                    )}
                  </div>
                </button>
              {/* </AdminOnly> */}
              {isEditing ? (
                // <ConditionEditor onDoneEditing={() => setIsEditing(false)} />
                null
              ) : (
                <ConditionDetail ruas={selectedRuas} />
              )}
            </Transition>
          </TabPanel>
          {/* <AuthenticatedOnly> */}
            <TabPanel key="tab_riwayat" className="py-4">
              <Transition
              as={"div"}
                appear
                show={true}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <h1>Riwayat History</h1>
                {/* <ConditionHistory /> */}
              </Transition>
            </TabPanel>
          {/* </AuthenticatedOnly> */}
        </TabPanels>
      </TabGroup>
    </>
  );
}
