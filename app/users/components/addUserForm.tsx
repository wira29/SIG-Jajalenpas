"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useFormState } from "react-dom";
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
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
      >
        {isEditing ? "Edit" : "Tambah"}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  <form action={formAction}>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {isEditing ? "Edit" : "Tambah"} Akun
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <label htmlFor="username">Nama</label>
                        <input
                          type="text"
                          name="name"
                          id="username"
                          className="border border-gray-300 rounded-md w-full p-2 mb-2"
                          defaultValue={props.user?.name}
                        />
                        {state.error?.name && (
                          <p className="text-red-500 text-sm mb-2">
                            {state.error.name}
                          </p>
                        )}

                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="border border-gray-300 rounded-md w-full p-2 mb-2"
                          defaultValue={props.user?.email}
                        />
                        {state.error?.email && (
                          <p className="text-red-500 text-sm mb-2">
                            {state.error.email}
                          </p>
                        )}

                        {!isEditing && (
                          <>
                            <label htmlFor="password">Password</label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              className="border border-gray-300 rounded-md w-full p-2 mb-2"
                              defaultValue={props.user?.password}
                            />
                            {state.error?.password && (
                              <p className="text-red-500 text-sm mb-2">
                                {state.error.password}
                              </p>
                            )}
                          </>
                        )}

                        <label htmlFor="role">Role</label>
                        <select
                          name="role"
                          id="role"
                          className="border border-gray-300 rounded-md w-full p-2 mb-2"
                          defaultValue={props.user?.roles[0].role.name}
                        >
                          <option value="superadmin">Admin</option>
                          <option value="operator">Operator</option>
                          <option value="guest">Masyarakat</option>
                        </select>
                        {state.error?.role && (
                          <p className="text-red-500 text-sm mb-2">
                            {state.error.role}
                          </p>
                        )}
                      </p>

                      <input
                        type="hidden"
                        name="id"
                        id="id"
                        defaultValue={props.user?.id}
                      />
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Simpan
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
