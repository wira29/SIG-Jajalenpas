/* eslint-disable @next/next/no-img-element */
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AdminOnly from "../middleware/admin_only";
import StaDetail from "./staDetail";
import StaEditor from "./staEditor";
import StaHistory from "./staHistory";

export default function Sta() {
  const {selected: selectedSta, set: setSelectedSta} = useSelectedStaStore()

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedSta) {
      setIsEditing(false);
    }
  }, [selectedSta]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="font-bold text-md sm:text-xl">Detail STA</h1>

        <button
          className="text-xl font-bold"
          onClick={() => {
            setSelectedSta(null);
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
          <Transition
            appear
            show={true}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <TabPanel key="tab_data" className="py-4">
              <AdminOnly>
                <button
                  className={`mb-4 w-full py-2 pl-4 pr-2 rounded  flex justify-between items-center ${
                    isEditing ? "bg-red-500" : "bg-green-700"
                  } transition-all duration-300`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <p className="text-white text-md sm:text-lg font-bold">
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
              </AdminOnly>
              {isEditing ? (
                <StaEditor onDoneEditing={() => setIsEditing(false)} />
              ) : (
                <StaDetail sta={selectedSta!} />
              )}
            </TabPanel>
          </Transition>
          {/* <AuthenticatedOnly> */}
            <Transition
              appear
              show={true}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <TabPanel key="tab_riwayat" className="py-4">
                <StaHistory />
              </TabPanel>
            </Transition>
          {/* </AuthenticatedOnly> */}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
