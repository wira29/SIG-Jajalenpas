import { updateFeatureProperty } from "@/app/actions/actions";
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose, IoInformationCircleOutline, IoTimeOutline } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import useLayersStore from "../../stores/layers_store";
import useSelectedFeatureStore from "../../stores/selected_feature_store";
import AdminOnly from "../middleware/admin_only";
import FeaturePropertyDetail from "./featurePropertyDetail";
import FeaturePropertiesHistory from "./featurePropertyHistory";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function FeatureSidebar() {
  const { data, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const { selectedFeature, setSelectedFeature } = useSelectedFeatureStore();

  const loadLayer = useLayersStore((state) => state.loadLayer);

  const property = (selectedFeature?.properties[0]?.data ?? {}) as Record<
    string,
    any
  >;

  const titleCandidates = Object.values(property);
  const title = property?.Nama_Ruas ?? titleCandidates[0] ?? "Detail Fitur";

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-[2000]
        ${selectedFeature ? "md:w-1/3 lg:w-1/4 xl:w-1/5 w-full p-6 shadow-2xl" : "w-0 p-0 overflow-hidden"}
        transition-all duration-500 ease-in-out
        bg-white/90 backdrop-blur-xl border-r border-slate-200 overflow-y-auto custom-scrollbar`}
    >
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 block">Informasi Aset</span>
            <h1 className="text-xl font-black text-slate-900 leading-tight truncate uppercase">{title}</h1>
        </div>

        <button
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          onClick={() => {
            setSelectedFeature(null);
          }}
        >
          <IoClose size={24} />
        </button>
      </div>

      <TabGroup>
        <TabList className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <Tab
            key="tab_data"
            className={({ selected } : any) =>
              classNames(
                "w-full py-2.5 text-xs font-bold leading-5 rounded-xl transition-all flex items-center justify-center gap-2",
                selected
                  ? "bg-white text-green-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )
            }
          >
            <IoInformationCircleOutline size={18} />
            Data
          </Tab>

          <Tab
            key="tab_riwayat"
            className={({ selected } : any) =>
              classNames(
                "w-full py-2.5 text-xs font-bold leading-5 rounded-xl transition-all flex items-center justify-center gap-2",
                selected
                  ? "bg-white text-green-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )
            }
          >
            <IoTimeOutline size={18} />
            Riwayat
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel key="tab_data">
            <Transition
              as={"div"}
              appear
              show={true}
              enter="transition-all duration-500"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <AdminOnly>
                <button
                  className={`mb-6 w-full py-3 px-4 rounded-xl flex justify-between items-center ${
                    isEditing ? "bg-red-600 shadow-red-100" : "bg-green-700 shadow-green-100"
                  } transition-all duration-300 shadow-lg text-white group`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {isEditing ? "Batalkan Edit" : "Sunting Data"}
                  </span>
                  <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    {isLoading ? (
                      <Oval
                        visible={true}
                        height="18"
                        width="18"
                        color="#ffffff"
                        ariaLabel="oval-loading"
                        strokeWidth={4}
                      />
                    ) : isEditing ? (
                      <IoClose size={18} />
                    ) : (
                      <FaPencilAlt size={16} />
                    )}
                  </div>
                </button>
              </AdminOnly>

              <FeaturePropertyDetail
                key={selectedFeature?.id}
                property={selectedFeature?.properties[0]}
                isEditing={isEditing}
                onSave={async (
                  data,
                  newPhotos,
                  updatedPhotos,
                  deletedPhotos
                ) => {
                  setIsEditing(false);

                  setIsLoading(true);
                  const property = await updateFeatureProperty(
                    Number(selectedFeature?.id!),
                    data,
                    selectedFeature?.properties[0]?.photo ?? [],
                    updatedPhotos,
                    deletedPhotos
                  );

                  for (const photo of newPhotos) {
                    const formData = new FormData();
                    formData.append("file", photo.file);
                    formData.append("description", photo.description);

                    const response = await fetch(
                      `/api/properties/${property.id}/photos`,
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    if (!response.ok) {
                      return null;
                    }
                  }

                  const newLayer = await loadLayer(
                    Number(selectedFeature?.featureCollectionId!)
                  );

                  setSelectedFeature(
                    newLayer.feature.find((f: any) => f.id === selectedFeature?.id)!
                  );
                  setIsLoading(false);
                }}
              />
            </Transition>
          </TabPanel>

          <TabPanel key="tab_riwayat">
            <Transition
              as={"div"}
              appear
              show={true}
              enter="transition-all duration-500"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {selectedFeature && (
                <FeaturePropertiesHistory feature={selectedFeature!} />
              )}
            </Transition>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </aside>
  );
}
