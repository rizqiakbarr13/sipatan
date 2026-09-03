import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTanggalIndonesia } from "@/lib/labels";
import { Pagination, resolvePage } from "@/components/pagination";
import { WargaRowActions } from "./row-actions";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminWargaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);

  const where: Prisma.WargaWhereInput = {};
  if (q) {
    where.OR = [
      { nama: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const [wargaList, total] = await Promise.all([
    prisma.warga.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { sanggahan: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.warga.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Akun Warga</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {total} akun warga terdaftar. Admin dapat mereset password atau menghapus akun.
        </p>
      </div>

      <form method="GET" className="mb-4 flex flex-wrap gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input name="q" defaultValue={q} placeholder="Cari nama atau email..." className="pl-9" />
        </div>
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>
          Terapkan
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">No. HP</th>
              <th className="px-4 py-3">Terdaftar</th>
              <th className="px-4 py-3">Sanggahan</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {wargaList.map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{w.nama}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w.email}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w.nik ?? "-"}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w.noHp ?? "-"}</td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{formatTanggalIndonesia(w.createdAt)}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w._count.sanggahan}</td>
                <td className="px-4 py-3">
                  <WargaRowActions id={w.id} />
                </td>
              </tr>
            ))}
            {wargaList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada warga yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/warga" searchParams={{ q }} />
    </div>
  );
}
