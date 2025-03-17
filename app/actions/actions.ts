"use server";

import prisma from "@/libs/prismadb";
import { photo } from "@prisma/client";
import { z } from "zod";
import { GeoJSONImporter } from "../services/geojson-importer";
import { RuasImporter } from "../services/ruas-importer";
import { getCurrentYear } from "../utils/helpers";

// export async function saveGeoJSON(data: GeoJSON.FeatureCollection, detail: FeatureCollectionDetail) {
//   const importer = new GeoJSONImporter();

//   // import geojson
//   await importer.importGeoJSON(data, detail);
// }
// import { useState } from "react";

// type ImportFormProps = {
//   onSuccess: () => void;
// };

const MAX_FILE_SIZE = 20000000;
const ACCEPTED_TYPES = ["application/geo+json"];

const schema = z.object({
  file: z
    .any()
    .refine((files) => files?.length == 1, "Geojson file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 20MB.`
    ),
  // .refine(
  //   (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
  //   ".geojson file are accepted."
  // ),
  tahun: z.preprocess(
    (value) => isNaN(parseInt(value as string)) ? getCurrentYear() : parseInt(value as string),
    z.number()
  ),
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(3, "Name must be at least 3 characters."),
  type: z.enum(["road", "bridge", "area"]),
  color: z.string(),

  // weight is requred only if type is road or area and will be null if type is bridge
  weight: z.preprocess(
    (value) =>
      isNaN(parseInt(value as string)) ? null : parseInt(value as string),
    z.number().nullable()
  ),
  // radius is required only if type is bridge, and will be null if type is road or area
  radius: z.preprocess(
    (value) =>
      isNaN(parseInt(value as string)) ? null : parseInt(value as string),
    z.number().nullable()
  ),

  dashed: z.preprocess((value) => value === "on", z.boolean()),
});

export type ImportFormState = {
  error: Record<string, string> | null;
  success: boolean;
};

export async function saveGeoJSON(
  prevState: ImportFormState | null,
  formData: FormData
): Promise<ImportFormState> {
  const data = schema.safeParse({
    tahun: formData.get("tahun"),
    file: formData.getAll("file"),
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
    weight: formData.get("weight"),
    radius: formData.get("radius"),
    dashed: formData.get("dashed"),
  });

  if (!data.success) {
    console.log("error import", data.error.flatten().fieldErrors as Record<string, string>)
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  // read file
  const file = data.data.file[0];
  const fileContent = await file.text();
  const json = JSON.parse(fileContent);

  // check if file is valid geojson
  if (json.type !== "FeatureCollection") {
    return {
      error: {
        file: "Invalid geojson file.",
      },
      success: false,
    };
  }

  // check if data.type is match with geojson features type
  const featureTypes = json.features.map(
    (feature: any) => feature.geometry.type
  ) as string[];

  const mapper = {
    road: ["LineString", "MultiLineString"],
    bridge: ["Point", "MultiPoint"],
    area: ["Polygon", "MultiPolygon"],
  };
  const inverseMapper: Record<string, string> = {
    LineString: "Jalan",
    MultiLineString: "Jalan",
    Point: "Jembatan",
    MultiPoint: "Jembatan",
    Polygon: "Area",
    MultiPolygon: "Area",
  };
  const matchAll = featureTypes.every((type: string) =>
    mapper[data.data.type].includes(type)
  );

  if (!matchAll) {
    return {
      error: {
        type: `Tipe salah, harap pilih ${inverseMapper[featureTypes[0]]}`,
      },
      success: false,
    };
  }

  const importer = new GeoJSONImporter();

  // import geojson
  await importer.importGeoJSON(json, {
    tahun: data.data.tahun,
    name: data.data.name,
    type: data.data.type,
    color: data.data.color,
    weight: data.data.weight,
    dashed: data.data.dashed,
    radius: data.data.radius,
  });

  return {
    error: null,
    success: true,
  };
}

const ruasSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length == 1, "Geojson file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 20MB.`
    ),
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(3, "Name must be at least 3 characters."),
});

export type SaveRuasFormState = {
  error: Record<string, string> | null;
  success: boolean;
};
export async function saveRuasGeoJSON(
  _: SaveRuasFormState | null,
  formData: FormData
): Promise<SaveRuasFormState> {
  const data = ruasSchema.safeParse({
    file: formData.getAll("file"),
    name: formData.get("name"),
  });

  if (!data.success) {
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  // read file
  const file = data.data.file[0];
  const fileContent = await file.text();
  const json = JSON.parse(fileContent);

  // check if file is valid geojson
  if (json.type !== "FeatureCollection") {
    return {
      error: {
        file: "Invalid geojson file.",
      },
      success: false,
    };
  }

  const importer = new RuasImporter();

  // import geojson
  await importer.importGeoJSON(json, {
    name: data.data.name,
  });

  return {
    error: null,
    success: true,
  };
}

// even though this is an update operation, it is actually adding a new property to the database
export async function updateFeatureProperty(
  featureId: number,
  data: Record<string, any>,
  oldPhotos: photo[],
  updatedPhotos: photo[],
  deletedPhotos: photo[]
) {
  const property = await prisma.properties.create({
    data: {
      data: data,
      featureId: featureId,
    },
  });

  // copy old photos, and update, delete, and add accordingly
  const photos = [...oldPhotos];

  // update photos
  for (const photo of updatedPhotos) {
    const index = photos.findIndex((p) => p.id === photo.id);
    photos[index] = photo;
  }

  // delete photos
  for (const photo of deletedPhotos) {
    const index = photos.findIndex((p) => p.id === photo.id);
    photos.splice(index, 1);
  }

  // duplicate photos (assign to new property)
  for (const photo of photos) {
    await prisma.photo.create({
      data: {
        propertyId: property.id,
        path: photo.path,
        url: photo.url,
        description: photo.description,
      },
    });
  }

  return property;

  // // add photos (upload first)
  // for (const photo of newPhotos) {
  //   const file = photo.file;
  //   const bytes = await file.arrayBuffer();
  //   const fileBuffer = Buffer.from(bytes);

  //   const fileExtension = file.name.split(".").pop();
  //   const fileName = `${Date.now()}.${fileExtension}`;

  //   const path = `./public/uploads/${fileName}`;

  //   // write file to public folder
  //   await writeFile(path, fileBuffer, (err: any) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });

  //   // save file to database
  //   await prisma.photo.create({
  //     data: {
  //       propertyId: property.id,
  //       path: path,
  //       url: path.replace("./public", ""),
  //       description: photo.description,
  //     },
  //   });
  // }
}
