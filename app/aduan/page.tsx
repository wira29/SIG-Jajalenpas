"use client";
// import prisma from "@/libs/prismadb";
// import { getServerSession } from "next-auth";
// import NavBar from "../components/NavBar";
// import { authOptions } from "../utils/auth-options";
// import AddUserForm from "./components/AddUserForm";
// import DeleteUserForm from "./components/DeleteUserForm";

import { useEffect, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import NavbarWidget from "../components/navbar";
import { getAduans } from "./actions";
import ImageDialog from "./components/imageDialog";
// import { getUsers } from "./actions";
// import AddUserForm from "./components/addUserForm";
// import DeleteUserForm from "./components/deleteUserForm";

// // for user crud
export default function Aduan() {

    const [aduans, setAduans] = useState<any[]>([]);
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState("")

    useEffect(() => {
        // console.log("users");
        const getAduansData = async () => {
            const data = await getAduans();
            setAduans(data);
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
          <p className="text-lg font-semibold">Aduan Masyarakat</p>
          <div className="flex items-center space-x-2">
            {/* <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              Tambah
            </button> */}

            {/* <AddUserForm /> */}
          </div>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="rounded-lg text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 bg-gray-200 w-2">No</th>
              <th className="px-4 py-2 bg-gray-200">Keluhan</th>
              <th className="px-4 py-2 bg-gray-200">Photo</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {aduans.map((aduan, idx) => (
              <tr
                key={aduan.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="px-4 py-3 text-center">{idx + 1}</td>
                <td className="px-4 py-3 text-center">{aduan.keluhan}</td>
                <td className="px-4 py-3 text-center">
                    <FaFileImage onClick={() => {
                        setDialogOpen(!isDialogOpen)
                        setSelectedPhoto(aduan.photo)
                    }} size={24} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ImageDialog isOpen={isDialogOpen} closeModal={() => setDialogOpen(false)} path={selectedPhoto} />
      </main>
    </div>
  );
}
