"use client";

import { useEffect, useMemo, useState } from "react";
import NavbarWidget from "../components/navbar";
import useJalanStore from "../stores/jalan_store";
import useYearStore from "../stores/year_store";
import BarPerkerasanJalan from "./barPerkerasanJalan";
import PieKondisiJalan from "./pieKondisiJalan";

export default function Statistik() {
  //   const { layers, isLoading, loadLayers } = useLayersStore((state) => ({
  //     layers: state.layers,
  //     isLoading: state.isLoading,
  //     loadLayers: state.loadLayers,
  //   }));

  const { data: roads,
    road: road,
    loading: roadLoading,
    error : roadError,
    fetchData : loadRoads,
    loadRoad: loadRoad, } =
    useJalanStore();

  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [kecamatan, setKecamatan] = useState<string | null>(null);

  const selectedRoad = useMemo(() => {
    if (!selectedRoadId) return null;

    const r = roads.find((road) => Number(road.id) === parseInt(selectedRoadId));
    
    if (kecamatan) {
      const filteredRuas = r?.ruas.filter((ruas: any) => ruas.kecamatan == kecamatan);
      return {
        ...r,
        ruas: filteredRuas
      };
    }
    console.log(r)
    
    return r;
  }, [roads, selectedRoadId, kecamatan]);

  const jumlahSta = useMemo(() => {
    if (!selectedRoad) return 0;

    const r: any = selectedRoad;

    return r.ruas.reduce((acc: any, ruas: any) => {
      return acc + ruas.sta.length;
    }, 0);
  }, [selectedRoad]);

  const { selectedYear, years, getYears, setSelectedYear } = useYearStore();

  useEffect(() => {
    setSelectedRoadId(null)
    loadRoads(selectedYear);
  }, [loadRoads, selectedYear]);

  useEffect(() => {
    getYears()
  }, [getYears])

  useEffect(() => {
    if (selectedRoadId) {
      loadRoad(parseInt(selectedRoadId));
    }
  }, [selectedRoadId, loadRoad, selectedYear]);

  const jumlahPanjang = useMemo(() => {
    if (!selectedRoad) return 0;

    return selectedRoad.ruas!.reduce((acc: any, ruas: any) => {
      const panjang = parseFloat(ruas.panjangSK ?? 0);

      return acc + panjang;
    }, 0);

  }, [selectedRoad]);

  const listKecamatan : Set<string> = useMemo(() => {
    return new Set(road?.ruas.map((ruas: any) => ruas.kecamatan));
  }, [road]);


  return (
    <div className="flex flex-col items-stretch h-screen ">
      <NavbarWidget />

      <main
        className="container mx-auto px-4 py-8 overflow-y-auto w-full"
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <h1 className="text-xl font-semibold text-center">
          Data Jalan Kabupaten Pasuruan
        </h1>

        <hr />

        {/* select layer */}
        <div className="flex gap-4">
        <select
          className="p-2 my-4 border rounded-md flex-1"
          value={selectedRoadId ?? ""}
          onChange={(e) => setSelectedRoadId(e.target.value)}
        >
          <option value="">Pilih Jalan</option>
          {roads.map((road) => (
            <option key={road.id} value={Number(road.id)}>
              {road.nama}
            </option>
          ))}
        </select>
        <select
          className="p-2 my-4 border rounded-md flex-1"
          value={kecamatan ?? ""}
          onChange={(e) => setKecamatan(e.target.value)}
        >
          <option value="">Semua Kecamatan</option>
          {Array.from(listKecamatan).map((kec) => (
            <option key={kec} value={kec}>
              {kec}
            </option>
          ))}
        </select>
        <select
          className="p-2 my-4 border rounded-md flex-1"
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((year) => (
            <option key={year.tahun} value={year.tahun} selected={year.tahun == selectedYear}>
              {year.tahun}
            </option>
          ))}
        </select>
        </div>

        {!selectedRoad ? (
          // <div className="flex items-center justify-center h-full">
          //   <Circles
          //     height="35"
          //     width="35"
          //     color="#4fa94d"
          //     ariaLabel="circles-loading"
          //     wrapperStyle={{}}
          //     wrapperClass=""
          //     visible={true}
          //   />
          // </div>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Pilih Jalan</p>
          </div>
        ) : selectedRoad ? (
          <div className="flex flex-col justify-stretch">
            <table className="border-collapse border border-slate-200 mb-4">
              <tbody>
                <tr>
                  <th className="border border-slate-300 p-2 font-bold text-left w-1/4">
                    Jumlah Ruas
                  </th>
                  <td className="border border-slate-300 p-2">
                    {selectedRoad?.ruas!.length} Ruas ({jumlahSta} STA)
                  </td>
                </tr>
                <tr>
                  <th className="border border-slate-300 p-2 font-bold text-left w-1/4">
                    Panjang Total
                  </th>
                  <td className="border border-slate-300 p-2">
                    {jumlahPanjang?.toFixed(2)} Km
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex w-full overflow-x-auto">
              <div className="w-1/2 flex-grow shrink-0 pr-4">
                <BarPerkerasanJalan road={selectedRoad} />
              </div>
              <div className="w-1/2 flex-grow shrink-0 ml-1">
                <PieKondisiJalan road={selectedRoad} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Pilih Jalan</p>
          </div>
        )}
      </main>
    </div>
  );
}
