import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import { FeatureCollectionType } from "@/app/types";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

type EditFormProps = {
  layerInformation: LayerInformation;
  onSuccess: () => void;
  onClose: () => void;
};

export default function EditForm({
  layerInformation,
  onSuccess,
  onClose,
}: EditFormProps) {
  const layerType = layerInformation.layer.type as FeatureCollectionType;

  const isRoad = () => layerType === "road";
  const isBridge = () => layerType === "bridge";
  const isArea = () => layerType === "area";

  const [isLoading, setIsLoading] = useState(false);

  const updateLayer = useLayersStore((state) => state.updateLayer);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const color = formData.get("color") as string;
    const weight = formData.get("weight") as string;
    const radius = formData.get("radius") as string;
    const dashed = formData.get("dashed") as string;

    console.log({
        name,
        type,
        color,
        weight: weight ? parseInt(weight) : 0,
        radius: radius ? parseInt(radius) : 0,
        dashed: dashed == "on",
    });

    await updateLayer(layerInformation.id, {
        name,
        type,
        color,
        weight: weight ? parseInt(weight) : 0,
        radius: radius ? parseInt(radius) : 0,
        dashed: dashed == "on",
    });

    setIsLoading(false);
    onSuccess();
  }

  return (
    <div className="max-w-lg mx-auto overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold ">Edit</h1>
          <small className="inline-block">
            Atur bagaimana layer ini akan ditampilkan di peta.
          </small>
        </div>
        <button onClick={() => onClose()}>
          <IoClose />
        </button>
      </div>

      <hr />

      <form
        onSubmit={save}
        className="max-w-sm mx-auto bg-white rounded shadow-md p-4"
      >
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
            className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            required
            defaultValue={layerInformation.layer.name}
          />
        </div>

        <input
          id="type"
          name="type"
          type="hidden"
          required
          defaultValue={layerInformation.layer.type}
        />

        {(isRoad() || isArea()) && (
          <div className="mb-2">
            <label
              htmlFor="weight"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              Tebal
            </label>
            <input
              type="range"
              name="weight"
              id="weight"
              className="border focus:border-green-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
              min={1}
              max={5}
              step={1}
              required
              defaultValue={layerInformation.layer.weight ?? 1}
            />
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
              defaultChecked={layerInformation.layer.dashed ?? false}
            />
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
              className="border focus:border-green-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
              min={1}
              max={5}
              step={1}
              required
              defaultValue={layerInformation.layer.radius ?? 1}
            />
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
            // className="border focus:border-green-500 focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
            className="rounded-sm transition-all duration-300"
            required
            defaultValue={layerInformation.layer.color}
          />
        </div>

        <button
          type="submit"
          className={`bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
