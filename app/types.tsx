
import { Prisma } from "@prisma/client";

export type FeatureCollectionType = "road" | "bridge" | "area";

export type JalanWithRuas = Prisma.JalanGetPayload<{
    include: {
        ruas: true
    };
}>;

export type FeatureCollectionFull = Prisma.FeatureCollectionGetPayload<{
    include: {
      feature: {
        include: {
          properties: {
            include: {
              photos: true;
            };
          };
          geometry: true;
        };
      };
    };
  }>;