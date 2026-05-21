"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { MdEdit, MdAdd, MdSave, MdClose, MdOutlineManageAccounts } from "react-icons/md";
import { CreateUserFormState, createUser } from "../actions";

const initialState: CreateUserFormState = {
  error: null,
  success: false,
};

type AddUserFormProp = {
  user?: any;
};

export default function AddUserForm(props: AddUserFormProp) {
  const [state, formAction] = useFormState(createUser, initialState);
  const isEditing = props.user?.id !== undefined;

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {isEditing ? (
        <button
          type="button"
          onClick={openModal}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Edit Akun"
        >
          <MdEdit size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800 shadow-md shadow-green-900/10 transition-all active:scale-95"
        >
          <MdAdd size={20} />
          Tambah Pengguna
        </button>
      )}

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
                    <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center">
                      <MdOutlineManageAccounts size={28} />
                    </div>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MdClose size={24} />
                    </button>
                  </div>

                  <form action={formAction} className="space-y-5">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold leading-tight text-slate-900 mb-1"
                      >
                        {isEditing ? "Perbarui" : "Buat"} Akun Pengguna
                      </Dialog.Title>
                      <p className="text-sm text-slate-500">
                        {isEditing ? "Ubah detail informasi personil yang sudah ada." : "Tambahkan personil baru untuk mengelola sistem."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1" htmlFor="username">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="username"
                          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                          placeholder="Masukkan nama lengkap"
                          defaultValue={props.user?.name}
                        />
                        {state.error?.name && (
                          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                            *{state.error.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1" htmlFor="email">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                          placeholder="contoh@mail.com"
                          defaultValue={props.user?.email}
                        />
                        {state.error?.email && (
                          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                            *{state.error.email}
                          </p>
                        )}
                      </div>

                      {!isEditing && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1" htmlFor="password">
                            Kata Sandi
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                            placeholder="Minimal 6 karakter"
                          />
                          {state.error?.password && (
                            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                              *{state.error.password}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1" htmlFor="role">
                          Level Akses
                        </label>
                        <select
                          name="role"
                          id="role"
                          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all cursor-pointer"
                          defaultValue={props.user?.roles?.[0]?.role?.name}
                        >
                          <option value="superadmin">Superadmin (Akses Penuh)</option>
                          <option value="operator">Operator (Teknis)</option>
                          <option value="opd">OPD (Dinas Terkait)</option>
                          <option value="guest">Masyarakat (Umum)</option>
                        </select>
                        {state.error?.role && (
                          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                            *{state.error.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <input type="hidden" name="id" value={props.user?.id} />

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800 shadow-lg shadow-green-900/10 transition-all active:scale-95"
                      >
                        <MdSave size={18} />
                        Simpan Akun
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
