import { JalanInformation } from "@/app/stores/jalan_store";
import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import { useState } from "react";
import EditForm from "./editForm";
import LayerList from "./layerList";


export default function LayerSidebar() {

    const [isImporting, setIsImporting] = useState(false);
    const [isLayerEditing, setIsLayerEditing] = useState<LayerInformation | null>(null);
    const [isRoadEditing, setIsRoadEditing] = useState<JalanInformation | null>(null);

    const {
        isVisible,
        toggleVisibility,
    } = useLayersStore();

    return (
        <aside className={`
            ${isVisible ? "md:w-1/3 xl:w-1/4 2xl:w-1/5 w-full shrink-0" :"w-0 p-0"}
            transition-all duration-300 ease-in-out
            h-full border-l bg-white`}>
            <button
                className="md:hidden text-red-500
                w-full text-lg p-4 flex justify-center items-center"
                onClick={() => {
                    toggleVisibility();
                }}
            >
                Tutup
            </button>

            {
                isLayerEditing ? (
                    <EditForm
                        layerInformation={isLayerEditing}
                        onSuccess={() => {
                            setIsLayerEditing(null);
                        }}
                        onClose={() => {
                            setIsLayerEditing(null);
                        }}
                    />
                ) : (
                    <LayerList
                        onRoadEdit={setIsRoadEditing}
                        onLayerEdit={setIsLayerEditing}
                        onImporting={setIsImporting}
                    />
                )
            }
        </aside>   
    )
}