import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTanggalIndonesia } from "@/lib/labels";
import { PengumumanRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminPengumumanPage() {
  const list = await prisma.pengumuman.findMany({ orderBy: { tanggalTerbit: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Kelola Pengumuman</h1>
          <p className="text-sm text-zinc-500">CRUD pengumuman untuk halaman publik.</p>
        </div>
        <Link href="/admin/pengumuman/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tanggal Terbit</th>
              <th className="px-4 py-3">Publish</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{p.judul}</td>
                <td className="px-4 py-3 text-zinc-600">{formatTanggalIndonesia(p.tanggalTerbit)}</td>
                <td className="px-4 py-3">
                  <PengumumanRowActions id={p.id} published={p.published} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pengumuman/${p.id}`} className="text-emerald-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada pengumuman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
