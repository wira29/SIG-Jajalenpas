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