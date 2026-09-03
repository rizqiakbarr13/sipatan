import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTanggalIndonesia } from "@/lib/labels";
import { ProyekRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProyekPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bidang: true, dokumen: true, pengumuman: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Proyek</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Atur proyek pengadaan tanah — masa sanggah dihitung otomatis dari tanggal pengumuman.
          </p>
        </div>
        <Link href="/admin/proyek/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Tambah Proyek
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Nama Proyek</th>
              <th className="px-4 py-3">Nomor Peng.</th>
              <th className="px-4 py-3">Masa Sanggah</th>
              <th className="px-4 py-3">Bidang / Dokumen / Peng.</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{p.namaProyek}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {p.kelurahan}, {p.kecamatan}
                  </p>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{p.nomorPeng}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {p.masaSanggahMulai && p.masaSanggahSelesai
                    ? `${formatTanggalIndonesia(p.masaSanggahMulai)} – ${formatTanggalIndonesia(p.masaSanggahSelesai)}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {p._count.bidang} / {p._count.dokumen} / {p._count.pengumuman}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/proyek/${p.id}`} className="text-emerald-700 hover:underline dark:text-emerald-400">
                      Edit
                    </Link>
                    <ProyekRowActions id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada proyek. Klik &ldquo;Tambah Proyek&rdquo; untuk membuat yang pertama.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
