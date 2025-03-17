
import prisma from "@/libs/prismadb";
import { PrismaClient } from "@prisma/client";

// tabel ruas = data umum jalan (
//   Nomor Ruas
//   Nama Ruas
//   Kecamatan yang dilalui
//   Panjang SK
//   Lebar
//   Keterangan
// )

// tabel sta = data ruas ruas (
//   id
//   Nomor Ruas (FK)
//   STA
//   X_awal
//   Y_awal
//   X_akhir
//   Y_akhir
//   Kondisi
//   Perkerasan
// )

function tryParseInt(value: any, defaultValue?: number | null) {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

export type ImportRuasDetail = {
  name: string;
};

export class RuasImporter {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async importGeoJSON(geoJSON: GeoJSON.FeatureCollection, detail: ImportRuasDetail) {
    "use server"


    // {
    //   "type": "Feature",
    //   "properties": {
    //     "Judul": "Lingkar",
    //     "No_Ruas": 90809,
    //     "SK_Name": "Lingkar",
    //     "GPX_Name": "Lingkar - Rebono",
    //     "Pangkal_Ru": "Lingkar",
    //     "Ujung_Ruas": "Rebono",
    //     "TP_Pangk": "239/239",
    //     "TP_Ujung": "239/239",
    //     "Pjng_SK": 1.88,
    //     "Lebar_SK": 2.5,
    //     "X_Awal": 694346.50846599997,
    //     "Y_awal": 9148351.0654399991,
    //     "X_Akhir": 694511.16083399998,
    //     "Y_Akhir": 9148261.0528699998,
    //     "Kecamatan": "Wonorejo",
    //     "STA": "0+200",
    //     "Kondisi": "Baik",
    //     "Perkerasan": "Beton"
    //   },

    // each feature is an STA, to get the ruas, we need to group them by No_Ruas and create a new ruas for each No_Ruas
    type Ruas = {
      nomorRuas: number;
      namaRuas: string;
      kecamatan: string;
      panjangSK: number;
      lebar: number;
      keterangan: string;
      latitude: number;
      longitude: number;
      sta: {
        nomorRuas: number;
        sta: string;
        xAwal: number;
        yAwal: number;
        xAkhir: number;
        yAkhir: number;
        kondisi: string;
        perkerasan: string;
        coordinates: any[];
      }[];
    };
    const ruas = geoJSON.features.reduce((acc: Ruas[], feature) => {
      const properties = feature.properties as any;

      if (!properties) {
        return acc;
      }

      const ruas = acc.find((ruas) => ruas.nomorRuas === properties.No_Ruas);

      const sta = {
        nomorRuas: properties.No_Ruas,
        sta: properties.STA,
        xAwal: properties.X_Awal,
        yAwal: properties.Y_awal,
        xAkhir: properties.X_Akhir,
        yAkhir: properties.Y_Akhir,
        kondisi: properties.Kondisi,
        perkerasan: properties.Perkerasan || properties.Tipe_Perke,
        coordinates: feature.geometry ? (feature.geometry as any).coordinates : [],
      };

      if (ruas) {
        // add STA to existing ruas
        ruas.sta.push(sta);

        return acc;
      }

      // lat and long, use first STA geometry
      const geometry = feature.geometry as any;
      // get first coordinate from MultiLineString
      if (geometry.coordinates[0] == undefined) {
        return acc;
      }

      const coordinate = geometry.coordinates[0][0];
      // geojson stored as [longitude, latitude]
      const latitude = coordinate[1];
      const longitude = coordinate[0];

      return [
        ...acc,
        {
          nomorRuas: properties.No_Ruas,
          namaRuas: properties.GPX_Name,
          kecamatan: properties.Kecamatan,
          panjangSK: properties.Pjng_SK,
          lebar: parseFloat(properties.Lebar_SK) || 0,
          keterangan: properties.GPX_Name,
          latitude,
          longitude,
          sta: [sta],
        },
      ];
    }, []);

    // update ruas latitude and longitude to be the middle of the stas
    ruas.forEach((ruas) => {
      const middleSTA = ruas.sta[Math.floor(ruas.sta.length / 2)];

      if (middleSTA) {
        const geometry = middleSTA.coordinates[0];

        if (geometry) {
          const coordinate = geometry[0];
          ruas.latitude = coordinate[1];
          ruas.longitude = coordinate[0];
        }
      }
    });

    const jalan = await this.client.jalan.create({
      data: {
        nama: detail.name,
        ruas: {
          create: ruas.map((ruas) => ({
            nomorRuas: ruas.nomorRuas,
            namaRuas: ruas.namaRuas,
            kecamatan: ruas.kecamatan,
            panjangSK: ruas.panjangSK,
            lebar: ruas.lebar,
            keterangan: ruas.keterangan,
            latitude: ruas.latitude,
            longitude: ruas.longitude,
            sta: {
              create: ruas.sta.map((sta) => ({
                sta: sta.sta,
                xAwal: sta.xAwal,
                yAwal: sta.yAwal,
                xAkhir: sta.xAkhir,
                yAkhir: sta.yAkhir,
                kondisi: sta.kondisi,
                perkerasan: sta.perkerasan,
                coordinates: sta.coordinates,
              })),
            },
          })),
        },
      },
    });

    return jalan;


    // model Ruas {
    //   id         Int      @id @default(autoincrement())
    //   nomorRuas  String
    //   namaRuas   String
    //   kecamatan  String
    //   panjangSK  Float
    //   lebar      Float
    //   keterangan String?
    //   createdAt  DateTime @default(now())

    //   sta Sta[]
    // }

    // model Sta {
    //   id         Int      @id @default(autoincrement())
    //   nomorRuas  String
    //   sta        Float
    //   xAwal      Float
    //   yAwal      Float
    //   xAkhir     Float
    //   yAkhir     Float
    //   kondisi    String
    //   perkerasan String
    //   createdAt  DateTime @default(now())

    //   ruasId Int  @map("ruasId")
    //   ruas   Ruas @relation(fields: [ruasId], references: [id], onDelete: Cascade)
    // }


    // const featureCollection = await this.client.featureCollection.create({
    //   data: {
    //     name: detail.name,
    //     type: detail.type,
    //     color: detail.color,
    //     weight: detail.weight,
    //     dashed: detail.dashed,
    //     radius: detail.radius,
    //     features: {
    //       create: geoJSON.features.map((feature) => ({
    //         type: feature.type,
    //         properties: {
    //           create: [
    //             {
    //               data: feature.properties as any,
    //               // baik: tryParseInt(feature.properties?.Kon_Baik_1, null),
    //               // sedang: tryParseInt(feature.properties?.Kon_Sdg_1, null),
    //               // rusakRingan: tryParseInt(feature.properties?.Kon_Rgn_1, null),
    //               // rusakBerat: tryParseInt(feature.properties?.Kon_Rusa_1, null),
    //               // mantap: tryParseInt(feature.properties?.Kon_Mntp_1, null),
    //               // tidakMantap: tryParseInt(feature.properties?.Kon_T_Mn_1, null),
    //               // perkerasan: feature.properties?.Tipe_Ker_1,
    //             },
    //           ],
    //         },
    //         geometry: {
    //           create: {
    //             type: feature.geometry.type,
    //             coordinates: (feature.geometry as any)?.coordinates ?? [],
    //           },
    //         },
    //       })),
    //     },
    //   },
    // });

    // return featureCollection;
  }

}