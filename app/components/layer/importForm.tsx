import useYearStore from "@/app/stores/year_store";
import { FeatureCollectionType } from "@/app/types";
import { getCurrentYear } from "@/app/utils/helpers";
import { Label, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IoClose } from "react-icons/io5";
import {
  ImportFormState,
  SaveRuasFormState,
  saveGeoJSON,
  saveRuasGeoJSON,
} from "../../actions/actions";

type ImportFormProps = {
  onLayerSuccess: () => void;
  onConditionSuccess: () => void;
  onClose: () => void;
};

const initialState: ImportFormState = {
  error: null,
  success: false,
};

const initialSaveRuasState: SaveRuasFormState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`bg-green-700 hover:bg-green-900 text-white px-4 py-3 mt-4 w-full font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-900/10 active:scale-95 ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "Memproses..." : "Simpan Data"}
    </button>
  );
}

export default function ImportForm({
  onLayerSuccess,
  onConditionSuccess,
  onClose,
}: ImportFormProps) {
  
  // ref 
  const inputYear = useRef(getCurrentYear())
  
  const [layerType, setLayerType] = useState<FeatureCollectionType>("road");
  const [isRoadCondition, setIsRoadCondition] = useState(false);
  const [isRoadDashed, setIsRoadDashed] = useState(false);
  const [isKewenangan, setIsKewenangan] = useState(false);
  
  const isRoad = () => layerType === "road";
  const isBridge = () => layerType === "bridge";
  const isArea = () => layerType === "area";
  
  const [state, formAction] = useFormState(saveGeoJSON, initialState);
  const [ruasState, ruasFormAction] = useFormState(
    saveRuasGeoJSON,
    initialSaveRuasState
  );

  const { setSelectedYear } = useYearStore();
  
  useEffect(() => {
    if (state.success) {
      onLayerSuccess();
      setSelectedYear(inputYear.current) 
    }
  }, [state.success, onLayerSuccess]);
  
  useEffect(() => {
    if (ruasState.success) {
      onConditionSuccess();
      setSelectedYear(inputYear.current)
    }
  }, [ruasState.success, onConditionSuccess]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-50/50 border-b border-slate-100 shrink-0">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Impor Data</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unggah File GeoJSON</p>
        </div>
        <button 
            onClick={() => onClose()}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <IoClose size={24} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Impor</label>
                <select
                onChange={(event) => {
                    setIsRoadCondition(event.target.value === "condition");
                }}
                value={isRoadCondition ? "condition" : "feature"}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all cursor-pointer"
                >
                    <option value="condition">Jalan dengan Kondisi (STA)</option>
                    <option value="feature">Feature (Jembatan, Area, dll)</option>
                </select>
            </div>

            {isRoadCondition ? (
                <form action={ruasFormAction} className="space-y-5">
                <div className="space-y-4">
                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Tahun Anggaran</label>
                    <TextInput 
                        name="tahun" 
                        defaultValue={inputYear.current.toString()} 
                        onChange={(e) => inputYear.current = parseInt(e.target.value)} 
                        className="rounded-xl"
                    />
                    {state.error?.tahun && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.tahun[0]}</p>
                    )}
                    </div>

                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">File GeoJSON (STA Structured)</label>
                    <input
                        type="file"
                        name="file"
                        accept=".geojson"
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all border border-slate-200 rounded-xl p-2 bg-slate-50"
                    />
                    {state.error?.file && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.file}</p>
                    )}
                    </div>

                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Nama Kelompok Jalan</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Misal: Jalan Kabupaten 2024"
                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all"
                    />
                    {state.error?.name && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.name}</p>
                    )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Ketebalan Visual</label>
                        <input type="range" name="weight" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" min={1} max={5} step={1} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Warna Garis</label>
                        <input type="color" name="color" className="block w-full h-10 border-0 p-0 rounded-xl cursor-pointer" />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="dashed"
                            name="dashed"
                            className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                            onChange={(e) => setIsRoadDashed(e.target.checked)}
                        />
                        <label htmlFor="dashed" className="text-xs font-bold text-slate-600 uppercase tracking-tight">Garis Putus-putus</label>
                    </div>

                    {isRoadDashed && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Spasi Antar Garis</label>
                                <input type="range" name="dash" className="w-full accent-green-600" min={1} max={10} step={1} />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Panjang Segmen Garis</label>
                                <input type="range" name="dashLength" className="w-full accent-green-600" min={1} max={10} step={1} />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="is_kewenangan"
                            name="is_kewenangan"
                            checked={isKewenangan}
                            className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                            onChange={(e) => setIsKewenangan(e.target.checked)}
                        />
                        <label htmlFor="is_kewenangan" className="text-xs font-bold text-slate-600 uppercase tracking-tight">Kewenangan Kabupaten</label>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Keterangan Tambahan</label>
                        <textarea
                            name="desc_kewenangan"
                            className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all min-h-[100px]"
                            placeholder="Opsional: Tambahkan informasi kewenangan atau catatan teknis..."
                        />
                    </div>
                </div>
                <SubmitButton />
                </form>
            ) : (
                <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Tahun Anggaran</label>
                        <TextInput name="tahun" defaultValue={inputYear.current.toString()} onChange={(e) => inputYear.current = parseInt(e.target.value)} />
                        {state.error?.tahun && <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.tahun}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">File GeoJSON</label>
                        <input type="file" name="file" accept=".geojson" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all border border-slate-200 rounded-xl p-2 bg-slate-50" />
                        {state.error?.file && <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.file}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Nama Layer</label>
                        <input type="text" name="name" placeholder="Misal: Jembatan Kabupaten 2023" className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 transition-all" />
                        {state.error?.name && <p className="text-red-500 text-[10px] font-bold mt-1">{state.error.name}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Tipe Data Spasial</label>
                        <select name="type" className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600 transition-all cursor-pointer" onChange={(e) => setLayerType(e.target.value as FeatureCollectionType)}>
                            <option value="road">Garis (Jalan)</option>
                            <option value="bridge">Titik (Jembatan)</option>
                            <option value="area">Poligon (Area)</option>
                        </select>
                    </div>

                    {(isRoad() || isArea()) && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Ketebalan Garis</label>
                            <input type="range" name="weight" className="w-full accent-green-600" min={1} max={5} step={1} />
                        </div>
                    )}

                    {isBridge() && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Ukuran Marker (Radius)</label>
                            <input type="range" name="radius" className="w-full accent-green-600" min={1} max={5} step={1} />
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Warna Visual</label>
                        <input type="color" name="color" className="block w-full h-10 border-0 p-0 rounded-xl cursor-pointer" />
                    </div>
                </div>
                <SubmitButton />
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
