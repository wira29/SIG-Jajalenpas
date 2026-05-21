
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
  tahun: number,
  name: string,
  color: string,
  weight: number,
  dash: number|null,
  dashLength: number|null,
  is_kewenangan: boolean,
  desc_kewenangan: string|null,
};

export class RuasImporter {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async importGeoJSON(geoJSON: GeoJSON.FeatureCollection, detail: ImportRuasDetail) {
    "use server"

    if (!geoJSON || geoJSON.type !== "FeatureCollection" || !Array.isArray(geoJSON.features)) {
      throw new Error("Invalid GeoJSON: FeatureCollection expected.");
    }

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

      // Support various property names for road number
      const noRuas = tryParseInt(properties.No || properties.No_Ruas || properties.nomorRuas, 0);
      if (noRuas === 0) return acc;

      const geometry = feature.geometry as any;
      if (!geometry || !geometry.coordinates) return acc;

      const coords = geometry.coordinates;
      let xAwal = properties.X_Awal || properties.xAwal || 0;
      let yAwal = properties.Y_awal || properties.yAwal || 0;
      let xAkhir = properties.X_Akhir || properties.xAkhir || 0;
      let yAkhir = properties.Y_Akhir || properties.yAkhir || 0;

      // Fallback: extract from geometry if properties are missing
      if (xAwal === 0 && yAwal === 0 && xAkhir === 0 && yAkhir === 0) {
        const firstSegment = geometry.type === 'MultiLineString' ? coords[0] : coords;
        const lastSegment = geometry.type === 'MultiLineString' ? coords[coords.length - 1] : coords;

        if (firstSegment && firstSegment.length > 0) {
          const startPoint = firstSegment[0];
          xAwal = startPoint[0];
          yAwal = startPoint[1];
        }
        if (lastSegment && lastSegment.length > 0) {
          const endPoint = lastSegment[lastSegment.length - 1];
          xAkhir = endPoint[0];
          yAkhir = endPoint[1];
        }
      }

      const sta_val = properties.STA || properties.Sta || `${properties.Sta_Awal || "0"} - ${properties.Sta_Akhir || "0"}`;

      const sta = {
        nomorRuas: noRuas,
        sta: String(sta_val),
        xAwal: Number(xAwal),
        yAwal: Number(yAwal),
        xAkhir: Number(xAkhir),
        yAkhir: Number(yAkhir),
        kondisi: properties.Kondisi || properties.kondisi || "Baik",
        perkerasan: properties.Perkerasan || properties.perkerasan || properties.Tipe_Perke || "",
        coordinates: coords,
      };

      const existingRuas = acc.find((r) => r.nomorRuas === noRuas);

      if (existingRuas) {
        existingRuas.sta.push(sta);
        return acc;
      }

      // Initial lat/long from first STA
      let latitude = 0;
      let longitude = 0;
      const firstSegment = geometry.type === 'MultiLineString' ? coords[0] : coords;
      if (firstSegment && firstSegment[0]) {
        longitude = firstSegment[0][0];
        latitude = firstSegment[0][1];
      }

      return [
        ...acc,
        {
          nomorRuas: noRuas,
          namaRuas: properties.Nama_Ruas || properties.namaRuas || properties.Judul || "Tanpa Nama",
          kecamatan: properties.Kecamatan || properties.kecamatan || "-",
          panjangSK: parseFloat(properties.Panjang_Ru || properties.Pjng_SK || 0),
          lebar: parseFloat(properties.Lebar_Ruas || properties.Lebar_SK || 0),
          keterangan: properties.Keterangan || properties.keterangan || properties.Nama_Ruas || "",
          latitude,
          longitude,
          sta: [sta],
        },
      ];
    }, []);

    // update ruas latitude and longitude to be the middle of the stas
    ruas.forEach((ruas) => {
      const middleSTA = ruas.sta[Math.floor(ruas.sta.length / 2)];
      if (middleSTA && middleSTA.coordinates) {
        const coords = middleSTA.coordinates;
        const segment = Array.isArray(coords[0][0]) ? coords[0] : coords; // Handle MultiLineString vs LineString
        const point = segment[Math.floor(segment.length / 2)];
        if (point) {
          ruas.longitude = point[0];
          ruas.latitude = point[1];
        }
      }
    });

    const jalan = await this.client.jalan.create({
      data: {
        tahun: detail.tahun,
        nama: detail.name,
        color: detail.color,
        weight: detail.weight,
        dash: detail.dash,
        dashLength: detail.dashLength,
        is_kewenangan: detail.is_kewenangan,
        desc_kewenangan: detail.desc_kewenangan,
        ruas: {
          create: ruas.map((r) => ({
            nomorRuas: BigInt(r.nomorRuas),
            namaRuas: r.namaRuas,
            kecamatan: r.kecamatan,
            panjangSK: r.panjangSK,
            lebar: r.lebar,
            keterangan: r.keterangan,
            latitude: r.latitude,
            longitude: r.longitude,
            sta: {
              create: r.sta.map((s) => ({
                sta: s.sta,
                xAwal: s.xAwal,
                yAwal: s.yAwal,
                xAkhir: s.xAkhir,
                yAkhir: s.yAkhir,
                kondisi: s.kondisi,
                perkerasan: s.perkerasan,
                coordinates: s.coordinates as any,
              })),
            },
          })),
        },
      },
    });

    return jalan;
  }
}
