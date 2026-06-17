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
    const { layers, isLoading } = useLayersStore();
    const { years, selectedYear, setSelectedYear } = useYearStore();
    const { roads, loading: roadLoading } = useJalanStore();
    const { projects, isProjectVisible, toggleProjectVisibility, loading: projectLoading } = useProjectStore();
    const { baseLayer, setBaseLayer } = useBaseLayerStore();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Legenda Peta</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Filter & Layer Data</p>
                </div>
                <AdminOnly>
                    <button 
                        onClick={() => props.onImporting(true)}
                        className="p-2 bg-white text-green-700 rounded-xl shadow-sm border border-slate-200 hover:bg-green-50 transition-colors pointer-events-auto"
                        title="Impor Data Baru"
                    >
                        <UploadCloud size={20} />
                    </button>
                </AdminOnly>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {isLoading || roadLoading || projectLoading ? (
                    <div className="p-12">
                        <Loading />
                    </div>
                ) : (
                    <div className="p-4 space-y-6">
                        {/* Year Selection Section */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun Anggaran</label>
                            <div className="relative group">
                                <Select 
                                    className="rounded-xl border-slate-200 focus:ring-green-500/20"
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
                                    value={selectedYear}
                                >
                                    {years.map((year) => (
                                        <option key={year.tahun} value={year.tahun}>
                                            Tahun {year.tahun}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Layers Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daftar Layer Aktif</label>
                            <ul className="space-y-1">
                                {roads.map((road) => (
                                    <RoadTile
                                        key={road.id}
                                        jalanInformation={road}
                                        onEdit={(jalanInformation: JalanInformation) => props.onRoadEdit(jalanInformation)}
                                    />
                                ))}
                                {layers.map((information) => (
                                    <LayerTile
                                        key={information.id}
                                        layerInformation={information}
                                        onEdit={(layerInformation: LayerInformation) => props.onLayerEdit(layerInformation)}
                                    />
                                ))}
                                {projects.length > 0 && (
                                    <li className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 cursor-pointer"
                                                checked={isProjectVisible}
                                                onChange={() => toggleProjectVisibility()}
                                            />
                                        </div>
                                        <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center shrink-0 border border-yellow-200">
                                            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                                        </div>
                                        <span className="flex-grow text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Proyek DBMBK</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Base Layers Grid */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peta Dasar</label>
                            <div className="grid grid-cols-2 gap-2">
                                <BaseLayerItem 
                                    active={baseLayer === "esri"} 
                                    label="Satelit" 
                                    img="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0"
                                    onClick={() => setBaseLayer("esri")} 
                                />
                                <BaseLayerItem 
                                    active={baseLayer === "openstreetmap"} 
                                    label="Street" 
                                    img="https://a.tile.openstreetmap.org/0/0/0.png"
                                    onClick={() => setBaseLayer("openstreetmap")} 
                                />
                                <div
                                    className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden aspect-square flex flex-col items-center justify-center ${
                                        baseLayer === null ? "border-green-600 bg-green-50" : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                    onClick={() => setBaseLayer(null)}
                                >
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 mb-1"></div>
                                    <span className={`text-[10px] font-black uppercase ${baseLayer === null ? "text-green-700" : "text-slate-400"}`}>Polos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function BaseLayerItem({ active, label, img, onClick }: { active: boolean, label: string, img: string, onClick: () => void }) {
    return (
        <div
            className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden aspect-square group ${
                active ? "border-green-600 scale-[0.98]" : "border-slate-100 hover:border-slate-200"
            }`}
            onClick={onClick}
        >
            <img src={img} alt={label} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
            <div className={`absolute inset-0 bg-gradient-to-t ${active ? "from-green-900/80" : "from-black/60"} flex items-end justify-center p-2`}>
                <span className="text-[10px] font-black text-white uppercase tracking-wider">{label}</span>
            </div>
            {active && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center shadow-lg border border-white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            )}
        </div>
    );
}