"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { MdSearch, MdClose, MdLocationOn } from "react-icons/md";
import useJalanStore from "../stores/jalan_store";
import useSelectedRuasStore from "../stores/selected_ruas_store";
import { Input } from "@/components/ui/input";

export default function SearchRuas() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { roads } = useJalanStore();
  const setSelectedRuas = useSelectedRuasStore((state) => state.set);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter logic: Search by name or road number (nomorRuas)
  const results = useMemo(() => {
    if (query.length < 2) return [];

    const searchLower = query.toLowerCase();
    const flatRuas: any[] = [];

    roads.forEach((jalan) => {
      if (Array.isArray(jalan.road)) {
        jalan.road.forEach((ruas: any) => {
          const nameMatch = ruas.namaRuas?.toLowerCase().includes(searchLower);
          const noMatch = String(ruas.nomorRuas).includes(searchLower);
          
          if (nameMatch || noMatch) {
            flatRuas.push({
              ...ruas,
              jalanName: jalan.name
            });
          }
        });
      }
    });

    return flatRuas.slice(0, 10); // Limit to 10 results
  }, [query, roads]);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ruas: any) => {
    setSelectedRuas(ruas);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="absolute bottom-6 left-4 z-[1000] w-64 sm:w-72 group" ref={searchRef}>
      <div className="relative transition-all duration-300 transform">
        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-600/50 focus-within:border-green-700 transition-all">
          <div className="pl-3 text-slate-400 group-focus-within:text-green-700 transition-colors">
            <MdSearch size={20} />
          </div>
          <input
            type="text"
            className="w-full p-2.5 outline-none text-slate-800 text-xs font-medium bg-transparent"
            placeholder="Cari ruas jalan..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {query && (
            <button 
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="pr-3 text-slate-300 hover:text-red-500 transition-colors"
            >
              <MdClose size={16} />
            </button>
          )}
        </div>

        {/* Results Dropdown - Now pops UP because it's at the bottom */}
        {isOpen && (results.length > 0 || (query.length >= 2 && results.length === 0)) && (
          <div className="absolute bottom-full mb-3 w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hasil Pencarian</span>
            </div>
            
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                results.map((ruas, idx) => (
                  <button
                    key={`${ruas.nomorRuas}-${idx}`}
                    className="w-full text-left px-3 py-2.5 hover:bg-green-50 border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors group/item"
                    onClick={() => handleSelect(ruas)}
                  >
                    <div className="mt-0.5 text-slate-300 group-hover/item:text-green-600 transition-colors">
                      <MdLocationOn size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs truncate uppercase group-hover/item:text-green-900">
                        {ruas.namaRuas}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="bg-slate-100 px-1 rounded text-slate-600 font-mono">#{ruas.nomorRuas}</span>
                        <span className="truncate">{ruas.kecamatan}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <div className="text-slate-300 mb-1 flex justify-center">
                    <MdSearch size={24} />
                  </div>
                  <div className="text-xs text-slate-400">Ruas tidak ditemukan</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
