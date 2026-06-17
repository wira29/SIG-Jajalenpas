"use client";
import { Pagination } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import NavbarWidget from "../components/navbar";
import { formatDate } from "../utils/helpers";
import { getAduans } from "./actions";
import ImageDialog from "./components/imageDialog";

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

    useEffect(() => {
        const getAduansData = async () => {
            const data = await getAduans();
            
            paginate(data);
            allItems.current = data;
        }
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
              <th className="px-4 py-2 bg-gray-200">Tanggal Aduan</th>
              <th className="px-4 py-2 bg-gray-200">Keluhan</th>
              <th className="px-4 py-2 bg-gray-200">Ruas</th>
              <th className="px-4 py-2 bg-gray-200">Pengguna</th>
              <th className="px-4 py-2 bg-gray-200">Status</th>
              <th className="px-4 py-2 bg-gray-200">Photo</th>
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
                <td className="text-center"><span className="px-2 pb-1 m-0 rounded-sm bg-yellow-300 text-white">{aduan.status}</span></td>
                <td className="px-4 py-3 text-center">
                    <button onClick={() => {
                        setDialogOpen(!isDialogOpen)
                        setSelectedPhoto(aduan.photo)
                    }} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        Lihat Foto 
                    </button>
                    
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
    </div>
  );
}
