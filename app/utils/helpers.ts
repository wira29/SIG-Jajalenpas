export function swapLngLat(lngLat: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
    if (Array.isArray(lngLat)) {
      if (typeof lngLat[0] === 'number') {
        return [lngLat[1], lngLat[0]] as number[];
      } else {
        return lngLat.map((lngLat) => swapLngLat(lngLat as number[])) as number[][];
      }
    } else {
      return lngLat;
    }
  }

  export function getCurrentYear() {
    return new Date().getFullYear();
  }

  export function colorFromKondisi(kondisi: string): string | undefined {
    // kondisi: Baik, Sedang, Rusak Ringan, Rusak Berat
  
    switch (kondisi) {
      case "Baik":
        return "#00ff00";
      case "Sedang":
        return "#ffff00";
      case "Rusak Ringan":
        return "#ff9900";
      case "Rusak Berat":
        return "#ff0000";
    }
  }