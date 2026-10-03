"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Dicatat ke console server/klien agar terlihat di log — ganti dengan
    // pengiriman ke layanan monitoring (mis. Sentry) bila sudah tersedia.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-white px-6 text-center dark:bg-zinc-950">
      <Image
        src="/sipatan-logo.png"
        alt="SIPATAN"
        width={140}
        height={140}
        className="h-14 w-auto object-contain"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Terjadi Kesalahan
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Mohon maaf, terjadi kesalahan tak terduga pada sistem. Silakan coba lagi, atau hubungi
          kami bila masalah terus berlanjut.
        </p>
        {error.digest && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Kode referensi: {error.digest}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          <RotateCcw className="h-4 w-4" /> Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
