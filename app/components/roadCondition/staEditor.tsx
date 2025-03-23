import useSelectedRuasStore from "@/app/stores/selected_ruas_store";
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { StaPicture } from "@/app/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoTrash } from "react-icons/io5";

const keyAlias = {
  nomorRuas: "Nomor Ruas",
  sta: "STA",
  xAwal: "X Awal",
  yAwal: "Y Awal",
  xAkhir: "X Akhir",
  yAkhir: "Y Akhir",
  kondisi: "Kondisi",
  perkerasan: "Perkerasan",
};

type NewPicture = {
  file: File;
  description: string;
};

type StaEditorProps = {
  onDoneEditing: () => void;
};
export default function StaEditor({ onDoneEditing }: StaEditorProps) {
  const sta = useSelectedStaStore((state) => state.selected);

  const convert = useCallback(() => {
    return Object.keys(sta ?? {}).reduce((acc: any, key) => {
      if (key in (sta ?? {})) {
        acc[key] = sta?.[key as keyof typeof sta] as string;
      }
      return acc;
    }, {});
  }, [sta]);

  const properties = useRef<Record<string, string>>(convert());

  useEffect(() => {
    properties.current = convert();
  }, [sta, convert]);

  const [pictures, setPictures] = useState<Array<StaPicture | NewPicture>>(
    sta?.picturesonsta || []
  );

  const deletedPictures = useRef<Array<StaPicture>>([]);
  const updatedPictures = useRef<Array<StaPicture>>([]);
  const newPictures = useRef<Array<NewPicture>>([]);

  return (
    <div className="flex flex-col">
      {/* <pre>{JSON.stringify(sta, null, 2)}</pre> */}
      <table className="table-auto text-sm">
        <tbody>
          {Object.keys(properties.current)
            .filter((item) => keyAlias[item as keyof typeof keyAlias])
            .map((item, index) => (
              <tr key={index}>
                <td className={`py-1 font-bold text-xs w-28`}>
                  <input
                    type="text"
                    className="border  focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300 placeholder-black"
                    placeholder={keyAlias[item as keyof typeof keyAlias]}
                    readOnly
                  />
                </td>
                <td className={`py-1 text-xs px-1`}>:</td>
                <td className={`py-1 text-xs`} colSpan={2}>
                  {item === "kondisi" ? (
                    <select
                      className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                      defaultValue={properties.current[item] as string}
                      onChange={(e) => {
                        properties.current[item] = e.target.value;
                      }}
                    >
                      <option value="Baik">Baik</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  ) : (
                    <textarea
                      className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300 disabled:opacity-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                      rows={1}
                      defaultValue={properties.current[item] as string}
                      readOnly={[
                        "nomorRuas",
                        // "sta",
                        // "xAwal",
                        // "yAwal",
                        // "xAkhir",
                        // "yAkhir",
                      ].includes(item)}
                      onChange={(e) => {
                        properties.current[item] = e.target.value;
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* photos editor, can remove or add photos and can also add description */}
      <h1 className="text-sm font-bold mt-4 mb-2">Foto</h1>

      <div className="grid grid-cols-2 gap-2">
        {pictures.length === 0 && (
          <div className="w-full">
            <span className="text-xs text-gray-500">Tidak ada foto</span>
          </div>
        )}

        {pictures.map((picture, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // if photo is Picture, use url, if photo is File, use url
              src={
                (picture as StaPicture).idPicture
                  ? "/api/picture/" + (picture as StaPicture).idPicture
                  : URL.createObjectURL((picture as NewPicture).file)
              }
              alt={picture.description ?? ""}
              className="w-full h-32 object-cover rounded"
            />

            <div className="flex justify-between items-center mt-1">
              <input
                type="text"
                className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                placeholder="Deskripsi"
                defaultValue={picture.description ?? ""}
                onChange={(e) => {
                  const data = [...pictures];

                  data[i].description = e.target.value;

                  setPictures(data);

                  if ((data[i] as StaPicture).idPicture) {
                    // check if photo is in updated, if not, add it, if yes, update it
                    if (
                      !updatedPictures.current.find(
                        (p) => p.idPicture === (data[i] as StaPicture).idPicture
                      )
                    ) {
                      updatedPictures.current.push(data[i] as StaPicture);
                    } else {
                      updatedPictures.current = updatedPictures.current.map(
                        (p) =>
                          p.idPicture === (data[i] as StaPicture).idPicture
                            ? data[i]
                            : (p as StaPicture)
                      ) as Array<StaPicture>;
                    }
                  } else {
                    newPictures.current = newPictures.current.map((p) =>
                      p.file === (data[i] as NewPicture).file ? data[i] : p
                    ) as Array<NewPicture>;
                  }
                }}
              />

              <button
                className="text-red-500 hover:text-red-800 transition-all duration-300 p-2 bg-slate-200 rounded ml-2"
                onClick={() => {
                  const data = [...pictures];

                  data.splice(i, 1);

                  setPictures(data);

                  if ((picture as StaPicture).idPicture) {
                    // add to deleted if not already there
                    if (
                      !deletedPictures.current.find(
                        (p) => p.idPicture === (picture as StaPicture).idPicture
                      )
                    ) {
                      deletedPictures.current.push(picture as StaPicture);
                    }
                  } else {
                    newPictures.current = newPictures.current.filter(
                      (p) => p.file !== (picture as NewPicture).file
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
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 text-xs sm:text-md"
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

              setPictures([...pictures, ...files]);
              newPictures.current = [...newPictures.current, ...files];
            }}
          />
          Tambah Foto
        </label>
      </div>

      {/* save button */}
      <div className="flex justify-stretch pt-4">
        <button
          onClick={async () => {
            await onSave({
              properties: properties.current,
              deletedPictures: deletedPictures.current,
              updatedPictures: updatedPictures.current,
              newPictures: newPictures.current,
            });

            onDoneEditing();
          }}
          className={
            "bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full text-xs sm:text-md"
          }
        >
          Simpan
        </button>
      </div>
    </div>
  );
}

type SaveData = {
  properties: Record<string, string>;
  deletedPictures: Array<StaPicture>;
  updatedPictures: Array<StaPicture>;
  newPictures: Array<NewPicture>;
};

async function onSave(data: SaveData) {
  const formData = new FormData();

  for (const key in data.properties) {
    formData.append(key, data.properties[key]);
  }

  for (const picture of data.deletedPictures) {
    formData.append("deletedPictures", picture.idPicture.toString());
  }

  for (const picture of data.updatedPictures) {
    formData.append("updatedPictures", picture.idPicture.toString());
    formData.append("updatedPicturesDescription", picture.description ?? "");
  }

  for (const picture of data.newPictures) {
    formData.append("newPictures", picture.file);
    formData.append("newPicturesDescription", picture.description);
  }

  try {
    const response = await fetch(`/api/sta/${data.properties.id}`, {
      method: "PATCH",
      body: formData,
    });

    const updated = await response.json();

    useSelectedStaStore.getState().set(updated);
    useSelectedRuasStore.getState().refresh();
  } catch (error) {
    console.error(error);
  }
}
