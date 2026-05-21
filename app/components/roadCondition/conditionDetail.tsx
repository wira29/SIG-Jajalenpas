/* eslint-disable @next/next/no-img-element */
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { RuasWithSta } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronDownCircle, Eye, Info, Ruler, MapPin, Activity, Layers } from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import ImageDialog from "../dialog/imageDialog";

type ConditionDetailProps = {
  ruas: RuasWithSta;
};

export default function ConditionDetail({ ruas }: ConditionDetailProps) {
  const { set: setSelectedSta } = useSelectedStaStore();
  const selectedSta = useSelectedStaStore((state) => state.selected);

  const parseSingleSta = (staStr: string) => {
    // Remove non-numeric characters except + and handle the parts
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
    
    // Handle range format "0+000 - 0+100" or "0+000 / 0+100"
    if (staStr.includes("-") || staStr.includes("/")) {
        const parts = staStr.split(/[-/]/);
        // Take the end of the range as the value for the segment
        return parseSingleSta(parts[parts.length - 1].trim());
    }

    return parseSingleSta(staStr);
  };

  const calculatedStats = useMemo(() => {
    if (!ruas?.sta || ruas.sta.length === 0) {
      return {
        panjangTotal: 0,
        kondisi: { baik: 0, sedang: 0, rusakRingan: 0, rusakBerat: 0 },
        perkerasan: { aspal: 0, beton: 0, kerikil: 0, tanah: 0 }
      };
    }

    const sortedSta = [...ruas.sta].sort((a: any, b: any) => formatStaValue(a.sta) - formatStaValue(b.sta));
    
    const stats = {
      panjangTotal: formatStaValue(sortedSta[sortedSta.length - 1].sta),
      kondisi: { baik: 0, sedang: 0, rusakRingan: 0, rusakBerat: 0 },
      perkerasan: { aspal: 0, beton: 0, kerikil: 0, tanah: 0 }
    };

    sortedSta.forEach((sta: any, index: number) => {
      const currentVal = formatStaValue(sta.sta);
      const prevVal = index > 0 ? formatStaValue(sortedSta[index - 1].sta) : 0;
      
      // Calculate segment length
      // If first point starts ahead of 0, count it.
      let segmentLength = 0;
      if (index === 0) {
          segmentLength = currentVal;
      } else {
          segmentLength = Math.max(0, currentVal - prevVal);
      }

      // Condition calculation (Supporting codes: B, S, RR, RB)
      const k = (sta.kondisi || "").toUpperCase().trim();
      if (k === "B" || k === "BAIK" || k.includes("MANTAP")) stats.kondisi.baik += segmentLength;
      else if (k === "S" || k === "SEDANG") stats.kondisi.sedang += segmentLength;
      else if (k === "RR" || k.includes("RINGAN")) stats.kondisi.rusakRingan += segmentLength;
      else if (k === "RB" || k.includes("BERAT")) stats.kondisi.rusakBerat += segmentLength;

      // Surface type calculation
      const p = (sta.perkerasan || "").toUpperCase().trim();
      if (p.includes("ASPAL") || p.includes("MAKADAM") || p.includes("LAPEN") || p.includes("HOTMIX")) stats.perkerasan.aspal += segmentLength;
      else if (p.includes("BETON") || p.includes("RIGIT")) stats.perkerasan.beton += segmentLength;
      else if (p.includes("KERIKIL") || p.includes("TELFORD")) stats.perkerasan.kerikil += segmentLength;
      else if (p.includes("TANAH")) stats.perkerasan.tanah += segmentLength;
      else {
          // If empty, assume Aspal as default or just ignore? 
          // Usually better to count as 'Other' but we don't have that category in UI.
          // Let's not add to any if truly unknown.
      }
    });

    return stats;
  }, [ruas]);

  if (!ruas) return null;


  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
          <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                  <Layers size={18} />
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Detail Ruas Jalan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <InfoItem label="Nomor Ruas" value={ruas.nomorRuas} icon={<Activity size={14} />} />
              <InfoItem label="Kecamatan" value={ruas.kecamatan} icon={<MapPin size={14} />} />
              <InfoItem label="Panjang SK" value={`${ruas.panjangSK} Km`} icon={<Ruler size={14} />} />
              <InfoItem label="Lebar" value={`${ruas.lebar} m`} icon={<Ruler size={14} />} />
          </div>
      </div>

      {/* Visual Carousel */}
      {ruas && ruas?.picturesonruas?.length > 0 && (
        <div className="relative">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {ruas?.picturesonruas.map((picture: any, index: number) => (
                  <CarouselItem key={index} className="basis-full">
                    <ImageDialog image={"/api/picture/" + picture.picture.id} desc={picture.description ?? ""} data={ruas} >
                      <DialogTrigger className="w-full">
                        <div className="group relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={"/api/picture/" + picture.picture.id}
                            alt={picture.description ?? ""}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                              <p className="text-white text-xs font-medium truncate">{picture.description || "Dokumentasi Lapangan"}</p>
                          </div>
                        </div>
                      </DialogTrigger>
                    </ImageDialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
        </div>
      )}

      {/* Statistics Sections */}
      {ruas?.sta && ruas.sta.length > 0 && (
        <div className="space-y-8">
          {/* Surface Type Stats */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h6 className="font-bold flex gap-2 items-center text-sm text-slate-900 mb-6 uppercase tracking-wider">
              <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <Activity size={14} />
              </div> 
              Panjang Tipe Permukaan
            </h6>
            <div className="grid grid-cols-2 gap-4">
                <StatBox label="Aspal / Makadam" value={`${calculatedStats.perkerasan.aspal} m`} color="bg-blue-600" />
                <StatBox label="Beton" value={`${calculatedStats.perkerasan.beton} m`} color="bg-slate-600" />
                <StatBox label="Kerikil" value={`${calculatedStats.perkerasan.kerikil} m`} color="bg-orange-600" />
                <StatBox label="Tanah" value={`${calculatedStats.perkerasan.tanah} m`} color="bg-amber-800" />
            </div>
          </div>

          {/* Condition Stats */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h6 className="font-bold flex items-center gap-2 text-sm text-slate-900 mb-6 uppercase tracking-wider">
              <div className="w-6 h-6 bg-green-50 text-green-600 rounded flex items-center justify-center">
                  <Activity size={14} />
              </div> 
              Panjang Tiap Kondisi
            </h6>
            <div className="space-y-4">
                <ConditionProgress label="BAIK" value={calculatedStats.kondisi.baik} total={calculatedStats.panjangTotal} color="bg-green-500" />
                <ConditionProgress label="SEDANG" value={calculatedStats.kondisi.sedang} total={calculatedStats.panjangTotal} color="bg-yellow-400" />
                <ConditionProgress label="RUSAK RINGAN" value={calculatedStats.kondisi.rusakRingan} total={calculatedStats.panjangTotal} color="bg-orange-500" />
                <ConditionProgress label="RUSAK BERAT" value={calculatedStats.kondisi.rusakBerat} total={calculatedStats.panjangTotal} color="bg-red-600" />
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <h6 className="font-bold flex items-center gap-2 text-sm text-slate-900 p-6 bg-slate-50/50 uppercase tracking-wider border-b border-slate-100">
              <div className="w-6 h-6 bg-green-50 text-green-600 rounded flex items-center justify-center">
                  <Layers size={14} />
              </div> 
              Rincian Data Per STA
            </h6>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">STA</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Permukaan</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Kondisi</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...ruas.sta].sort((a: any, b: any) => formatStaValue(a.sta) - formatStaValue(b.sta)).map((sta: any) => (
                        <TableRow key={sta.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-mono text-xs font-bold text-slate-700">{sta.sta}</TableCell>
                            <TableCell className="text-xs text-slate-500 font-medium">{sta.perkerasan}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    (sta.kondisi || "").toUpperCase().trim() === 'B' || (sta.kondisi || "").toUpperCase().trim() === 'BAIK' ? 'bg-green-100 text-green-700' :
                                    (sta.kondisi || "").toUpperCase().trim() === 'S' || (sta.kondisi || "").toUpperCase().trim() === 'SEDANG' ? 'bg-yellow-100 text-yellow-700' :
                                    (sta.kondisi || "").toUpperCase().trim() === 'RR' || (sta.kondisi || "").toUpperCase().includes('RINGAN') ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {sta.kondisi}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                            <button 
                                onClick={() => setSelectedSta(sta)}
                                className="p-2 text-slate-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                            >
                                <Eye size={16} />
                            </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-lg text-slate-400 shadow-sm border border-slate-200">
                {icon}
            </div>
            <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
                <div className="text-sm font-bold text-slate-700">{value || "-"}</div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</div>
            <div className="flex items-baseline gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
                <div className="text-sm font-black text-slate-800">{value}</div>
            </div>
        </div>
    );
}

function ConditionProgress({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-500 tracking-tight">{label}</span>
                <span className="text-[10px] font-bold text-slate-900">{value}m <span className="text-slate-300 ml-1">({percentage.toFixed(1)}%)</span></span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
