"use client";

import React, { useEffect, useState } from "react";
import { MdReportProblem, MdConstruction, MdChevronRight } from "react-icons/md";
import useProjectStore from "../stores/project_store";
import Link from "next/link";

export default function HomeOverlay() {
    const { projects } = useProjectStore();
    const [aduanCount, setAduanCount] = useState(0);

    useEffect(() => {
        // Fetch aduan summary
        fetch("/api/aduan")
            .then(res => res.json())
            .then(json => {
                if (json.unfinished) {
                    const total = json.unfinished.reduce((acc: number, curr: any) => acc + curr.laporan, 0);
                    setAduanCount(total);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <div className="absolute top-20 left-4 z-[1000] flex flex-col gap-3 pointer-events-none">
            {/* Active Reports Widget */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-4 w-56 pointer-events-auto animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                        <MdReportProblem size={20} />
                    </div>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                </div>
                <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aduan Aktif</div>
                    <div className="text-2xl font-black text-slate-900 leading-none">{aduanCount} <span className="text-xs font-bold text-slate-400">Laporan</span></div>
                </div>
                <Link 
                    href="/aduan"
                    className="mt-4 flex items-center justify-between group cursor-pointer"
                >
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight group-hover:underline">Lihat Semua</span>
                    <MdChevronRight size={16} className="text-green-700 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Construction Projects Widget */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-4 w-56 pointer-events-auto animate-in slide-in-from-left-4 duration-700">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <MdConstruction size={20} />
                    </div>
                </div>
                <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyek Berjalan</div>
                    <div className="text-2xl font-black text-slate-900 leading-none">{projects.length} <span className="text-xs font-bold text-slate-400">Titik</span></div>
                </div>
                <Link 
                    href="/statistik"
                    className="mt-4 flex items-center justify-between group cursor-pointer"
                >
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight group-hover:underline">Monitoring</span>
                    <MdChevronRight size={16} className="text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
