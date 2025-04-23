"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
// import AuthenticatedOnly from "./AuthenticatedOnly";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
// import AdminOnly from "./AdminOnly";

export default function NavbarWidget() {
  const { data, status } = useSession();

  let currentPath = "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      currentPath = window.location.pathname;
    }
  }, []);

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div
      className="flex flex-row justify-between items-center h-16 bg-green-800 text-white relative shadow-sm font-sans shrink-0"
      role="navigation"
    >
      <div className="md:hidden flex flex-row items-center ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[500]">
            <DropdownMenuItem>
              <a href="/">Home</a>
            </DropdownMenuItem>
            {/* <AdminOnly> */}
              <DropdownMenuItem>
                <a href="/laporan">Laporan</a>
              </DropdownMenuItem>
            {/* </AdminOnly> */}
            {/* <AuthenticatedOnly> */}
              <DropdownMenuItem>
                <a href="/statistik">Statistik</a>
              </DropdownMenuItem>
            {/* </AuthenticatedOnly> */}
            <DropdownMenuItem>
              <a href="https://www.lapor.go.id/" target="_blank">
                Pengaduan
              </a>
            </DropdownMenuItem>
            {(data?.user as any)?.role === "ADMIN" && (
              <DropdownMenuItem>
                <a href="/users">Akun</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="/" className="text-xl font-bold p-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 mr-2" />
          Kab. Pasuruan
        </a>
      </div>

      <div className="pr-8 md:flex hidden md:flex-row md:justify-between md:items-center">
        <a href="/" className="text-xl font-bold p-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 mr-2" />
          Kab. Pasuruan
        </a>
        <a
          className={`p-4 ${
            currentPath === "/"
              ? "font-bold text-md text-white"
              : "text-sm text-gray-300"
          }`}
          href="/"
        >
          Home
        </a>
        {/* <AdminOnly> */}
        <a
          className={`p-4 ${
            currentPath === "/laporan"
              ? "font-bold text-md text-white"
              : "text-sm text-gray-300"
          }`}
          href="/laporan"
        >
          Laporan
        </a>
        {/* </AdminOnly> */}
        {/* <AuthenticatedOnly> */}
          <a
            className={`p-4 ${
              currentPath === "/statistik"
                ? "font-bold text-md text-white"
                : "text-sm text-gray-300"
            }`}
            href="/statistik"
          >
            Statistik
          </a>
        {/* </AuthenticatedOnly> */}
        <a
          className={`p-4 ${"text-sm text-gray-300"}`}
          href="/aduan"
        >
          Aduan Masyarakat
        </a>
        {(data?.user as any)?.role === "superadmin" && (
          <a
            className={`p-4 ${
              currentPath === "/users"
                ? "font-bold text-md text-white"
                : "text-sm text-gray-300"
            }`}
            href="/users"
          >
            Akun
          </a>
        )}
      </div>

      {status === "authenticated" && (
        <div className="flex flex-row items-center ml-auto md:mr-8 mr-4">
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{data?.user?.name}</span>
                  <span className="text-xs">{(data?.user as any)?.role}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://ui-avatars.com/api/?name=${data?.user?.name}&background=0D8ABC&color=fff`}
                  alt={data?.user?.name ?? ""}
                  className="w-10 h-10 rounded-full ml-2"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[500]">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/edit-profil">
                  <DropdownMenuItem>Edit Profil</DropdownMenuItem>
                </Link>
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem>Keluar</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="z-[500]">
              <form onSubmit={handleLogout} action="">
                <AlertDialogHeader>
                  <AlertDialogTitle>Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah anda yakin ingin keluar ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Kembali</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-800 text-white"
                    type="submit"
                  >
                    Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="flex flex-row items-center">
          <a href="/api/auth/signin" className="p-4">
            Login
          </a>
        </div>
      )}
    </div>
  );
}
