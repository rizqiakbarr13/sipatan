import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTanggalIndonesia } from "@/lib/labels";
import { Pagination, resolvePage } from "@/components/pagination";
import { PengumumanRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

export default async function AdminPengumumanPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);
  const [list, total] = await Promise.all([
    prisma.pengumuman.findMany({
      orderBy: { tanggalTerbit: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.pengumuman.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Pengumuman</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{total} pengumuman. CRUD pengumuman untuk halaman publik.</p>
        </div>
        <Link href="/admin/pengumuman/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tanggal Terbit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{p.judul}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatTanggalIndonesia(p.tanggalTerbit)}</td>
                <td className="px-4 py-3">
                  <PengumumanRowActions id={p.id} published={p.published} sanggahanDibuka={p.sanggahanDibuka} />
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
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada pengumuman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/pengumuman" searchParams={{}} />
    </div>
  );
}
