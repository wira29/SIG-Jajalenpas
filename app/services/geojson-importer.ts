
import prisma from "@/libs/prismadb";
import { PrismaClient } from "@prisma/client";
import { FeatureCollectionType } from "../types";


function tryParseInt(value: string, defaultValue: number | null) {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

export type FeatureCollectionDetail = {
  tahun: number;
  name: string;
  type: FeatureCollectionType,
  color: string;
  weight: number | null;
  dashed: boolean | null;
  radius: number | null;
};

export class GeoJSONImporter {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async importGeoJSON(geoJSON: GeoJSON.FeatureCollection, detail: FeatureCollectionDetail) {
    "use server"

    const featureCollection = await this.client.featurecollection.create({
      data: {
        tahun: detail.tahun,
        name: detail.name,
        type: detail.type,
        color: detail.color,
        weight: detail.weight ?? 0,
        dashed: detail.dashed ?? false,
        radius: detail.radius ?? 0,
        feature: {
          create: geoJSON.features.map((feature) => ({
            type: feature.type,
            properties: {
              create: [
                {
                  data: feature.properties as any,
                  // baik: tryParseInt(feature.properties?.Kon_Baik_1, null),
                  // sedang: tryParseInt(feature.properties?.Kon_Sdg_1, null),
                  // rusakRingan: tryParseInt(feature.properties?.Kon_Rgn_1, null),
                  // rusakBerat: tryParseInt(feature.properties?.Kon_Rusa_1, null),
                  // mantap: tryParseInt(feature.properties?.Kon_Mntp_1, null),
                  // tidakMantap: tryParseInt(feature.properties?.Kon_T_Mn_1, null),
                  // perkerasan: feature.properties?.Tipe_Ker_1,
                },
              ],
            },
            geometry: {
              create: {
                type: feature.geometry.type,
                coordinates: (feature.geometry as any)?.coordinates ?? [],
              },
            },
          })),
        },
      },
    });

    return featureCollection;
  }

}