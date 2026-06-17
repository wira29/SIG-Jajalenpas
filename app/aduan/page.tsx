"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { Pagination } from "flowbite-react";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import NavbarWidget from "../components/navbar";
import useJalanStore from "../stores/jalan_store";
import useSelectedRuasStore from "../stores/selected_ruas_store";
import useYearStore from "../stores/year_store";
import { getAduans } from "./actions";

export default function Aduan() {

   const router = useRouter();

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState("")
    const [aduans, setAduans] = useState<any[]>([]);
    const [unfinished, setUnfinished] = useState<any[]>([]);
    const [done, setDone] = useState<any[]>([]);
    const totalPages = useRef(0);
    const totalItems = useRef(0);
    const allItems = useRef([]);
    const page = useRef(1);
    const pageSize = 5;
    const search = useRef("");
    const [isDoneOpen, setIsDoneOpen] = useState(false);
    const [aduan, setAduan] = useState<any>(null);
    const { selectedYear } = useYearStore();
    const [filterStatus, setFilterStatus] = useState("belum");
    
    const [date, setDate] = useState<Date>()
    const note = useRef("");

    const { roads: dataKondisiJalan, fetchData: getKondisiJalan } = useJalanStore();
    const setSelectedRuas = useSelectedRuasStore((state) => state.set);

    const selectRuas = (ruas: any) => {
      const jalan = dataKondisiJalan.find((l: any) => l.id === ruas.idJalan) as any;
      // console.log(jalan)
      const selectedRuas = jalan!.road.find((r: any) => r.id === ruas.id);
      setSelectedRuas(selectedRuas);
      router.push("/")
    }
      
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
          note : note.current,
          date : date,
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

  const handleFilterStatus = async (status: string) => {
    setFilterStatus(status);
    if (status === "belum") {
      paginate(unfinished);
    } else {
      paginate(done);
    }
  }

  const getAduansData = async () => {
        const data = await getAduans();

        paginate(data.unfinished); 
        allItems.current = data.unfinished;
        setUnfinished(data.unfinished);
        setDone(data.finished);
    }

    useEffect(() => {
        
        getAduansData();
        getKondisiJalan(selectedYear);
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
              <select onChange={(e) => handleFilterStatus(e.target.value)} name="" id="" className="p-2 my-4 mx-2 border rounded-md flex-1">
                <option value="belum">Belum Diperbaiki</option>
                <option value="selesai">Sudah Diperbaiki</option>
              </select>
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
              {
                filterStatus == "selesai" && (<>
                <th className="px-4 py-2 bg-gray-200">Tanggal</th>
                <th className="px-4 py-2 bg-gray-200">Catatan</th>
                </>)
              }
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
                <td className="px-4 py-3 text-center hover:cursor-pointer text-green-500 font-bold" onClick={() =>  selectRuas(aduan.ruas)}>{aduan.ruas.namaRuas}</td>
                <td className="text-center"><span className={`px-2 pb-1 m-0 rounded-sm ${filterStatus == "belum" ? "bg-red-300 text-red-700" : "bg-green-300 text-green-700"} font-bold`}>{aduan.laporan}</span></td>
                {
                  filterStatus == "selesai" && (<>
                  <td className="text-center">{aduan.date_finished ? format(aduan.date_finished, "PPP") : "-"}</td>
                  <td className="text-center">{aduan.note}</td>
                  </>)
                }
                <td className="text-center">
                    <a href={`/aduan/${aduan.ruas.id}/`} className="p-2 rounded-sm bg-gray-500 text-white">Detail</a>
                    {filterStatus == "belum" && (<button onClick={() => {
                        setIsDoneOpen(!isDoneOpen)
                        setAduan(aduan)
                    }} className="p-2 mx-2 rounded-sm bg-green-500 text-white">Tandai Selesai</button>)}
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
                    <div className="mt-3">
                      <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar required mode="single" selected={date} onSelect={setDate} />
                      </PopoverContent>
                    </Popover>
                    </div>
                    <div className="mt-3">
                      <Textarea required placeholder="Keterangan..." rows={3} onChange={(e) => note.current = e.target.value} />
                    </div>
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
