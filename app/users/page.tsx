"use client";
// import prisma from "@/libs/prismadb";
// import { getServerSession } from "next-auth";
// import NavBar from "../components/NavBar";
// import { authOptions } from "../utils/auth-options";
// import AddUserForm from "./components/AddUserForm";
// import DeleteUserForm from "./components/DeleteUserForm";

import { useEffect, useState } from "react";
import NavbarWidget from "../components/navbar";
import { getUsers } from "./actions";
import AddUserForm from "./components/addUserForm";
import DeleteUserForm from "./components/deleteUserForm";

// // for user crud
export default function Users() {

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        console.log("users");
        const getUsersData = async () => {
            const data = await getUsers();
            setUsers(data);
        }
        getUsersData();
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
          <p className="text-lg font-semibold">Akun</p>
          <div className="flex items-center space-x-2">
            {/* <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              Tambah
            </button> */}

            <AddUserForm />
          </div>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="rounded-lg text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 bg-gray-200 w-2">No</th>
              <th className="px-4 py-2 bg-gray-200">Nama</th>
              <th className="px-4 py-2 bg-gray-200">Email</th>
              <th className="px-4 py-2 bg-gray-200">Role</th>
              <th className="px-4 py-2 bg-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="px-4 py-3 text-center">{idx + 1}</td>
                <td className="px-4 py-3 text-center">{user.name}</td>
                <td className="px-4 py-3 text-center">{user.email}</td>
                <td className="px-4 py-3 text-center">{user.roles[0].role.name}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <AddUserForm key={"edit_" + user.id} user={user} />
                  <DeleteUserForm key={"delete_" + user.id} user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
