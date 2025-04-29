"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { XCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRef } from "react";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function SignIn(props: Props) {
  const username = useRef("");
    const password = useRef("");
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      await signIn("credentials", {
        username: username.current,
        password: password.current,
        redirect: true,
        callbackUrl: props.searchParams?.callbackUrl ?? "/",
      });
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
            <h4 className="font-bold text-3xl md:text-[3rem]">Masuk</h4>
            <p className="text-[.8rem] sm:text-base">
              Silakan masukkan username dan password untuk memasuki akun anda.
            </p>

            {!!props.searchParams?.error && (
              <Alert className="mt-6 bg-red-400 text-white">
                <XCircle className="h-4 w-4" color="white" />
                <AlertTitle>Gagal Masuk!</AlertTitle>
                <AlertDescription>
                  { props.searchParams?.error ?? "Username atau password anda salah." }
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="mt-8" action="">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    id="name"
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
                <p>Belum punya akun? <a className="text-green-700 font-bold" href="/auth/signup">Daftar</a></p>
                <button
                  type="submit"
                  className="bg-green-800 text-white py-2 px-4 rounded-md mt-5"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
