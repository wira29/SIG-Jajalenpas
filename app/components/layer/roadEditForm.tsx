import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import { useState } from "react";
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

  const updateRoad = useJalanStore((state) => state.updateRoad);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nama = formData.get("name") as string;

    await updateRoad(roadInformation.id, {
      nama,
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
            defaultValue={roadInformation.road.nama}
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
