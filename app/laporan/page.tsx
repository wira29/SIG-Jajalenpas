"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import AdminOnly from "../components/middleware/admin_only";
import NavbarWidget from "../components/navbar";

export default function LaporanList() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
      });
  }, []);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-4 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Laporan Jalan Kabupaten Pasuruan
            </h1>

            <AdminOnly>
              <a
                href="/laporan/upload"
                className="bg-green-700 text-white py-2 px-4 rounded"
              >
                Unggah Laporan
              </a>
            </AdminOnly>
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
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Detail
                      </a>
                      <AdminOnly>
                        <a
                          href={`/laporan/${report.slug}/edit`}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </a>

                        <button
                          className="text-red-500 hover:underline ml-2"
                          onClick={() => {
                            if (
                              confirm(
                                "Apakah Anda yakin ingin menghapus laporan ini?"
                              )
                            ) {
                              fetch(`/api/reports/${report.slug}`, {
                                method: "DELETE",
                              }).then(() => {
                                setReports(
                                  reports.filter((r) => r.slug !== report.slug)
                                );
                              });
                            }
                          }}
                        >
                          Hapus
                        </button>
                      </AdminOnly>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
