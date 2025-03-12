/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import { FeatureWithProperties } from "../../types";

const attributes: Record<string, string> = {
  "Nama Jalan": "Jdl",
  Pengeras: "Tipe_Ker_1",
  Baik: "Kon_Baik_1",
  Sedang: "Kon_Sdg_1",
  "Rusak Ringan": "Kon_Rgn_1",
  "Rusak Berat": "Kon_Rusa_1",
};

type FeaturePropertyDetailPopupProp = {
  feature: FeatureWithProperties | null;
  onDetail: () => void;
};
export default function FeaturePropertyDetailPopup({
  feature,
  onDetail,
}: FeaturePropertyDetailPopupProp) {
  const property = feature?.properties[0];
  const data = useMemo(() => {
    return (
      Object.keys(property?.data ?? {}).map((key) => [
        key,
        (property?.data as any)[key],
      ]) ?? []
    );
  }, [property?.data]);

  const properties = (property?.data ?? {}) as Record<string, any>;
  const titleCandidates = Object.values(properties);
  const title = properties?.Jdl ?? titleCandidates[0] ?? "Feature";

  const align = "align-top";

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold mb-4">{title}</h1>

      {/* <AuthenticatedOnly> */}
        <table className="table-auto text-sm">
          <tbody key={data.length}>
            {Object.keys(attributes).map((key, i) => (
              <tr key={i}>
                <td className={`py-1 font-bold text-xs ${align} w-28`}>
                  {key}
                  <br />
                  <span className="text-slate-500 text-[8px]">
                    ({attributes[key]})
                  </span>
                </td>
                <td className={`py-1 text-xs px-1 ${align}`}>:</td>
                <td className={`py-1 text-xs ${align}`}>
                  {properties?.[attributes[key]] ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* images */}
        <h1 className="text-sm font-bold mt-4 mb-2">Foto</h1>

        <div className="grid grid-cols-2 gap-1">
          {property?.photos?.length === 0 && (
            <div className="w-full p-1">
              <span className="text-xs text-gray-500">Tidak ada foto</span>
            </div>
          )}

          {property?.photos?.map((photo: any, i: any) => (
            <div
            key={i}
            className="flex flex-col justify-center items-center"
          >
            {/* <ImageDialog image={"/api/photo/" + photo.id} desc={photo.description ?? ""} data={null}>
            <DialogTrigger className="w-full">
                <img
                  src={"/api/photo/" + photo.id}
                  alt={photo.description ?? ""}
                  className="w-full object-cover rounded"
                />

                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {photo.description}
                  </span>
                </div>
            </DialogTrigger>
            </ImageDialog> */}
          </div>
          ))}
        </div>

        <button
          className="text-sm font-bold text-green-500 mt-4"
          onClick={onDetail}
        >
          Detail
        </button>
      {/* </AuthenticatedOnly>

      <LoginToSee /> */}
    </div>
  );
}
