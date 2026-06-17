/* eslint-disable @next/next/no-img-element */
import { formatRupiah } from "@/app/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Badge } from "flowbite-react";
import { Fragment } from "react";

export default function ProjectDialog({isOpen, setOpen, project}: {isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, project: any}) {
    if (project == null) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[500]" onClose={() => setOpen(false) }>
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
                        Detail Projek
                    </Dialog.Title>
    
                    <div className="mt-2">
                        <tr>
                            <td className="py-1 text-xs">Status</td>
                            <td><Badge style={{ maxWidth: "fit-content" }} color={project.status == "active" ? "green" : "red"}>{project.status}</Badge></td>
                        </tr>
                       <tr>
                            <td className="py-1 text-xs">Nama</td>
                            <td className="py-1 text-xs">: {project.name}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-xs">Tahun</td>    
                            <td className="py-1 text-xs">: {project.fiscal_years.name}</td>    
                        </tr> 
                        <tr>
                            <td className="py-1 text-xs">Pelaksana</td>
                            <td className="py-1 text-xs">: {project.service_providers.user.name}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-xs">Nilai Projek</td>
                            <td className="py-1 text-xs">: {formatRupiah(project.project_value)}</td>
                        </tr> 
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    )
}