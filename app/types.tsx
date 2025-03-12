
import { Prisma } from "@prisma/client";

export type FeatureCollectionType = "road" | "bridge" | "area";

export type FeatureWithProperties = Prisma.FeatureGetPayload<{
  include: {
    properties: {
      include: { photos: true };
    };
    geometry: true;
  };
}>;

export type FeatureProperty = Prisma.PropertiesGetPayload<{
  include: { photos: true };
}>;

export type NewPhoto = {
  file: File;
  description: string;
};

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

  export type RuasWithSta = Prisma.RuasGetPayload<{
    include: {
      pictures: {
        include: {
          picture: true;
        };
      };
      sta: {
        include: {
          pictures: {
            include: {
              picture: true;
            };
          }
        };
      }
    };
  }>;

  export type StaWithPictures = Prisma.StaGetPayload<{
    include: {
      pictures: {
        include: {
          picture: true;
        };
      }
    };
  }>;