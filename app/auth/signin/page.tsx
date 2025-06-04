"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { XCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function SignIn(props: Props) {
    const {toast} = useToast();

    const username = useRef("");
    const password = useRef("");

    const [loading, setLoading] = useState(false);
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
  
      await signIn("credentials", {
        username: username.current,
        password: password.current,
        redirect: true,
        callbackUrl: props.searchParams?.callbackUrl ?? "/",
      });

      setLoading(false);
    };

    const resetPassword = async () => {
      if (username.current === "") {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "Silakan isi email terlebih dahulu!",
        })
        return;
      }

      setLoading(true);
      let res : any = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username.current,
        }),
      });

      res = await res.json();

      if (res.status) {
        toast({
          title: "Berhasil",
          description: res.message ?? "",
        })
        // window.location.href = "/api/auth/signin";
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: res.message ?? "",
        })
      }

      setLoading(false);
    }

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
            <h4 className="font-bold text-3xl md:text-[3rem]">Masuk</h4>
            <p className="text-[.8rem] sm:text-base">
              Silakan masukkan username dan password untuk memasuki akun anda.
            </p>

            {!!props.searchParams?.error && (
              <Alert className="mt-6 bg-red-400 text-white">
                <XCircle className="h-4 w-4" color="white" />
                <AlertTitle>Gagal Masuk!</AlertTitle>
                <AlertDescription>
                  {/* { props.searchParams?.error ?? "Username atau password anda salah." } */}
                  {getErrorMessage(props.searchParams.error)}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="mt-8" action="">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="masukkan email anda"
                    onChange={(e) => (username.current = e.target.value)}
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
                <div className="flex flex-row justify-between">
                  <p className="inline-block">Belum punya akun? <a className="text-green-700 font-bold" href="/auth/signup">Daftar</a></p>
                  <a className="text-green-700 font-bold text-end text-sm" href="#" onClick={() => resetPassword()}>Lupa Password</a>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-green-800 text-white py-2 px-4 rounded-md mt-5 disabled:bg-green-600"
                >
                  {
                    loading ? <span className="text-white">Loading...</span> : <span className="text-white">Masuk</span>
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

function getErrorMessage(code: string) {
  switch (code) {
    case "EMAIL_NOT_VERIFIED":
      return "Email anda belum diverifikasi";
    case "INVALID_CREDENTIALS":
      return "Username atau password anda salah.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}
