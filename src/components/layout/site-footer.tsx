"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";

export function SiteFooter() {
  const { dict } = useLocale();

  return (
    <footer className="mt-16 border-t bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-emerald-800 dark:text-emerald-400">Pengadaan Tanah Kota Depok</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{dict.footer.alamat}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.footer.tautanTitle}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/dokumen">{dict.nav.dokumen}</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/data-nominatif">{dict.nav.nominatif}</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/sop">{dict.footer.sopPengadaan}</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/pengumuman">{dict.nav.pengumuman}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.footer.sanggahanTitle}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/sanggahan/baru">{dict.nav.ajukanSanggahan}</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/sanggahan/lacak">{dict.footer.lacakStatus}</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/api/formulir-pdf">{dict.footer.unduhFormulir}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.footer.adminTitle}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400" href="/admin/login">{dict.footer.loginAdmin}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} {dict.footer.hakCipta}
      </div>
    </footer>
  );
}
