"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  MdAnalytics, 
  MdMap, 
  MdLocationCity, 
  MdCalendarToday, 
  MdFilterAlt,
  MdTrendingUp,
  MdTimeline,
  MdPieChart,
  MdPrint
} from "react-icons/md";
import NavbarWidget from "../components/navbar";
import useJalanStore from "../stores/jalan_store";
import useYearStore from "../stores/year_store";
import BarPerkerasanJalan from "./barPerkerasanJalan";
import PieKondisiJalan from "./pieKondisiJalan";

export default function Statistik() {
  const { 
    data: roads,
    road: road,
    fetchData: loadRoads,
    loadRoad: loadRoad,
  } = useJalanStore();

  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [kecamatan, setKecamatan] = useState<string | null>(null);
  const { selectedYear, years, getYears, setSelectedYear } = useYearStore();

  const selectedRoad = useMemo(() => {
    if (!selectedRoadId) return null;
    const r = roads.find((road) => String(road.id) === selectedRoadId);
    if (kecamatan && r) {
      const filteredRuas = r.ruas.filter((ruas: any) => ruas.kecamatan === kecamatan);
      return { ...r, ruas: filteredRuas };
    }
    return r;
  }, [roads, selectedRoadId, kecamatan]);

  const stats = useMemo(() => {
    if (!selectedRoad) return { sta: 0, panjang: 0 };
    const sta = selectedRoad.ruas.reduce((acc: number, ruas: any) => acc + ruas.sta.length, 0);
    const panjang = selectedRoad.ruas.reduce((acc: number, ruas: any) => acc + parseFloat(ruas.panjangSK ?? 0), 0);
    return { sta, panjang };
  }, [selectedRoad]);

  const listKecamatan: string[] = useMemo(() => {
    if (!road?.ruas) return [];
    return Array.from(new Set(road.ruas.map((ruas: any) => ruas.kecamatan))).sort();
  }, [road]);

  useEffect(() => {
    getYears();
  }, [getYears]);

  useEffect(() => {
    loadRoads(selectedYear);
    setSelectedRoadId(null);
    setKecamatan(null);
  }, [loadRoads, selectedYear]);

  useEffect(() => {
    if (selectedRoadId) {
      loadRoad(parseInt(selectedRoadId));
    }
  }, [selectedRoadId, loadRoad]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      <NavbarWidget />

      <main className="flex-grow container mx-auto px-4 py-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                <MdAnalytics size={32} />
              </div>
              Statistik Jaringan Jalan
            </h1>
            <p className="text-slate-500 mt-2">
              Analisis mendalam kondisi perkerasan dan status kemantapan jalan Kabupaten Pasuruan.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 print:hidden"
              >
                <MdPrint size={20} className="text-green-600" />
                Cetak Laporan
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
                    onChange={(e) => setSelectedRoadId(e.target.value)}
                  >
                    <option value="">Pilih Kategori Jalan</option>
                    {roads.map((r) => (
                      <option key={String(r.id)} value={String(r.id)}>{r.nama}</option>
                    ))}
                  </select>

                  <select
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-green-500/20 py-2 max-w-[180px]"
                    value={kecamatan ?? ""}
                    onChange={(e) => setKecamatan(e.target.value || null)}
                    disabled={!selectedRoadId}
                  >
                    <option value="">Semua Kecamatan</option>
                    {listKecamatan.map((kec) => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
              </div>
          </div>
        </div>

        {!selectedRoad ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <MdMap size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {selectedRoadId ? "Memuat Data..." : "Mulai Analisis"}
            </h3>
            <p className="text-slate-500 max-w-xs text-center mt-2 text-sm leading-relaxed">
              {selectedRoadId ? "Sedang menyiapkan visualisasi data untuk kategori jalan yang dipilih." : "Pilih kategori jalan dan tahun anggaran untuk memuat visualisasi data statistik."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500 relative">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
                <div className="text-slate-400 flex items-center gap-2 mb-2">
                  <MdTrendingUp size={18} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Jarak</span>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {stats.panjang.toFixed(2)} <span className="text-sm font-medium text-slate-400">Km</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 italic italic">
                  Data akumulasi berdasarkan SK Bupati
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
                <div className="text-slate-400 flex items-center gap-2 mb-2">
                  <MdTimeline size={18} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cakupan Segmen</span>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {selectedRoad.ruas.length} <span className="text-sm font-medium text-slate-400">Ruas</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 italic">
                  Terbagi dalam {stats.sta} titik STA
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
                <div className="text-slate-400 flex items-center gap-2 mb-2">
                  <MdLocationCity size={18} className="text-orange-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Wilayah</span>
                </div>
                <div className="text-3xl font-black text-slate-900 truncate">
                  {kecamatan || "Kabupaten"}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 italic truncate">
                  {kecamatan ? "Data fokus pada satu kecamatan" : "Meliputi seluruh wilayah Pasuruan"}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
                <div className="text-slate-400 flex items-center gap-2 mb-2">
                  <MdCalendarToday size={18} className="text-purple-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tahun Anggaran</span>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {selectedYear}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 italic">
                  Status data tahun berjalan
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <MdTrendingUp size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">Jenis Perkerasan</h3>
                      <p className="text-[10px] md:text-xs text-slate-400">Distribusi material permukaan jalan</p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <BarPerkerasanJalan road={selectedRoad} />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                      <MdPieChart size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">Kondisi Kemantapan</h3>
                      <p className="text-[10px] md:text-xs text-slate-400">Persentase tingkat kerusakan jalan</p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <PieKondisiJalan road={selectedRoad} />
                </div>
              </div>
            </div>

            {/* Footer Summary Section - Now in standard flow, no absolute positioning */}
            <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group mt-4">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <MdAnalytics size={160} />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h4 className="text-lg font-bold mb-1 text-slate-800 uppercase tracking-wide">Ringkasan Analisis</h4>
                <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
                  Data ini menunjukkan kondisi terkini untuk <span className="font-bold text-slate-700">{selectedRoad.nama}</span> di {kecamatan ? `Kecamatan ${kecamatan}` : 'seluruh wilayah'}. Digunakan sebagai referensi pengambilan keputusan teknis.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-400 shrink-0">
                <MdCalendarToday size={14} />
                Status: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
