import useJalanStore, { JalanInformation } from "@/app/stores/jalan_store";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoSettings } from "react-icons/io5";
import SuperadminOnly from "../middleware/superadmin_only";

type LayerTileProp = {
    jalanInformation: JalanInformation;
    onEdit: (jalanInformation: JalanInformation) => void;
  };

export function RoadTile({
    jalanInformation: information,
    onEdit,
}: LayerTileProp) {

  // state 
  const [isDeleteDialogOpen ,setIsDeleteDialogOpen] = useState(false)

    const {
        isJalanVisible: isVisible,
        toggleJalanVisibility: toggleVisibility,
        deleteRoad
    } = useJalanStore();

    async function confirmDeleteRoad() {
      setIsDeleteDialogOpen(false);
      await deleteRoad(information.id);
    }

    return (
        <li key={information.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
          <div className="relative flex items-center">
            <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 cursor-pointer transition-all"
                checked={isVisible(information.id)}
                onChange={() => toggleVisibility(information.id)}
            />
          </div>

          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <div 
                className="w-4 h-1 rounded-full shadow-sm"
                style={{ backgroundColor: information.color }}
            ></div>
          </div>

          <div className="flex-grow min-w-0">
            <div className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors truncate uppercase tracking-tight">
                {information.name}
            </div>
            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Jaringan Jalan</div>
          </div>

          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <SuperadminOnly>
                <button
                    onClick={() => onEdit(information)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Pengaturan Jalan"
                >
                    <IoSettings size={14} />
                </button>
            </SuperadminOnly>

            <SuperadminOnly>
                <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Hapus Jalan"
                >
                    <IoClose size={16} />
                </button>
            </SuperadminOnly>
          </div>

          <Transition appear show={isDeleteDialogOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-[3000]"
              onClose={() => setIsDeleteDialogOpen(false)}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
              </TransitionChild>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                      <DialogTitle
                        as="h3"
                        className="text-xl font-bold leading-tight text-slate-900"
                      >
                        Hapus Jaringan Jalan?
                      </DialogTitle>
                      <div className="mt-4">
                        <p className="text-sm text-slate-500">
                          Apakah Anda yakin ingin menghapus data jalan berikut:
                          <br />
                          <br />
                          <span className="font-bold text-red-600">
                            {information.name}
                          </span>
                          <br />
                          <br />
                          Data ruas dan STA di dalamnya juga akan terhapus secara permanen!
                        </p>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <button
                          type="button"
                          className="flex-1 justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          className="flex-1 justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                          onClick={confirmDeleteRoad}
                        >
                          Hapus
                        </button>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        </li>
    )
}
