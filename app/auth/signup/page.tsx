"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { XCircle } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function SignUp(props: Props) {
    const {toast} = useToast();

    const name = useRef("");
    const password = useRef("");
    const email = useRef("");
    const confirmPassword = useRef("");
    const [loading, setLoading] = useState(false);

  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      if (name.current === "" || email.current === "" || password.current === "" || confirmPassword.current === "") {
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
        name: name.current,
        email: email.current,
        password: password.current,
        role: "guest",
        from: "register"
      };

      let res : any = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      res = await res.json();

      if (res.status) {
        toast({
          title: "Berhasil",
          description: "user berhasil dibuat, silakan cek email anda untuk melakukan verifikasi!",
        })

        window.location.href = "/api/auth/signin";
      } else {
        console.log(res);
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "user gagal dibuat!, email sudah digunakan",
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
            <h4 className="font-bold text-3xl md:text-[3rem]">Daftar</h4>
            <p className="text-[.8rem] sm:text-base">
              Silakan mengisi form dibawah ini untuk mendaftar akun.
            </p>

            {!!props.searchParams?.error && (
              <Alert className="mt-6 bg-red-400 text-white">
                <XCircle className="h-4 w-4" color="white" />
                <AlertTitle>Gagal Masuk!</AlertTitle>
                <AlertDescription>
                  Username atau password anda salah.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="mt-8" action="">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    placeholder="masukkan email anda"
                    onChange={(e) => (name.current = e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="masukkan email anda"
                    onChange={(e) => (email.current = e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input
                    id="name"
                    type="password"
                    placeholder="masukkan password anda"
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
                <p>Sudah punya akun? <a className="text-green-700 font-bold" href="/api/auth/signin">Masuk</a></p>
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-green-800 text-white py-2 px-4 rounded-md mt-5 disabled:bg-green-600"
                >
                  {
                    loading ? <span className="text-white">Memproses...</span> : <span className="text-white">Daftar</span>
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
