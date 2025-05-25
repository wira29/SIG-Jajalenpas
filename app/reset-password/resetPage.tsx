"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";


export default function ResetPage() {

    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const password = useRef("");
    const confirmPassword = useRef("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      if (password.current === "" || confirmPassword.current === "") {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "Silakan isi semua inputan!",
        })
        return;
      }

      if (password.current !== confirmPassword.current) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "Konfirmasi password tidak sama!",
        })
        return;
      }

      const data = {
        token: token,
        password: password.current,
      };

      let res : any = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      res = await res.json();

      if (res.status) {
        await setTimeout(() => {
            toast({
                title: "Berhasil",
                description: res.message ?? "",
              })
        }, 2000);
        window.location.href = "/api/auth/signin";
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: res.message ?? "",
        })
      }

    };

    return (
        <main className="bg-auth flex justify-center items-center py-8 px-8 md:py-12 md:px-36 bg-green-800">
          <Card className="h-full w-full rounded-3xl">
            <CardContent className="flex gap-6 p-0 h-full">
              <div className="basis-1/2 h-full bg-card-auth rounded-s-3xl p-8 lg:flex flex-col justify-center items-center hidden">
                <img src="/logo.png" className="xl:w-48 lg:w-24" alt="" />
                <h4 className="mt-8 font-bold text-2xl xl:text-4xl">JAJALENPAS</h4>
                <p>Jaringan Jalan Kabupaten Pasuruan</p>
              </div>
              <div className="basis-full lg:basis-1/2 py-8 px-6 flex flex-col lg:justify-center overflow-y-auto">
                <div className="lg:hidden flex flex-col justify-center items-center mb-6">
                  <img src="/logo.png" className="w-16 sm:w-24" alt="" />
                  <h4 className="mt-8 font-bold text-xl sm:text-2xl">JAJALENPAS</h4>
                  <p className="text-[.8rem] sm:text-base">
                    Jaringan Jalan Kabupaten Pasuruan
                  </p>
                </div>
                <h4 className="font-bold text-3xl md:text-[3rem]">Reset Password</h4>
                <p className="text-[.8rem] sm:text-base">
                  Silakan memasukkan password baru anda untuk memulihkan akun.
                </p>
    
                <form onSubmit={onSubmit} className="mt-8" action="">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Password</Label>
                      <Input
                        id="name"
                        type="password"
                        placeholder="masukkan email anda"
                        onChange={(e) => (password.current = e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Konfirmasi Password</Label>
                      <Input
                        id="name"
                        type="password"
                        placeholder="masukkan konfirmasi password anda"
                        onChange={(e) => (confirmPassword.current = e.target.value)}
                      />
                    </div>
                    <button
                      disabled={loading}
                      type="submit"
                      className="bg-green-800 text-white py-2 px-4 rounded-md mt-5 disabled:bg-green-600"
                    >
                      {
                        loading ? <span className="text-white">Loading...</span> : <span className="text-white">Reset</span>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
          <Toaster />
        </main>
      );
}