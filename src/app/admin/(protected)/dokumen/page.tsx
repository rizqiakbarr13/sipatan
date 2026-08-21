import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { KATEGORI_DOKUMEN_LABEL, formatTanggalIndonesia, formatUkuranFile } from "@/lib/labels";
import { DokumenRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminDokumenPage() {
  const list = await prisma.dokumenPublikasi.findMany({ orderBy: { tanggalUpload: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Dokumen Publikasi</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload dan kelola dokumen resmi pengadaan tanah.</p>
        </div>
        <Link href="/admin/dokumen/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Upload Dokumen
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Ukuran</th>
              <th className="px-4 py-3">Unduhan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {list.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{d.judul}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{KATEGORI_DOKUMEN_LABEL[d.kategori]}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {d.tanggalDokumen ? formatTanggalIndonesia(d.tanggalDokumen) : "-"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatUkuranFile(d.fileSize)}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{d.jumlahUnduhan}x</td>
                <td className="px-4 py-3">
                  <DokumenRowActions id={d.id} published={d.published} sanggahanDibuka={d.sanggahanDibuka} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dokumen/${d.id}`} className="text-emerald-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada dokumen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
