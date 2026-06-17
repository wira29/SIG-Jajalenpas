"use client";
import NavbarWidget from "@/app/components/navbar";
import { formatDate } from "@/app/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { getAduanByRuasId } from "../actions";
import ImageDialog from "../components/imageDialog";

type Props = {
  params: { ruasId: string };
};

export default function DetailAduan({params} : Props) {

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState("")
    const [aduans, setAduans] = useState<any[]>([]);
    const totalPages = useRef(0);
    const totalItems = useRef(0);
    const allItems = useRef([]);
    const page = useRef(1);
    const pageSize = 5;
    const search = useRef("");
    const [isOpen, setIsOpen] = useState(false);
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

    const handlePageChange = (newPage: number) => {
        
      page.current = newPage;
      let items = allItems.current;

      if (search.current != "") {
          items = items.filter((item: any) => item.ruas.namaRuas.toLowerCase().includes(search.current.toLowerCase()));
      }

      paginate(items);
  };

  const handleChangeStatus = async (status: string) => {
    // setStatus(status);\
    setIsOpen(false)
    setIsDoneOpen(false)

    await fetch(`/api/aduan/${aduan.id}`, {
      method: "POST",
      body: JSON.stringify({
        status: status
      }),
    })

    getAduansData()
  };

  const getAduansData = async () => {
        const data = await getAduanByRuasId(params.ruasId);
        
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
          {/* <input
              type="text"
              name="name"
              id="username"
              className="p-2 my-4 border rounded-md flex-1"
              onChange={handleInputChange}
              placeholder="Cari ruas"
            /> */}
            <a href="/aduan" className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              Kembali
            </a> 
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="rounded-lg text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 bg-gray-200">Tanggal Aduan</th>
              <th className="px-4 py-2 bg-gray-200">Keluhan</th>
              <th className="px-4 py-2 bg-gray-200">Ruas</th>
              <th className="px-4 py-2 bg-gray-200">Pengguna</th>
              <th className="px-4 py-2 bg-gray-200">Status</th>
              <th className="px-4 py-2 bg-gray-200">Photo</th>
              <th className="px-4 py-2 bg-gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {aduans.map((aduan, idx) => (
              <tr
                key={aduan.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="px-4 py-3 text-center">{formatDate(aduan.created_at)}</td>
                <td className="px-4 py-3 text-center">{aduan.keluhan}</td>
                <td className="px-4 py-3 text-center">{aduan.ruas.namaRuas}</td>
                <td className="px-4 py-3 text-center">
                  {aduan.createdBy.name}
                  <p className="text-gray-400">{aduan.createdBy.email}</p>
                </td>
                <td className="text-center"><span className={'px-2 pb-1 m-0 rounded-sm text-white' + (aduan.status == "verified" ? ' bg-green-500' : ' bg-yellow-300')}>{aduan.status}</span></td>
                <td className="px-4 py-3 text-center">
                    <button onClick={() => {
                        setDialogOpen(!isDialogOpen)
                        setSelectedPhoto(aduan.photo)
                    }} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        Lihat Foto 
                    </button>
                    
                </td>
                <td className="px-4 py-3 text-center">
                    {
                        aduan.status == "pending" && (
                            <button onClick={() => {
                                setIsOpen(!isOpen)
                                setAduan(aduan)
                            }} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                Verifikasi Laporan   
                            </button>
                        )
                    }
                    {
                        aduan.status == "verified" && (
                            <button onClick={() => {
                                setIsDoneOpen(!isDoneOpen)
                                setAduan(aduan)
                            }} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                Tandai Selesai   
                            </button>
                        )
                    }
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
        <ImageDialog isOpen={isDialogOpen} closeModal={() => setDialogOpen(false)} path={selectedPhoto} />
      </main>

            {/* modal verifikasi  */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                      Verifikasi Aduan?
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah anda yakin ingin memverifikasi aduan ini?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => {handleChangeStatus("verified")}}
                    >
                      Verifikasi
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
                      Apakah anda yakin ingin menyelesaikan aduan ini?
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
