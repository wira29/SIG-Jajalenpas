import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import { getCurrentYear } from "@/app/utils/helpers";
import { Label } from "@/components/ui/label";
import { TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

type EditFormProps = {
  roadInformation: JalanInformation;
  onSuccess: () => void;
  onClose: () => void;
};

export default function RoadEditForm({
  roadInformation: roadInformation,
  onSuccess,
  onClose,
}: EditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const inputYear = useRef(getCurrentYear())
  const [isRoadDashed, setIsRoadDashed] = useState(roadInformation.dash ? true : false);
  const [isKewenangan, setIsKewenangan] = useState(roadInformation.is_kewenangan ? true : false);

  const updateRoad = useJalanStore((state) => state.updateRoad);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nama = formData.get("name") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const weight = parseInt(formData.get("weight") as string);
    const dash = parseInt(formData.get("dash") as string);
    const dashLength = parseInt(formData.get("dashLength") as string);
    const descKewenangan = formData.get("desc_kewenangan") as string;
    const color = formData.get("color") as string;

    const data : any = {
      nama,
      tahun,
      color,
      weight,
      dash : null,
      dashLength : null,
      is_kewenangan : isKewenangan,
      desc_kewenangan : descKewenangan
    };


    if (isRoadDashed) {
      data.dash = dash;
      data.dashLength = dashLength;
    }
    

    await updateRoad(roadInformation.id, data);

    setIsLoading(false);
    onSuccess();
  }

  return (
    <div className="max-w-lg mx-auto overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold ">Edit</h1>
          <small className="inline-block">
            Atur bagaimana jalan ini akan ditampilkan di peta.
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
          <Label className="mb-3">Tahun</Label>
          <TextInput name="tahun" defaultValue={roadInformation.tahun} />
          {/* {state.error?.tahun && (
            <p style={{ color: "red" }}>{state.error.tahun[0]}</p>
          )} */}
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
            className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            required
            defaultValue={roadInformation.name}
          />
        </div>

        <div className="mb-4">
            <label
              htmlFor="color"
              className="text-gray-700 text-sm font-bold block mb-2"
            >
              Warna Garis
            </label>
            <input
              type="color"
              name="color"
              id="color"
              defaultValue={roadInformation.color}
              className="border focus:border-green-500 focus:outline-none rounded transition-all duration-300"
            />

            {/* {state.error?.color && (
              <p className="text-red-500 text-sm">{state.error.color}</p>
            )} */}
          </div>

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
                defaultValue={roadInformation.weight}
              />

              {/* {state.error?.weight && (
                <p className="text-red-500 text-sm">{state.error.weight}</p>
              )} */}
            </div>

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
                checked={isRoadDashed}
                className="border border-gray-200 rounded-sm px-2 py-1"
                onChange={(e) => setIsRoadDashed(e.target.checked)}
              />
            </div>

            {isRoadDashed && (
              <>
              <div className="mb-4">
              <label
                htmlFor="dash"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Spasi Garis
              </label>
              <input
                type="range"
                name="dash"
                id="dash"
                className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 mt-2 transition-all duration-300"
                min={1}
                max={10}
                step={1}
                defaultValue={roadInformation.dash ?? 0}
              />

              {/* {state.error?.weight && (
                <p className="text-red-500 text-sm">{state.error.weight}</p>
              )} */}
            </div>
            <div className="mb-4">
              <label
                htmlFor="dashLength"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Panjang Garis
              </label>
              <input
                type="range"
                name="dashLength"
                id="dashLength"
                className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 mt-2 transition-all duration-300"
                min={1}
                max={10}
                step={1}
                defaultValue={roadInformation.dashLength ?? 0}
              />

              {/* {state.error?.weight && (
                <p className="text-red-500 text-sm">{state.error.weight}</p>
              )} */}
            </div>
            </>
            )}

            <div className="mb-4">
              <label
                htmlFor="is_kewenangan"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Apakah jalan ini kewenangan kabupaten?
              </label>
              <input
                type="checkbox"
                name="is_kewenangan"
                id="is_kewenangan"
                checked={isKewenangan}
                className="border border-gray-200 rounded-sm px-2 py-1"
                onChange={(e) => setIsKewenangan(e.target.checked)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="desc_kewenangan"
                className="text-gray-700 text-sm font-bold block mb-2"
              >
                Deskripsi Kewenangan
              </label>
              <textarea
                name="desc_kewenangan"
                id="desc_kewenangan"
                className="text-sm border focus:border-green-500 w-full focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
                defaultValue={roadInformation.desc_kewenangan ?? ""}
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
