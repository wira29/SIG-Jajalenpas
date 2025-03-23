import { photo } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoAdd, IoTrash } from "react-icons/io5";
import { NewPhoto } from "../../types";

type FeaturePropertyEditorProps = {
  initialData?: Record<string, any>;
  photos?: Array<photo>;
  isLoading?: boolean;
  onSave?: (
    data: Record<string, any>,
    newPhotos: Array<NewPhoto>,
    updatedPhotos: Array<photo>,
    deletedPhotos: Array<photo>
  ) => void;
};

export default function FeaturePropertyEditor(
  props: FeaturePropertyEditorProps
) {
  const toArray = useCallback(
    (data?: Record<string, any>): Array<[string, any]> => {
      const records =
        Object.keys(data ?? {}).map((key) => [key, (data as any)[key]]) ?? [];
      // add RENCANA ANGGARAN if not already there
      if (!records.find(([key]) => key === "RENCANA ANGGARAN")) {
        records.unshift(["RENCANA ANGGARAN", ""]);
      } else {
        // shift RENCANA ANGGARAN to the top
        const idx = records.findIndex(([key]) => key === "RENCANA ANGGARAN");
        const [removed] = records.splice(idx, 1);
        records.unshift(removed);
      }

      return records as Array<[string, any]>;
    },
    []
  );

  const [data, setData] = useState<Array<[string, any]>>(
    toArray(props.initialData)
  );

  const [photos, setPhotos] = useState<Array<NewPhoto | photo>>(
    props.photos ?? []
  );

  const deletedPhotos = useRef<Array<photo>>([]);
  const updatedPhotos = useRef<Array<photo>>([]);
  const newPhotos = useRef<Array<NewPhoto>>([]);

  useEffect(() => {
    setData(toArray(props.initialData));
  }, [props.initialData, toArray]);

  function onInputChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    // update data, wether it's the key or the value
    const [key, index] = e.target.name.split("-");
    const i = parseInt(index);
    const value = e.target.value;

    const newData = [...data];

    if (key === "key") {
      newData[i][0] = value;
    } else {
      newData[i][1] = value;
    }

    setData(newData);
  }

  function toJson() {
    return data
      .filter(([key, value]) => key !== "")
      .reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  const align = "align-middle";

  return (
    <div className="flex flex-col">
      <table className="table-auto text-sm">
        <tbody key={data.length}>
          {data.map((d, i) => (
            <tr key={`${i}`}>
              <td className={`py-1 font-bold text-xs ${align} w-28`}>
                <input
                  type="text"
                  name={`key-${i}`}
                  className="border  focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  defaultValue={d[0]}
                  onChange={onInputChange}
                />
              </td>
              <td className={`py-1 text-xs px-1 ${align}`}>:</td>
              <td className={`py-1 text-xs ${align}`} colSpan={2}>
                <textarea
                  name={`value-${i}`}
                  className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  rows={1}
                  defaultValue={d[1]}
                  onChange={onInputChange}
                />
              </td>

              <td className={`pl-2 py-1 px-1 ${align}`}>
                {d[0] !== "RENCANA ANGGARAN" && (
                  <button
                    className="text-red-500 hover:text-red-800 transition-all duration-300"
                    onClick={() => {
                      const newData = [...data];

                      newData.splice(i, 1);

                      setData(newData);
                    }}
                  >
                    <IoTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* add field button */}
      <div className="flex justify-end pt-2">
        <button
          className="bg-white shadow-lg text-green-700 px-4 py-2 rounded hover:bg-green-800 hover:text-white transition-all duration-300"
          // prevent submit
          type="button"
          onClick={() => {
            setData([...data, ["", ""]]);
          }}
        >
          <IoAdd />
        </button>
      </div>

      {/* photos editor, can remove or add photos and can also add description */}
      <h1 className="text-xs sm:text-sm font-bold mt-4 mb-2">Foto</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {photos.length === 0 && (
          <div className="w-full">
            <span className="text-xs text-gray-500">Tidak ada foto</span>
          </div>
        )}

        {photos.map((photo, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // if photo is Photo, use url, if photo is File, use url
              src={
                (photo as photo).id
                  ? "/api/photo/" + (photo as photo).id
                  : URL.createObjectURL((photo as NewPhoto).file)
              }
              alt={photo.description ?? ""}
              className="w-full h-32 object-cover rounded"
            />

            <div className="flex justify-between items-center mt-1">
              <input
                type="text"
                className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                placeholder="Deskripsi"
                defaultValue={photo.description ?? ""}
                onChange={(e) => {
                  const data = [...photos];

                  data[i].description = e.target.value;

                  setPhotos(data);

                  if ((data[i] as photo).id) {
                    // check if photo is in updated, if not, add it, if yes, update it
                    if (
                      !updatedPhotos.current.find(
                        (p) => p.id === (data[i] as photo).id
                      )
                    ) {
                      updatedPhotos.current.push(data[i] as photo);
                    } else {
                      updatedPhotos.current = updatedPhotos.current.map((p) =>
                        p.id === (data[i] as photo).id ? data[i] : (p as photo)
                      ) as Array<photo>;
                    }
                  } else {
                    newPhotos.current = newPhotos.current.map((p) =>
                      p.file === (data[i] as NewPhoto).file ? data[i] : p
                    ) as Array<NewPhoto>;
                  }
                }}
              />

              <button
                className="text-red-500 hover:text-red-800 transition-all duration-300 p-2 bg-slate-200 rounded ml-2"
                onClick={() => {
                  const data = [...photos];

                  data.splice(i, 1);

                  setPhotos(data);

                  if ((photo as photo).id) {
                    // add to deleted if not already there
                    if (
                      !deletedPhotos.current.find(
                        (p) => p.id === (photo as photo).id
                      )
                    ) {
                      deletedPhotos.current.push(photo as photo);
                    }
                  } else {
                    newPhotos.current = newPhotos.current.filter(
                      (p) => p.file !== (photo as NewPhoto).file
                    );
                  }
                }}
              >
                <IoTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* add photo button */}
      <div className="w-full pt-4">
        <label
          htmlFor="photo"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 text-xs sm:text-sm"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo"
            onChange={(e) => {
              const files = [];

              for (let i = 0; i < e.target.files!.length; i++) {
                const file = e.target.files![i];

                files.push({
                  file,
                  description: "",
                });
              }

              setPhotos([...photos, ...files]);
              newPhotos.current = [...newPhotos.current, ...files];
            }}
          />
          Tambah Foto
        </label>
      </div>

      {/* save button */}
      <div className="flex justify-stretch pt-4">
        <button
          // className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full"
          className={
            "bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full text-xs sm:text-sm" +
            (props.isLoading ? " opacity-50" : "")
          }
          onClick={
            props.isLoading
              ? undefined
              : () => {
                  // cleanup, if photo is deleted and updated, remove from updated
                  for (const photo of updatedPhotos.current) {
                    if (deletedPhotos.current.find((p) => p.id === photo.id)) {
                      updatedPhotos.current = updatedPhotos.current.filter(
                        (p) => p.id !== photo.id
                      );
                    }
                  }

                  props.onSave?.(
                    toJson(),
                    newPhotos.current,
                    updatedPhotos.current,
                    deletedPhotos.current
                  );

                  // cleanup
                  newPhotos.current = [];
                  updatedPhotos.current = [];
                  deletedPhotos.current = [];
                  setPhotos([]);
                }
          }
        >
          {props.isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
