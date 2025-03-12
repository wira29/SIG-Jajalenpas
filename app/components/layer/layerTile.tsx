import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoSettings } from "react-icons/io5";
import AdminOnly from "../middleware/admin_only";

type LayerTileProp = {
    layerInformation: LayerInformation;
    onEdit: (layerInformation: LayerInformation) => void;
};

export default function LayerTile({
    layerInformation: information,
    onEdit,
}: LayerTileProp) {

    // state 
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // end state 

    // delete layer 
    async function confirmDeleteLayer() {
      setIsDeleteDialogOpen(false);
      await deleteLayer(information.id);
    }
    // end delete layer 

      const {
        isLayerVisible: isVisible,
        toggleLayerVisibility: toggleVisibility,
        deleteLayer,
      } = useLayersStore();

      const classByType: Record<string, string> = {
        road: "w-4 h-1",
        bridge: "w-2 h-2 rounded-full",
        area: "w-4 h-4 rounded-sm",
      };

    return (
    <li key={information.layer.id} className="flex flex-row items-center py-1">
      <input
        type="checkbox"
        className="text-sm font-medium text-green-500 dark:text-gray-300 rounded-sm"
        checked={isVisible(information.layer.id)}
        onChange={() => toggleVisibility(information.id)}
      />
      <div className="w-8 flex items-center justify-center">
        <span
          className={`inline-block mx-2 ${classByType[information.layer.type]}`}
          style={{ backgroundColor: information.layer.color }}
        ></span>
      </div>
      <span className="flex-grow text-sm">{information.layer.name}</span>
      <AdminOnly>
        <button
          onClick={() => {
            onEdit(information);
          }}
          className="mr-2 text-gray-500"
        >
          <IoSettings />
        </button>
      </AdminOnly>

      <AdminOnly>
        <button
          onClick={() => {
            setIsDeleteDialogOpen(true);
          }}
          className="text-red-500"
        >
          <IoClose />
        </button>
      </AdminOnly>

      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[500]"
          onClose={() => {
            setIsDeleteDialogOpen(false);
          }}
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
            <div className="fixed inset-0 bg-black/25" />
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Hapus Layer?
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah Anda yakin ingin menghapus layer berikut:
                      <br />
                      <br />
                      <span className="font-bold text-red-500">
                        {information.layer.name}
                      </span>
                      <br />
                      <br />
                      Data yang sudah dihapus tidak dapat dikembalikan!
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none "
                      onClick={() => {
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none "
                      onClick={() => {
                        confirmDeleteLayer();
                      }}
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