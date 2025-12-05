import useBaseLayerStore from "@/app/stores/base_layer_store";
import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import useProjectStore from "@/app/stores/project_store";
import useYearStore from "@/app/stores/year_store";
import { getCurrentYear } from "@/app/utils/helpers";
import { Label, Select } from "flowbite-react";
import { UploadCloud } from "lucide-react";
import Loading from "../loading";
import AdminOnly from "../middleware/admin_only";
import LayerTile from "./layerTile";
import { RoadTile } from "./roadTile";

type LayerListProps = {
    onImporting: (value: boolean) => void;
    onLayerEdit: (value: any) => void;
    onRoadEdit: (value: any) => void;
  };
  

export default function LayerList(props: LayerListProps) {

    // const { layers, isLoading } = useLayersStore((state) => ({
    //     layers: state.layers,
    //     isLoading: state.isLoading,
    //   }));

    const {
        layers, isLoading
    } = useLayersStore();

    const { years, selectedYear, setSelectedYear } = useYearStore();

    const {
        roads, loading: roadLoading,
    } = useJalanStore();

    const {
        projects, isProjectVisible, toggleProjectVisibility, loading: projectLoading
    } = useProjectStore();
    
    const { baseLayer, setBaseLayer } = useBaseLayerStore();
    //   const { roads, roadLoading } = useJalanStore((state) => ({
    //     roads: state.roads,
    //     roadLoading: state.loading,
    //   }));

    return (
        <>
            <h1 className="text-xl font-bold p-4 flex justify-between items-center">
                Legenda
                <AdminOnly>
                <button onClick={() => props.onImporting(true)}>
                    <UploadCloud />
                </button>
                </AdminOnly>
            </h1>

            <hr />

            {isLoading || roadLoading || projectLoading ? (
                <Loading />
            ) : (
                <>
                <div className="max-w-md px-4">
                    <div className="mb-2 block">
                        <Label htmlFor="countries" value="Tahun" />
                    </div>
                    <Select id="countries" onChange={(e) => setSelectedYear(parseInt(e.target.value))} value={selectedYear}>
                        {
                            years.map((year) => {
                                return (
                                    <option selected={year.tahun == getCurrentYear()} key={year.tahun} value={year.tahun}>
                                        {year.tahun}
                                    </option>
                                );
                            })
                        }
                    </Select>
                </div>
                <ul className="p-4">
                    {roads.map((road) => {
                    return (
                        <RoadTile
                            key={road.id}
                            jalanInformation={road}
                            onEdit={(jalanInformation: JalanInformation) => {
                                props.onRoadEdit(jalanInformation);
                            }}
                        />
                    );
                    })}
                    {layers.map((information) => {
                    return (
                        <LayerTile
                            key={information.id}
                            layerInformation={information}
                            onEdit={(layerInformation: LayerInformation) => {
                                props.onLayerEdit(layerInformation);
                            }}
                        />
                    );
                    })}
                    {
                        projects.length > 0 ? (
                            <li className="flex flex-row items-center py-1">
                                <input
                                    type="checkbox"
                                    className="text-sm font-medium text-green-500 dark:text-gray-300 rounded-sm"
                                    checked={isProjectVisible}
                                    onChange={(e) => {
                                        toggleProjectVisibility();
                                    }}
                                />
                                <div className="w-8 flex items-center justify-center">
                                    <span
                                    className="w-4 h-1"
                                    style={{ backgroundColor: "yellow" }}
                                    ></span>
                                </div>
                                <span className="flex-grow text-sm">{ "Projek DBMBK"}</span>
                            </li>
                        ) : null
                    }
                </ul>
        </>
      )
    }

        <hr />

        <h2 className="text-lg font-bold p-4">Peta Dasar</h2>

        <div className="grid grid-cols-1 gap-2 px-4">
        <div
            className={`p-2 rounded-lg ${
            baseLayer === "esri"
                ? "bg-green-800 text-white"
                : "bg-slate-200 text-slate-800"
            } hover:bg-green-800 hover:text-white cursor-pointer`}
            onClick={() => setBaseLayer("esri")}
        >
            <img
            src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0"
            alt="esri"
            className="w-full h-20 object-cover rounded"
            />
            <p className={`text-center font-bold text-xs mt-2`}>Satelit</p>
        </div>
        <div
            className={`p-2 rounded-lg ${
            baseLayer === "openstreetmap"
                ? "bg-green-800 text-white"
                : "bg-slate-200 text-slate-800"
            } hover:bg-green-800 hover:text-white cursor-pointer`}
            onClick={() => setBaseLayer("openstreetmap")}
        >
            <img
            src="https://a.tile.openstreetmap.org/0/0/0.png"
            alt="openstreetmap"
            className="w-full h-20 object-cover rounded"
            />
            <p className={`text-center font-bold text-xs mt-2`}>Street View</p>
        </div>
        {/* <div
            className={`p-2 rounded-lg ${
            baseLayer === "stadia"
                ? "bg-green-800 text-white"
                : "bg-slate-200 text-slate-800"
            } hover:bg-green-800 hover:text-white cursor-pointer`}
            onClick={() => setBaseLayer("stadia")}
        >
            <img
            src="https://tiles.stadiamaps.com/tiles/alidade_smooth/0/0/0.png"
            alt="stadia"
            className="w-full h-20 object-cover rounded"
            />
            <p className={`text-center font-bold text-xs mt-2`}>Simple</p>
        </div> */}
        <div
            className={`p-2 rounded-lg ${
            baseLayer === null
                ? "bg-green-800 text-white"
                : "bg-slate-200 text-slate-800"
            } hover:bg-green-800 hover:text-white cursor-pointer`}
            onClick={() => setBaseLayer(null)}
        >
            <div className="bg-white rounded-lg ">
            <img
                src="https://tiles.stadiamaps.com/tiles/alidade_smooth/0/0/0.png"
                alt="stadia"
                className="w-full h-20 object-cover rounded-lg opacity-0"
            />
            </div>
            <p className={`text-center font-bold text-xs mt-2`}>
            Tanpa Peta Dasar
            </p>
        </div>
        </div>
        </>
    )
}