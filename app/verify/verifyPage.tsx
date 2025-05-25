"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState("loading");

  useEffect(() => {

      console.log(token)
    if (token) {
      // Kirim token ke API untuk verifikasi
      const verifyEmail = async () => {
        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();
        console.log(data)

        if (data.success) {
          setStatus("berhasil");
        } else {
          setStatus("gagal");
        }
      };

      verifyEmail();
    }
  }, [token]);

  return (status == 'loading' ? (
        <div className="text-center">
      <p>Memverifikasi email Anda...</p>
    </div>
    ) : status == "berhasil" ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-green-500 mx-auto mb-6"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 10-8-8 8 8 0 008 8zm0 2a10 10 0 100-20 10 10 0 000 20zm1.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">Email Berhasil Diverifikasi!</h1>
          <p className="mt-2 text-gray-600">
            Terima kasih telah memverifikasi email Anda. Akun Anda sekarang aktif dan siap digunakan.
          </p>
          <div className="mt-6">
            <a
              href="/api/auth/signin"
              className="inline-block px-6 py-2.5 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
            >
              Login Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
    ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-red-500 mx-auto mb-6"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 10-8-8 8 8 0 008 8zm0 2a10 10 0 100-20 10 10 0 000 20zm1-11a1 1 0 00-1 1v5a1 1 0 001 1h1a1 1 0 001-1v-5a1 1 0 00-1-1h-1zm-3 0a1 1 0 00-1 1v5a1 1 0 001 1h1a1 1 0 001-1v-5a1 1 0 00-1-1h-1z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">Verifikasi Gagal</h1>
          <p className="mt-2 text-gray-600">
            Maaf, token yang Anda gunakan tidak valid atau telah kadaluarsa. Silakan coba lagi.
          </p>
          <div className="mt-6">
            <a
              href="/resend-verification"
              className="inline-block px-6 py-2.5 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
            >
              Kirim Ulang Email Verifikasi
            </a>
          </div>
          <div className="mt-4">
            <a
              href="/api/auth/signin"
              className="inline-block text-blue-500 hover:text-blue-600"
            >
              Kembali ke halaman login
            </a>
          </div>
        </div>
      </div>
    </div>
    )
    )
}