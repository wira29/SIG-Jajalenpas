"use client";

import { useEffect, useMemo, useState } from "react";
import NavbarWidget from "../components/navbar";
import useJalanStore from "../stores/jalan_store";
import useYearStore from "../stores/year_store";
import { Pagination } from "flowbite-react";
import { MdDownload, MdFilterAlt, MdTableChart } from "react-icons/md";
import AuthenticatedOnly from "../components/middleware/authenticated_only";

// Helper function from ConditionDetail
const parseSingleSta = (staStr: string) => {
  const clean = staStr.replace(/[^+0-9]/g, "");
  if (clean.includes("+")) {
      const [km, m] = clean.split("+");
      return (parseInt(km || "0", 10) * 1000) + parseInt(m || "0", 10);
  }
  return parseInt(clean, 10) || 0;
}

const formatStaValue = (sta: any) => {
  if (sta === null || sta === undefined) return 0;
  const staStr = String(sta);
  if (staStr.includes("-") || staStr.includes("/")) {
      const parts = staStr.split(/[-/]/);
      return parseSingleSta(parts[parts.length - 1].trim());
  }
  return parseSingleSta(staStr);
};

export default function DataJalanPage() {
  const { data: roads, fetchData: loadRoads } = useJalanStore();
  const { selectedYear, years, getYears, setSelectedYear } = useYearStore();

  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [kecamatan, setKecamatan] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    getYears();
  }, [getYears]);

  useEffect(() => {
    loadRoads(selectedYear);
    setSelectedRoadId(null);
    setKecamatan(null);
    setCurrentPage(1);
  }, [loadRoads, selectedYear]);

  const listKecamatan: string[] = useMemo(() => {
    let kecs: string[] = [];
    roads.forEach((road: any) => {
        if (!selectedRoadId || String(road.id) === selectedRoadId) {
            road.ruas.forEach((r: any) => {
                if (r.kecamatan && r.kecamatan !== "-") {
                    kecs.push(r.kecamatan);
                }
            });
        }
    });
    return Array.from(new Set(kecs)).sort();
  }, [roads, selectedRoadId]);

  const processedData = useMemo(() => {
    let result: any[] = [];

    roads.forEach((road: any) => {
      if (selectedRoadId && String(road.id) !== selectedRoadId) return;

      road.ruas.forEach((ruas: any) => {
        if (kecamatan && ruas.kecamatan !== kecamatan) return;

        // Calculate stats
        const stats = {
          baik: 0, sedang: 0, rusakRingan: 0, rusakBerat: 0,
          aspal: 0, beton: 0, kerikil: 0, tanah: 0,
          panjangTotal: 0
        };

        if (ruas.sta && ruas.sta.length > 0) {
          const sortedSta = [...ruas.sta].sort((a: any, b: any) => formatStaValue(a.sta) - formatStaValue(b.sta));
          stats.panjangTotal = formatStaValue(sortedSta[sortedSta.length - 1].sta);

          sortedSta.forEach((sta: any, index: number) => {
            const currentVal = formatStaValue(sta.sta);
            const prevVal = index > 0 ? formatStaValue(sortedSta[index - 1].sta) : 0;
            
            let segmentLength = 0;
            if (index === 0) {
                segmentLength = currentVal;
            } else {
                segmentLength = Math.max(0, currentVal - prevVal);
            }

            const k = (sta.kondisi || "").toUpperCase().trim();
            if (k === "B" || k === "BAIK" || k.includes("MANTAP")) stats.baik += segmentLength;
            else if (k === "S" || k === "SEDANG") stats.sedang += segmentLength;
            else if (k === "RR" || k.includes("RINGAN")) stats.rusakRingan += segmentLength;
            else if (k === "RB" || k.includes("BERAT")) stats.rusakBerat += segmentLength;

            const p = (sta.perkerasan || "").toUpperCase().trim();
            if (p.includes("ASPAL") || p.includes("MAKADAM") || p.includes("LAPEN") || p.includes("HOTMIX")) stats.aspal += segmentLength;
            else if (p.includes("BETON") || p.includes("RIGIT")) stats.beton += segmentLength;
            else if (p.includes("KERIKIL") || p.includes("TELFORD")) stats.kerikil += segmentLength;
            else if (p.includes("TANAH")) stats.tanah += segmentLength;
          });
        }

        result.push({
          id: ruas.id,
          noRuas: ruas.nomorRuas,
          namaRuas: ruas.namaRuas,
          jenisRuas: road.nama,
          kecamatan: ruas.kecamatan,
          panjangSK: parseFloat(ruas.panjangSK ?? 0),
          lebar: parseFloat(ruas.lebar ?? 0),
          stats
        });
      });
    });

    // sort by nomor ruas
    return result.sort((a, b) => Number(a.noRuas) - Number(b.noRuas));
  }, [roads, selectedRoadId, kecamatan]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;

  const exportToCSV = () => {
    const headers = [
      "No Ruas", "Nama Ruas", "Jenis Ruas", "Kecamatan", "Panjang SK (Km)", "Lebar (m)",
      "Hotmix/Aspal (m)", "Beton (m)", "Telford/Kerikil (m)", "Tanah (m)",
      "Baik (m)", "Sedang (m)", "Rusak Ringan (m)", "Rusak Berat (m)"
    ];

    const rows = processedData.map(row => [
      row.noRuas,
      `"${row.namaRuas}"`,
      `"${row.jenisRuas}"`,
      `"${row.kecamatan}"`,
      row.panjangSK,
      row.lebar,
      row.stats.aspal,
      row.stats.beton,
      row.stats.kerikil,
      row.stats.tanah,
      row.stats.baik,
      row.stats.sedang,
      row.stats.rusakRingan,
      row.stats.rusakBerat
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Jalan_Pasuruan_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toKm = (meter: number) => (meter / 1000).toFixed(2);
  const toPercent = (val: number, total: number) => total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      <NavbarWidget />

      <main className="flex-grow container mx-auto px-4 py-8 pb-16 max-w-full 2xl:max-w-screen-2xl">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                <MdTableChart size={32} />
              </div>
              Inventaris Data Jalan
            </h1>
            <p className="text-slate-500 mt-2">
              Daftar komprehensif seluruh ruas jalan beserta detail dimensi, perkerasan, dan kondisi kemantapan.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <button 
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <MdDownload size={20} className="text-green-600" />
                Ekspor CSV
              </button>

             <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-100 hidden md:flex">
                  <MdFilterAlt size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Filters</span>
                </div>
                
                <select
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-green-500/20 py-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y.tahun} value={y.tahun}>{y.tahun}</option>
                    ))}
                  </select>

                  <select
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-green-500/20 py-2 max-w-[200px]"
                    value={selectedRoadId ?? ""}
                    onChange={(e) => {
                      setSelectedRoadId(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Semua Kategori</option>
                    {roads.map((r) => (
                      <option key={String(r.id)} value={String(r.id)}>{r.nama}</option>
                    ))}
                  </select>

                  <select
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-green-500/20 py-2 max-w-[180px]"
                    value={kecamatan ?? ""}
                    onChange={(e) => {
                      setKecamatan(e.target.value || null);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Semua Kecamatan</option>
                    {listKecamatan.map((kec) => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
              </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-slate-800 text-white">
                            <th rowSpan={2} className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center border-r border-slate-700">No</th>
                            <th colSpan={4} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-center border-r border-slate-700">Identitas Ruas</th>
                            <th colSpan={2} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-center border-r border-slate-700">Dimensi</th>
                            <th colSpan={4} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-center border-r border-slate-700">Jenis Perkerasan (Km)</th>
                            <th colSpan={4} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-center">Kondisi Jalan (Km & %)</th>
                        </tr>
                        <tr className="bg-slate-700 text-slate-300">
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 whitespace-nowrap">No Ruas</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600">Nama Ruas</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 whitespace-nowrap">Jenis</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 whitespace-nowrap">Kecamatan</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 whitespace-nowrap">Panjang (Km)</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 whitespace-nowrap">Lebar (m)</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Hotmix/Aspal</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Beton</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Telford/Kerikil</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Tanah</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Baik</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Sedang</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-r border-slate-600 border-t border-slate-600 text-center">Rusak Ringan</th>
                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-t border-slate-600 text-center">Rusak Berat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => {
                                const tLen = row.stats.panjangTotal;
                                return (
                                <tr key={row.id} className="hover:bg-green-50/50 transition-colors">
                                    <td className="px-4 py-3 text-xs font-mono text-slate-500 text-center border-r border-slate-100">
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-700 border-r border-slate-100 whitespace-nowrap">{row.noRuas}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900 border-r border-slate-100 uppercase min-w-[200px] max-w-[300px] truncate" title={row.namaRuas}>{row.namaRuas}</td>
                                    <td className="px-4 py-3 text-[10px] font-bold text-green-700 bg-green-50/30 border-r border-slate-100 whitespace-nowrap uppercase tracking-wider">{row.jenisRuas}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100 whitespace-nowrap">{row.kecamatan}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{row.panjangSK.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{row.lebar.toFixed(1)}</td>
                                    
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{toKm(row.stats.aspal)}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{toKm(row.stats.beton)}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{toKm(row.stats.kerikil)}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-700 border-r border-slate-100 text-right">{toKm(row.stats.tanah)}</td>
                                    
                                    <td className="px-4 py-3 border-r border-slate-100 text-right">
                                        <div className="text-xs font-mono font-bold text-green-700">{toKm(row.stats.baik)}</div>
                                        <div className="text-[9px] text-slate-400">{toPercent(row.stats.baik, tLen)}%</div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-right">
                                        <div className="text-xs font-mono font-bold text-yellow-600">{toKm(row.stats.sedang)}</div>
                                        <div className="text-[9px] text-slate-400">{toPercent(row.stats.sedang, tLen)}%</div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-right">
                                        <div className="text-xs font-mono font-bold text-orange-600">{toKm(row.stats.rusakRingan)}</div>
                                        <div className="text-[9px] text-slate-400">{toPercent(row.stats.rusakRingan, tLen)}%</div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="text-xs font-mono font-bold text-red-600">{toKm(row.stats.rusakBerat)}</div>
                                        <div className="text-[9px] text-slate-400">{toPercent(row.stats.rusakBerat, tLen)}%</div>
                                    </td>
                                </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={15} className="px-6 py-20 text-center text-slate-500">
                                    Tidak ada data ruas jalan yang sesuai dengan filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Design */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-medium italic">
                    Menampilkan <span className="text-slate-900 font-bold">{paginatedData.length}</span> dari <span className="text-slate-900 font-bold">{processedData.length}</span> total ruas
                </span>
                <div className="bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        showIcons
                    />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}