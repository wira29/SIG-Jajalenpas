"use client";

import React, { useEffect, useState } from "react";
import NavbarWidget from "@/app/components/navbar";
import moment from "moment";
import { Puff } from "react-loader-spinner";
import { 
  MdArrowBack, 
  MdDownload, 
  MdDescription, 
  MdPerson, 
  MdAccessTime,
  MdOpenInNew,
  MdCalendarToday,
  MdShield
} from "react-icons/md";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default function LaporanDetail({ params }: Props) {
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/reports/" + params.slug)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <NavbarWidget />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <Puff height="60" width="60" color="#15803d" visible={true} />
          <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">Memuat Dokumen...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <NavbarWidget />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <MdDescription size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Dokumen Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            Maaf, laporan yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <Link 
            href="/laporan"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <MdArrowBack /> Kembali ke Daftar Laporan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <NavbarWidget />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb & Navigation */}
          <div className="mb-6">
            <Link 
              href="/laporan"
              className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 group transition-colors"
            >
              <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Pusat Laporan
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content: Document Viewer */}
            <div className="lg:flex-1 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Visual Header for the document */}
                <div className="bg-green-700 p-8 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 -mr-8 -mt-8 transform rotate-12">
                    <MdDescription size={200} />
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                      Official Publication
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                      {report.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-green-50 text-sm">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-green-300" />
                        <span>Diterbitkan oleh: <span className="font-bold">{report?.user?.name || report?.user?.username || "Dinas PU"}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="text-green-300" />
                        <span>{moment(report.createdAt).format("DD MMMM YYYY")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Viewer Container */}
                <div className="p-2 sm:p-4 bg-slate-200">
                  <div className="bg-white rounded-2xl shadow-inner overflow-hidden border border-slate-300">
                    <iframe
                      src={`${report.file}#toolbar=0`}
                      className="w-full h-[600px] md:h-[800px]"
                      title={report.title}
                    >
                      <p className="p-8 text-center text-slate-500">
                        Browser Anda tidak mendukung pratinjau PDF. Silakan unduh dokumen menggunakan tombol di samping.
                      </p>
                    </iframe>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MdDescription className="text-green-700" />
                    Deskripsi Laporan
                  </h3>
                  <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {report.description || "Tidak ada deskripsi detail untuk laporan ini."}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Sidebar Info */}
            <div className="lg:w-80 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tindakan Cepat</h4>
                <a
                  href={report.file}
                  download
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-green-800 transition-all active:scale-95"
                >
                  <MdDownload size={20} />
                  Unduh Dokumen
                </a>
                <a
                  href={report.file}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  <MdOpenInNew size={20} />
                  Buka di Tab Baru
                </a>
              </div>

              {/* Document Metadata */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1 text-center">Informasi Berkas</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                      <MdAccessTime size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Waktu Publikasi</div>
                      <div className="text-sm font-bold text-slate-800">{moment(report.createdAt).format("HH:mm [WIB]")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                      <MdDescription size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tipe Dokumen</div>
                      <div className="text-sm font-bold text-slate-800 uppercase">Acrobat PDF</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                      <MdShield size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status Verifikasi</div>
                      <div className="text-sm font-bold text-green-700">Terpublikasi Resmi</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Info Card */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[2rem] text-white shadow-xl shadow-green-900/10">
                <h4 className="font-bold mb-2">Butuh Bantuan?</h4>
                <p className="text-green-100 text-xs leading-relaxed mb-4">
                  Hubungi tim teknis kami jika Anda mengalami kendala saat mengakses atau mengunduh dokumen laporan ini.
                </p>
                <div className="text-[10px] font-bold bg-white/20 py-1 px-3 rounded-full inline-block">
                  SK-ID: {params.slug.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
