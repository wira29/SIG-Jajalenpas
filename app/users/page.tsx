"use client";

import { Pagination } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import NavbarWidget from "../components/navbar";
import { getUsers } from "./actions";
import AddUserForm from "./components/addUserForm";
import DeleteUserForm from "./components/deleteUserForm";

// // for user crud
export default function Users() {

    const [users, setUsers] = useState<any[]>([]);
    const totalPages = useRef(0);
    const totalItems = useRef(0);
    const allItems = useRef([]);
    const page = useRef(1);
    const pageSize = 5;
    const role = useRef("");
    
    const paginate = (items: any) => {
      console.log(page)
      const startIndex = (page.current - 1) * pageSize;
      setUsers(items.slice(startIndex, startIndex + pageSize));
      totalPages.current = Math.ceil(items.length / pageSize);
      totalItems.current = items.length;
    }

    const roleChange = (e: any) => {
        page.current = 1;
        role.current = e.target.value;

        if (e.target.value === "") {
            paginate(allItems.current);
            return;
        }

        let items = allItems.current;
        items = items.filter((item: any) => item.roles[0].role.name === e.target.value);
        paginate(items);
    }

    const handleInputChange = (e: any) => {
        page.current = 1;

        let items = allItems.current;
        
        if (e.target.value === "") {
            paginate(items);
            return;
        }

        setTimeout(() => {
            items = items.filter((item: any) => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
            paginate(items);
        }, 1000);
    }

    const handlePageChange = (newPage: number) => {
        
        page.current = newPage;
        let items = allItems.current;

        if (role.current != "") {
            items = items.filter((item: any) => item.roles[0].role.name === role.current);
            
        }

        paginate(items);
    };

    useEffect(() => {
        const getUsersData = async () => {
            const data = await getUsers();
            paginate(data);
            allItems.current = data;
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
          <div className="flex gap-4">
          <input
              type="text"
              name="name"
              id="username"
              className="p-2 my-4 border rounded-md flex-1"
              onChange={handleInputChange}
              placeholder="Cari nama"
            />
            <select
          className="p-2 my-4 border rounded-md flex-1"
          onChange={roleChange}
        >
          <option value="">Semua Role</option>
          <option value="superadmin">Superadmin</option>
          <option value="operator">Operator</option>
          <option value="opd">OPD</option>
          <option value="guest">Guest</option>
        </select>
          </div>
          <div className="flex items-center space-x-2">
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
                <td className="px-4 py-3 text-center">{(idx + 1) + ((page.current - 1) * pageSize)}</td>
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
    </div>
  );
}
