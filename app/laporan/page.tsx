"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { 
  MdSearch, 
  MdFileUpload, 
  MdDescription, 
  MdPerson, 
  MdAccessTime, 
  MdDelete, 
  MdEdit, 
  MdVisibility,
  MdFilterList
} from "react-icons/md";
import AuthenticatedOnly from "../components/middleware/authenticated_only";
import NavbarWidget from "../components/navbar";

export default function LaporanList() {
  const [reports, setReports] = useState<any[]>([]);
  const currentReport = useRef<any>(null);
  const { data, status: sessionStatus } = useSession();

  const totalPages = useRef(0);
  const totalItems = useRef(0);
  const allItems = useRef([]);
  const page = useRef(1);
  const pageSize = 6;
  const search = useRef("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(report: any) {
    currentReport.current = report;
    setIsOpen(true);
  }
    
  const paginate = (items: any) => {
    const startIndex = (page.current - 1) * pageSize;
    setReports(items.slice(startIndex, startIndex + pageSize));
    totalPages.current = Math.ceil(items.length / pageSize);
    totalItems.current = items.length;
  }

  const handleInputChange = (e: any) => {
    page.current = 1;
    let items = allItems.current;
    search.current = e.target.value;
    
    if (e.target.value === "") {
        paginate(items);
        return;
    }

    const filtered = items.filter((item: any) => 
      item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      item.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    paginate(filtered);
  }

  const handlePageChange = (newPage: number) => {
    page.current = newPage;
    let items = allItems.current;

    if (search.current !== "") {
        items = items.filter((item: any) => 
          item.title.toLowerCase().includes(search.current.toLowerCase()) ||
          item.description.toLowerCase().includes(search.current.toLowerCase())
        );
    }

    paginate(items);
    // scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function confirmDelete() {
    await fetch(`/api/reports/${currentReport.current.slug}`, {
      method: "DELETE",
    }).then(() => {
      const updatedAll = allItems.current.filter((r: any) => r.slug !== currentReport.current.slug);
      allItems.current = updatedAll;
      paginate(updatedAll);
    });

    closeModal();
  }

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        allItems.current = data;
        paginate(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <NavbarWidget />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Pusat Laporan & Publikasi
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Akses dokumen teknis, laporan kondisi jalan bulanan, dan publikasi resmi dari Dinas Pekerjaan Umum Kabupaten Pasuruan.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600">
              <MdSearch size={22} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 sm:text-sm transition-all"
              onChange={handleInputChange}
              placeholder="Cari judul atau isi laporan..."
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <MdFilterList size={20} />
              Filter
            </button>
            
            <AuthenticatedOnly>
              <a
                href="/laporan/upload"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800 shadow-md shadow-green-900/10 transition-all active:scale-95"
              >
                <MdFileUpload size={20} />
                Unggah Laporan
              </a>
            </AuthenticatedOnly>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {reports.map((report, index) => (
                <div 
                  key={report.slug || index}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card Header/Category Placeholder */}
                  <div className="h-2 bg-green-600 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-green-50 text-green-700 rounded-xl">
                        <MdDescription size={24} />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider">
                        PDF Report
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {report.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {report.description || "Tidak ada deskripsi tambahan untuk laporan ini."}
                    </p>

                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center text-xs text-slate-400 gap-2">
                        <MdPerson size={16} className="text-slate-300" />
                        <span>Oleh: <span className="text-slate-600 font-medium">{report?.user?.name ?? "Anonim"}</span></span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400 gap-2">
                        <MdAccessTime size={16} className="text-slate-300" />
                        <span>Publikasi: <span className="text-slate-600 font-medium">{moment(report.createdAt).format("DD MMM YYYY")}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`/laporan/${report.slug}`}
                      className="flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors"
                    >
                      <MdVisibility size={18} />
                      Lihat Detail
                    </a>

                    <AuthenticatedOnly>
                      {report.createdBy === (data?.user as any)?.id && (
                        <div className="flex items-center gap-1">
                          <a
                            href={`/laporan/${report.slug}/edit`}
                            className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                            title="Edit Laporan"
                          >
                            <MdEdit size={18} />
                          </a>
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() => openModal(report)}
                            title="Hapus Laporan"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      )}
                    </AuthenticatedOnly>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Design */}
            <div className="flex flex-col items-center gap-4 py-6">
              <span className="text-sm text-slate-500 font-medium">
                Menampilkan <span className="text-slate-900">{reports.length}</span> dari <span className="text-slate-900">{totalItems.current}</span> laporan
              </span>
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                <Pagination
                  currentPage={page.current}
                  totalPages={totalPages.current}
                  onPageChange={handlePageChange}
                  showIcons
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="p-6 bg-slate-50 text-slate-300 rounded-full mb-4">
              <MdSearch size={64} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Laporan tidak ditemukan</h3>
            <p className="text-slate-500">Coba gunakan kata kunci pencarian yang berbeda.</p>
          </div>
        )}
      </main>

      {/* Modern Delete Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[2000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                    <MdDelete size={32} />
                  </div>
                  
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-tight text-slate-900 mb-2"
                  >
                    Hapus Laporan?
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-slate-500 leading-relaxed">
                      Tindakan ini tidak dapat dibatalkan. Laporan <span className="font-bold text-slate-700">"{currentReport.current?.title}"</span> akan dihapus secara permanen dari server.
                    </p>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 focus:outline-none transition-colors"
                      onClick={closeModal}
                    >
                      Batalkan
                    </button>
                    <button
                      type="button"
                      className="flex-1 justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 focus:outline-none shadow-lg shadow-red-200 transition-all active:scale-95"
                      onClick={confirmDelete}
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
