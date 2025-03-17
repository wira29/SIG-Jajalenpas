import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
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

            {isLoading || roadLoading ? (
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
                </ul>
        </>
      )
    }
        </>
    )
}