"use client";

import NavbarWidget from "@/app/components/navbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Circles } from "react-loader-spinner";
import { navigateLaporan } from "../../actions";

type Props = {
  params: { slug: string };
};

export default function UploadReport({ params }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    title: { message: string };
    description: { message: string };
    file: { message: string };
  }>();
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  // set initial value for title and description
  useEffect(() => {
    fetch("/api/reports/" + params.slug)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, [params.slug]);

  const onSubmit = async (data: any) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    try {
      const response = await fetch("/api/reports/" + params.slug, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        navigateLaporan();
      } else {
        alert("Error updating report. Please try again.");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Error updating report. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-4 py-8">
        {report ? (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Edit Laporan</h1>

            <div className="flex flex-col">
              <label className="block mb-2">Title:</label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  value: report.title,
                })}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {/* Display error message if title is not provided */}
              {errors.title && (
                <span className="text-red-500">
                  {errors.title.message?.toString()}
                </span>
              )}

              <label className="block mb-2">Description:</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  value: report.description,
                })}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {/* Display error message if description is not provided */}
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message?.toString()}
                </span>
              )}

              {/* readonly file */}
              <label className="block mb-2">File (Tidak dapat diubah):</label>
              <embed
                src={report.file}
                type="application/pdf"
                className="w-full h-96 mb-4"
              />

              {/* Display error message if PDF file is not provided */}
              {errors.file && (
                <span className="text-red-500">
                  {errors.file.message?.toString()}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white py-2 px-4 rounded"
              disabled={uploading}
            >
              {uploading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
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
      </main>
    </div>
  );
}
