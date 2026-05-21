import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import useYearStore from "@/app/stores/year_store";
import { useState } from "react";
import EditForm from "./editForm";
import ImportForm from "./importForm";
import LayerList from "./layerList";
import RoadEditForm from "./roadEditForm";


export default function LayerSidebar() {

    const [isImporting, setIsImporting] = useState(false);
    const [isLayerEditing, setIsLayerEditing] = useState<LayerInformation | null>(null);
    const [isRoadEditing, setIsRoadEditing] = useState<JalanInformation | null>(null);

    const { selectedYear, setSelectedYear } = useYearStore();
    const {
        isVisible,
        toggleVisibility,
        loadLayers
    } = useLayersStore();

    const {fetchData: loadCondition} = useJalanStore()

    return (
        <aside className={`
            fixed right-0 top-16 bottom-0 z-[2000]
            ${isVisible ? "md:w-1/3 xl:w-1/4 2xl:w-1/5 w-full p-6 shadow-2xl" : "w-0 p-0 overflow-hidden"}
            transition-all duration-500 ease-in-out
            bg-white/90 backdrop-blur-xl border-l border-slate-200 overflow-y-auto custom-scrollbar`}>
            
            <div className="flex flex-col h-full">
                <button
                    className="md:hidden self-end text-slate-400 hover:text-red-500 p-2 mb-2 transition-colors"
                    onClick={() => toggleVisibility()}
                >
                    Tutup
                </button>

                {isImporting ? (
                    <ImportForm
                        onLayerSuccess={() => {
                            setIsImporting(false);
                            loadLayers(selectedYear);
                        }}
                        onConditionSuccess={() => {
                            setIsImporting(false);
                            loadCondition(selectedYear);
                        }}
                        onClose={() => {
                            setIsImporting(false)
                        }}
                    />
                ) : isLayerEditing ? (
                    <EditForm
                        layerInformation={isLayerEditing}
                        onSuccess={() => {
                            setIsLayerEditing(null);
                            loadLayers(selectedYear);
                        }}
                        onClose={() => {
                            setIsLayerEditing(null);
                        }}
                    />
                ) : isRoadEditing ? (
                    <RoadEditForm
                        roadInformation={isRoadEditing}
                        onClose={() => {
                            setIsRoadEditing(null);
                        }}
                        onSuccess={() => {
                            setIsRoadEditing(null);
                            loadCondition(selectedYear);
                        }}
                    />
                ) : (
                    <LayerList
                        onRoadEdit={setIsRoadEditing}
                        onLayerEdit={setIsLayerEditing}
                        onImporting={setIsImporting}
                    />
                )}
            </div>
        </aside>   
    )
}
