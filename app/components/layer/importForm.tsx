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
      className={`bg-green-700 hover:bg-green-900 text-white px-4 py-2 mt-2 rounded transition-all duration-300 ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "Loading..." : "Submit"}
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
  
  const isRoad = () => layerType === "road";
  const isBridge = () => layerType === "bridge";
  const isArea = () => layerType === "area";
  
  const [state, formAction] = useFormState(saveGeoJSON, initialState);
  const [ruasState, ruasFormAction] = useFormState(
    saveRuasGeoJSON,
    initialSaveRuasState
  );
  
  useEffect(() => {
    if (state.success) {
      onLayerSuccess();
    }
  }, [state.success, onLayerSuccess]);
  
  useEffect(() => {
    if (ruasState.success) {
      onConditionSuccess();
    }
  }, [ruasState.success, onConditionSuccess]);
  
  return (
    <div className="max-w-lg mx-auto overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold ">Impor</h1>
          <small className="inline-block">Impor layer dari file GeoJSON.</small>
        </div>
        <button onClick={() => onClose()}>
          <IoClose />
        </button>
      </div>

      <hr />

      <div className="p-4">
        <select
          onChange={(event) => {
            setIsRoadCondition(event.target.value === "condition");
          }}
          value={isRoadCondition ? "condition" : "feature"}
          className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
        >
          <option value="condition">Jalan dengan Kondisi</option>
          <option value="feature">Feature (Jalan, Jembatan, Area)</option>
        </select>
      </div>

      {isRoadCondition ? (
        <form
          action={ruasFormAction}
          className="max-w-sm mx-auto bg-white rounded shadow-md p-4"
        >
          <div className="mb-4">
            <Label className="mb-3">Tahun</Label>
            <TextInput name="tahun" value={inputYear.current.toString()} onChange={(e) =>  inputYear.current = parseInt(e.target.value)} />
          </div>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              File GeoJSON (Structured)
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept=".geojson"
              className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            />

            {state.error?.file && (
              <p className="text-red-500 text-sm">{state.error.file}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              Nama
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Contoh: Jalan Nasional"
              className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            />

            {state.error?.name && (
              <p className="text-red-500 text-sm">{state.error.name}</p>
            )}
          </div>

          <SubmitButton />
        </form>
      ) : (
        <form
          action={formAction}
          // onSubmit={onSuccess}
          className="max-w-sm mx-auto bg-white rounded shadow-md p-4"
        >
          <div className="mb-4">
            <Label className="mb-3">Tahun</Label>
            <TextInput name="tahun" value={inputYear.current.toString()} onChange={(e) =>  inputYear.current = parseInt(e.target.value)} />
          </div>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              File GeoJSON
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept=".geojson"
              className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            />

            {state.error?.file && (
              <p className="text-red-500 text-sm">{state.error.file}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              Nama
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Contoh: Jalan Nasional"
              className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            />

            {state.error?.name && (
              <p className="text-red-500 text-sm">{state.error.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="type"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              Jenis
            </label>
            <select
              name="type"
              id="type"
              className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
              onChange={(event) => {
                setLayerType(event.target.value as FeatureCollectionType);
              }}
            >
              <option value="road">Jalan</option>
              <option value="bridge">Jembatan</option>
              <option value="area">Area</option>
            </select>

            {state.error?.type && (
              <p className="text-red-500 text-sm">{state.error.type}</p>
            )}
          </div>

          {(isRoad() || isArea()) && (
            <div className="mb-4">
              <label
                htmlFor="weight"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Ketebalan Garis
              </label>
              <input
                type="range"
                name="weight"
                id="weight"
                className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 mt-2 transition-all duration-300"
                min={1}
                max={5}
                step={1}
              />

              {state.error?.weight && (
                <p className="text-red-500 text-sm">{state.error.weight}</p>
              )}
            </div>
          )}

          {isRoad() && (
            <div className="mb-4">
              <label
                htmlFor="dashed"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Putus-putus
              </label>
              <input
                type="checkbox"
                name="dashed"
                id="dashed"
                className="border border-gray-200 rounded-sm px-2 py-1"
              />

              {state.error?.dashed && (
                <p className="text-red-500 text-sm">{state.error.dashed}</p>
              )}
            </div>
          )}

          {isBridge() && (
            <div className="mb-2">
              <label
                htmlFor="radius"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Radius
              </label>
              <input
                type="range"
                name="radius"
                id="radius"
                className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
                min={1}
                max={5}
                step={1}
              />

              {state.error?.radius && (
                <p className="text-red-500 text-sm">{state.error.radius}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="color"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              {isRoad() || isBridge() ? "Warna" : "Warna Garis"}
            </label>
            <input
              type="color"
              name="color"
              id="color"
              className="border focus:border-green-500 focus:outline-none rounded transition-all duration-300"
            />

            {state.error?.color && (
              <p className="text-red-500 text-sm">{state.error.color}</p>
            )}
          </div>

          <SubmitButton />
        </form>
      )}
    </div>
  );
}
