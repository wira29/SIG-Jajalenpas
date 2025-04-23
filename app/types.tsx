
import { Prisma } from "@prisma/client";

export type FeatureCollectionType = "road" | "bridge" | "area";

type Role = {
  role_id: number;
  model_type: string;
  model_id: number;
  role: { name: string }; // Pastikan ada properti `name`
};

export type User = {
  id: bigint;
  name: string;
  email: string;
  password: string;
  roles: Role[];
};

export type FeatureWithProperties = Prisma.featureGetPayload<{
  include: {
    properties: {
      include: { photo: true };
    };
    geometry: true;
  };
}>;

export type FeatureProperty = Prisma.propertiesGetPayload<{
  include: { photo: true };
}>;

export type NewPhoto = {
  file: File;
  description: string;
};

export type JalanWithRuas = Prisma.jalanGetPayload<{
    include: {
        ruas: {
          include: {
            sta: true
          }
        }
    };
}>;

export type JalanWithRuasExtended = JalanWithRuas & {
  ruas: (JalanWithRuas["ruas"][number] & {
    coordinates: Array<number>
  })
}

export type FeatureCollectionFull = Prisma.featurecollectionGetPayload<{
    include: {
      feature: {
        include: {
          properties: {
            include: {
              photo: true;
            };
          };
          geometry: true;
        };
      };
    };
  }>;

  export type RuasWithSta = Prisma.ruasGetPayload<{
    include: {
      picturesonruas: {
        include: {
          picture: true;
        };
      }
      sta: {
        include: {
          picturesonsta: {
            include: {
              picture: true;
            };
          }
        };
      }
    };
  }>;

  export type StaWithPictures = Prisma.staGetPayload<{
    include: {
      picturesonsta: {
        include: {
          picture: true;
        }
      },
      ruas: true
    };
  }>;

  export type StaPicture = Prisma.picturesonstaGetPayload<{
    include: {
      picture: true;
    };
  }>;

  export type RuasPicture = Prisma.picturesonruasGetPayload<{
    include: {
      picture: true;
    };
  }>;

  export type RuasHistoryWithPictures = Prisma.ruashistoryGetPayload<{
    include: {
      picturesonruashistory: {
        include: {
          picture: true;
        };
      };
    };
  }>;

  export type StaHistoryWithPictures = Prisma.stahistoryGetPayload<{
    include: {
      picturesonstahistory: {
        include: {
          picture: true;
        };
      };
    };
  }>;