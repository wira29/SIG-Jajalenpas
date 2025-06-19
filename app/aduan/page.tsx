"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import { Fragment, useEffect, useRef, useState } from "react";
import NavbarWidget from "../components/navbar";
import { getAduans } from "./actions";

export default function Aduan() {

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState("")
    const [aduans, setAduans] = useState<any[]>([]);
    const totalPages = useRef(0);
    const totalItems = useRef(0);
    const allItems = useRef([]);
    const page = useRef(1);
    const pageSize = 5;
    const search = useRef("");
    const [isDoneOpen, setIsDoneOpen] = useState(false);
    const [aduan, setAduan] = useState<any>(null);
      
    const paginate = (items: any) => {
      const startIndex = (page.current - 1) * pageSize;
      setAduans(items.slice(startIndex, startIndex + pageSize));
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
            items = items.filter((item: any) => item.ruas.namaRuas.toLowerCase().includes(e.target.value.toLowerCase()));
            paginate(items);
        }, 1000);
    }

    const handleChangeStatus = async (status: string) => {
      setIsDoneOpen(false)

      await fetch(`/api/aduan/${aduan.ruas_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: status
        }),
      })

      getAduansData()
    };

    const handlePageChange = (newPage: number) => {
        
      page.current = newPage;
      let items = allItems.current;

      if (search.current != "") {
          items = items.filter((item: any) => item.ruas.namaRuas.toLowerCase().includes(search.current.toLowerCase()));
      }

      paginate(items);
  };

  const getAduansData = async () => {
            const data = await getAduans();
            console.log(data)
            paginate(data); 
            allItems.current = data;
        }

    useEffect(() => {
        
        getAduansData();
    }, []);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavbarWidget />

      <main
        className="container mx-auto px-4 py-8 overflow-y-auto"
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex justify-between items-center pb-4 mx-auto">
          <div className="flex">
          <input
              type="text"
              name="name"
              id="username"
              className="p-2 my-4 border rounded-md flex-1"
              onChange={handleInputChange}
              placeholder="Cari ruas"
            />
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="rounded-lg text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 bg-gray-200">Nomor</th>
              <th className="px-4 py-2 bg-gray-200">Ruas</th>
              <th className="px-4 py-2 bg-gray-200">Jumlah Laporan</th>
              <th className="px-4 py-2 bg-gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {aduans.map((aduan, idx) => (
              <tr
                key={aduan.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="px-4 py-3 text-center">{(idx + 1) + ((page.current - 1) * pageSize)}</td>
                <td className="px-4 py-3 text-center">{aduan.ruas.namaRuas}</td>
                <td className="text-center"><span className="px-2 pb-1 m-0 rounded-sm bg-red-300 text-red-700 font-bold">{aduan.laporan}</span></td>
                <td className="text-center">
                    <a href={`/aduan/${aduan.ruas.id}/`} className="p-2 rounded-sm bg-gray-500 text-white">Detail</a>
                    <button onClick={() => {
                        setIsDoneOpen(!isDoneOpen)
                        setAduan(aduan)
                    }} className="p-2 mx-2 rounded-sm bg-green-500 text-white">Tandai Selesai</button>
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
      </main>
      {/* modal selesai  */}
      <Transition appear show={isDoneOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDoneOpen(false)}>
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
                      Konfirmasi
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah anda yakin ingin menyelesaikan semua aduan di ruas ini?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => {handleChangeStatus("done")}}
                    >
                      Selesai
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
