import Link from "next/link";
import Image from "next/image";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-white px-6 text-center dark:bg-zinc-950">
      <Image
        src="/sipatan-logo.png"
        alt="SIPATAN"
        width={140}
        height={140}
        className="h-14 w-auto object-contain"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Halaman Tidak Ditemukan
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Halaman yang Anda cari tidak ada, sudah dipindahkan, atau alamatnya salah.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
