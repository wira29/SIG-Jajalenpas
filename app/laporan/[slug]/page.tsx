"use client";
import NavbarWidget from "@/app/components/navbar";
import moment from "moment";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";

type Props = {
  params: { slug: string };
};

export default function Laporan({ params }: Props) {
  const [report, setReport] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/reports/" + params.slug)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, [params.slug]);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />

      {report ? (
        <main className="container mx-auto px-4 py-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{report.title}</h1>
                <span className="text-gray-500 text-sm">
                  {report?.user?.username ?? "-"} -{" "}
                  {moment(report.createdAt).format("MMMM D, YYYY h:mm A")}
                </span>
              </div>

              <a
                href={report.file}
                className="bg-green-700 text-white py-2 px-4 rounded"
              >
                Download
              </a>
            </div>

            <p className="text-gray-600 mb-2">{report.description}</p>

            {/* Assuming 'report.pdfUrl' is the URL of your PDF file */}
            <embed
              src={report.file}
              type="application/pdf"
              className="w-full h-96"
            />
          </div>
        </main>
      ) : (
        <div className="flex flex-grow justify-center items-center">
          <Circles
            height="35"
            width="35"
            color="#4fa94d"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
}
