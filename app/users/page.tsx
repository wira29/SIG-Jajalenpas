"use client";

import { Pagination } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { 
  MdPerson, 
  MdEmail, 
  MdShield, 
  MdSearch, 
  MdFilterList, 
  MdManageAccounts,
  MdAdd
} from "react-icons/md";
import NavbarWidget from "../components/navbar";
import { getUsers } from "./actions";
import AddUserForm from "./components/addUserForm";
import DeleteUserForm from "./components/deleteUserForm";

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const totalPages = useRef(0);
    const totalItems = useRef(0);
    const allItems = useRef([]);
    const page = useRef(1);
    const pageSize = 8;
    const roleFilter = useRef("");
    const searchQuery = useRef("");
    
    const paginate = (items: any) => {
      const startIndex = (page.current - 1) * pageSize;
      setUsers(items.slice(startIndex, startIndex + pageSize));
      totalPages.current = Math.ceil(items.length / pageSize);
      totalItems.current = items.length;
    }

    const applyFilters = () => {
        let items = allItems.current;
        
        if (roleFilter.current !== "") {
            items = items.filter((item: any) => 
                item.roles[0]?.role?.name === roleFilter.current
            );
        }

        if (searchQuery.current !== "") {
            items = items.filter((item: any) => 
                item.name.toLowerCase().includes(searchQuery.current.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.current.toLowerCase())
            );
        }

        paginate(items);
    }

    const handleRoleChange = (e: any) => {
        page.current = 1;
        roleFilter.current = e.target.value;
        applyFilters();
    }

    const handleSearchChange = (e: any) => {
        page.current = 1;
        searchQuery.current = e.target.value;
        applyFilters();
    }

    const handlePageChange = (newPage: number) => {
        page.current = newPage;
        applyFilters();
    };

    useEffect(() => {
        const getUsersData = async () => {
            setIsLoading(true);
            try {
                const data = await getUsers();
                allItems.current = data;
                paginate(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        getUsersData();
    }, []);

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'superadmin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'operator': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'opd': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <NavbarWidget />

      <main className="flex-grow container mx-auto px-4 py-8 pb-16">
        {/* Header Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                    <MdManageAccounts size={32} />
                </div>
                Manajemen Pengguna
            </h1>
            <p className="text-slate-500 mt-2">
                Kelola hak akses personil dinas dan akun masyarakat untuk operasional sistem Jajalen Pas.
            </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative group min-w-[300px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600">
                    <MdSearch size={20} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm transition-all"
                    onChange={handleSearchChange}
                    placeholder="Cari nama atau email..."
                />
            </div>

            {/* Role Filter */}
            <div className="relative">
                <select
                    className="appearance-none block w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all cursor-pointer"
                    onChange={handleRoleChange}
                >
                    <option value="">Semua Role</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="operator">Operator</option>
                    <option value="opd">OPD</option>
                    <option value="guest">Masyarakat (Guest)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <MdFilterList size={18} />
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <AddUserForm />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16 text-center">No</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identitas Pengguna</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontak & Email</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level Akses</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Kelola</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            [1,2,3,4].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : users.length > 0 ? (
                            users.map((user, idx) => {
                                const roleName = user.roles[0]?.role?.name || 'Guest';
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-400 text-center">
                                            {(idx + 1) + ((page.current - 1) * pageSize)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium italic">ID: {String(user.id)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <MdEmail size={16} className="text-slate-300" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeColor(roleName)}`}>
                                                <MdShield size={12} />
                                                {roleName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <AddUserForm user={user} />
                                                <DeleteUserForm user={user} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <MdSearch size={48} className="text-slate-200 mb-2" />
                                        <p className="text-slate-400 text-sm">Pengguna tidak ditemukan</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Design */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-medium italic">
                    Menampilkan <span className="text-slate-900 font-bold">{users.length}</span> personil dari <span className="text-slate-900 font-bold">{totalItems.current}</span> akun terdaftar
                </span>
                <div className="bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200">
                    <Pagination
                        currentPage={page.current}
                        totalPages={totalPages.current}
                        onPageChange={handlePageChange}
                        showIcons
                    />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
