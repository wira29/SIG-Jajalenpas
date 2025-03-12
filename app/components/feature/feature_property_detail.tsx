/* eslint-disable @next/next/no-img-element */
import { photo } from "@prisma/client";
// import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { FeatureProperty, NewPhoto } from "../../types";
// import ImageDialog from "../Dialog/ImageDiaolog";
// import FeaturePropertyEditor from "../FeaturePropertyEditor";
// import OperatorOnly from "../OperatorOnly";

type FeaturePropertyDetailProp = {
  // feature: FeatureWithProperties | null;
  property: FeatureProperty | undefined;
  isEditing?: boolean;
  onSave?: (
    data: Record<string, any>,
    newPhotos: NewPhoto[],
    updatedPhotos: photo[],
    deletedPhotos: photo[]
  ) => void;
};
export default function FeaturePropertyDetail({
  property,
  isEditing,
  onSave,
}: FeaturePropertyDetailProp) {
  const [data, setData] = useState<Array<[string, any]>>(
    Object.keys(property?.data ?? {}).map((key) => [
      key,
      (property?.data as any)[key],
    ]) ?? []
  );

  useEffect(() => {
    setData(
      Object.keys(property?.data ?? {}).map((key) => [
        key,
        (property?.data as any)[key],
      ]) ?? []
    );
  }, [isEditing, property?.data]);

  // shift RENCANA ANGGARAN to the top
  const properties = useMemo(() => {
    const idx = data.findIndex(([key]) => key === "RENCANA ANGGARAN");
    if (idx === -1) return data;

    const copy = [...data];
    const [removed] = copy.splice(idx, 1);
    copy.unshift(removed);

    return copy;
  }, [data]);

  function toJson() {
    return data
      .filter(([key, value]) => key !== "")
      .reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  const align = isEditing ? "align-middle" : "align-top";

  return (
    <div className="flex flex-col">
      {isEditing ? (
        // <FeaturePropertyEditor
        //   initialData={toJson()}
        //   photos={property?.photos ?? []}
        //   isLoading={false}
        //   onSave={onSave}
        // />
        null
      ) : (
        <>
          {/* <AuthenticatedOnly> */}
            <table className="table-auto text-sm">
              <tbody key={data.length}>
                {properties.map((d, i) =>
                  d[0] === "RENCANA ANGGARAN" ? (
                    // <OperatorOnly key={`${i}`}>
                      <tr key={`${i}`} className="border bg-blue-100">
                        <td className={`py-1 font-bold align-middle w-28 p-2`}>
                          {d[0]}
                        </td>
                        <td className={`py-1 text-xs px-1 align-middle`}>:</td>
                        <td className={`py-1 align-middle`}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(d[1])}
                        </td>
                      </tr>
                    // </OperatorOnly>
                  ) : (
                    <tr key={`${i}`}>
                      <td className={`py-1 font-bold text-xs ${align} w-28`}>
                        {d[0]}
                      </td>
                      <td className={`py-1 text-xs px-1 ${align}`}>:</td>
                      <td className={`py-1 text-xs ${align}`}>{d[1]}</td>
                    </tr>
                  )
                )}
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
          {/* </AuthenticatedOnly>

          <LoginToSee /> */}
        </>
      )}
    </div>
  );
}
