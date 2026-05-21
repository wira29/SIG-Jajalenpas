"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { MdDelete, MdWarning, MdClose } from "react-icons/md";
import { CreateUserFormState, deleteUser } from "../actions";

const initialState: CreateUserFormState = {
  error: null,
  success: false,
};

type AddUserFormProp = {
  user?: any;
};

export default function DeleteUserForm(props: AddUserFormProp) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function confirmDelete() {
    await deleteUser(props.user?.id as number);
    window.location.reload();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Hapus Akun"
      >
        <MdDelete size={18} />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[3000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                      <MdWarning size={32} />
                    </div>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MdClose size={24} />
                    </button>
                  </div>

                  <div className="mb-8">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-tight text-slate-900 mb-2"
                    >
                      Hapus Akun Pengguna?
                    </Dialog.Title>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Anda akan menghapus akun <span className="font-bold text-slate-700">"{props.user?.name}"</span>. Tindakan ini bersifat permanen dan pengguna tersebut tidak akan bisa lagi mengakses sistem.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      onClick={closeModal}
                    >
                      Batalkan
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                      onClick={confirmDelete}
                    >
                      Ya, Hapus Akun
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
