import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import useYearStore from "@/app/stores/year_store";
import { getCurrentYear } from "@/app/utils/helpers";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoSettings } from "react-icons/io5";
import SuperadminOnly from "../middleware/superadmin_only";

type LayerTileProp = {
    layerInformation: LayerInformation;
    onEdit: (layerInformation: LayerInformation) => void;
};

export default function LayerTile({
    layerInformation: information,
    onEdit,
}: LayerTileProp) {

    const { setSelectedYear, getYears, years } = useYearStore()

    // state 
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // end state 

    // delete layer 
    async function confirmDeleteLayer() {
      setIsDeleteDialogOpen(false);
      await deleteLayer(information.id);
      
      // perbarui tahun aktif 
      await getYears();
      const newYears = useYearStore.getState().years;

      // cek apakah masih ada item di tahun yang dipilih 
      if (!newYears.includes(information.layer.tahun)){
        const currentYear = newYears.length > 0 ? newYears[0].tahun : getCurrentYear();
        setSelectedYear(currentYear)
      }
    }
    // end delete layer 

      const {
        isLayerVisible: isVisible,
        toggleLayerVisibility: toggleVisibility,
        deleteLayer,
      } = useLayersStore(); 

      const classByType: Record<string, string> = {
        road: "w-4 h-1",
        bridge: "w-2 h-2 rounded-full border-2 border-black",
        area: "w-4 h-4 rounded-sm",
      };

    return (
    <li key={information.layer.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
      <div className="relative flex items-center">
        <input
            type="checkbox"
            className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 cursor-pointer transition-all"
            checked={isVisible(Number(information.layer.id))}
            onChange={() => toggleVisibility(information.id)}
        />
      </div>

      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <span
          className={`inline-block border border-slate-200 shadow-sm ${classByType[information.layer.type]}`}
          style={{ backgroundColor: information.layer.color }}
        ></span>
      </div>

      <div className="flex-grow min-w-0">
        <div className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors truncate uppercase tracking-tight">
            {information.layer.name}
        </div>
        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{information.layer.type}</div>
      </div>

      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <SuperadminOnly>
            <button
                onClick={() => onEdit(information)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Pengaturan Layer"
            >
                <IoSettings size={14} />
            </button>
        </SuperadminOnly>

        <SuperadminOnly>
            <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Hapus Layer"
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
                    className="text-lg font-bold leading-6 text-slate-900"
                  >
                    Hapus Layer?
                  </DialogTitle>
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">
                      Apakah Anda yakin ingin menghapus layer berikut:
                      <br />
                      <br />
                      <span className="font-bold text-red-600">
                        {information.layer.name}
                      </span>
                      <br />
                      <br />
                      Data yang sudah dihapus tidak dapat dikembalikan!
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
                      onClick={confirmDeleteLayer}
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
