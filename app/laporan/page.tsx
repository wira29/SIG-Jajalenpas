"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AuthenticatedOnly from "../components/middleware/authenticated_only";
import NavbarWidget from "../components/navbar";

export default function LaporanList() {
  const [reports, setReports] = useState<any[]>([]);
  const currentReport = useRef<any>(null);
  const { data, status } = useSession();

      const totalPages = useRef(0);
      const totalItems = useRef(0);
      const allItems = useRef([]);
      const page = useRef(1);
      const pageSize = 5;
      const search = useRef("");
      const [isOpen, setIsOpen] = useState(false);

      function closeModal() {
        setIsOpen(false);
      }

      function openModal() {
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
  
          setTimeout(() => {
              items = items.filter((item: any) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
              paginate(items);
          }, 1000);
      }
  
      const handlePageChange = (newPage: number) => {
          
        page.current = newPage;
        let items = allItems.current;
  
        if (search.current != "") {
            items = items.filter((item: any) => item.title.toLowerCase().includes(search.current.toLowerCase()));
        }
  
        paginate(items);
    };

    async function confirmDelete() {
        await fetch(`/api/reports/${currentReport.current.slug}`, {
          method: "DELETE",
        }).then(() => {
          setReports(
            reports.filter((r) => r.slug !== currentReport.current.slug)
          );
        });

        closeModal();
    
        // window.location.reload();
      }

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        // setReports(data);
        paginate(data);
        allItems.current = data;
      });
  }, []);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-4 py-8 overflow-y-auto">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-start">
          <div className="flex">
          <input
              type="text"
              name="name"
              id="username"
              className="p-2 my-4 border rounded-md flex-1"
              onChange={handleInputChange}
              placeholder="Cari laporan"
            />
          </div>

            <AuthenticatedOnly>
              <a
                href="/laporan/upload"
                className="bg-green-700 text-white py-2 px-4 rounded"
              >
                Unggah Laporan
              </a>
            </AuthenticatedOnly>
          </div>

          <hr className="mb-4" />

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Publikasi</th>
                  <th className="py-2 px-4 border-b text-left">Oleh</th>
                  <th className="py-2 px-4 border-b text-left">Judul</th>
                  <th className="py-2 px-4 border-b text-left">Deskripsi</th>

                  <th className="py-2 px-4 border-b text-left"></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b text-left">
                      {moment(report.createdAt).format("DD MMM YYYY HH:mm")}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {report?.user?.name ?? "-"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {report.title}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {report.description}
                    </td>

                    <td className="py-2 px-4 border-b text-left">
                      <a
                        href={`/laporan/${report.slug}`}
                        className="rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ml-2 mr-2"
                      >
                        Detail
                      </a>
                      <AuthenticatedOnly>
                        {
                          report.createdBy === (data?.user as any)?.id && (
                            <>
                            <a
                          href={`/laporan/${report.slug}/edit`}
                          className="rounded-md bg-yellow-300 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ml-2"
                        >
                          Edit
                        </a>

                        <button
                          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ml-2"
                          onClick={() => {
                            openModal();
                            currentReport.current = report;
                          }}
                        >
                          Hapus
                        </button>
                            </>
                          )
                        }
                      </AuthenticatedOnly>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={page.current}
                totalPages={totalPages.current}
                onPageChange={handlePageChange}
                showIcons
              />
            </div>
          </div>
        </div>
      </main>

      <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/25" />
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
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Hapus Laporan?
                        </Dialog.Title>
      
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Apakah anda yakin ingin menghapus laporan ini?
                          </p>
                        </div>
      
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={confirmDelete}
                          >
                            Hapus
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
