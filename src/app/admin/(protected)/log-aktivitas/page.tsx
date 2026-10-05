import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Pagination, resolvePage } from "@/components/pagination";
import { formatTanggalWaktuIndonesia } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

const AKSI_BADGE_VARIANT: Record<string, "default" | "secondary" | "outline" | "warning" | "destructive" | "success"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "destructive",
  TOGGLE: "secondary",
};

const AKSI_LABEL: Record<string, string> = {
  CREATE: "Tambah",
  UPDATE: "Ubah",
  DELETE: "Hapus",
  TOGGLE: "Toggle",
};

export default async function LogAktivitasPage({
  searchParams,
}: {
  searchParams: Promise<{ entitas?: string; page?: string }>;
}) {
  const { entitas, page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);

  const where: Prisma.AdminAuditLogWhereInput = {};
  if (entitas) where.entitas = entitas;

  const [list, total, entitasList] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.adminAuditLog.count({ where }),
    prisma.adminAuditLog.findMany({
      distinct: ["entitas"],
      select: { entitas: true },
      orderBy: { entitas: "asc" },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Log Aktivitas</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {total} aktivitas tercatat. Jejak audit ini mencatat siapa menambah, mengubah, menghapus, atau
          mengganti status publikasi/kanal sanggahan pada data Proyek, Dokumen, Daftar Nominatif, SOP,
          Pengumuman, Akun Warga, dan User Admin.
        </p>
      </div>

      <form method="GET" className="mb-4 flex flex-wrap items-end gap-2">
        <select
          name="entitas"
          defaultValue={entitas ?? ""}
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:bg-zinc-900 dark:border-zinc-700"
        >
          <option value="">Semua Entitas</option>
          {entitasList.map((e) => (
            <option key={e.entitas} value={e.entitas}>{e.entitas}</option>
          ))}
        </select>
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>Terapkan</button>
        {entitas && (
          <Link href="/admin/log-aktivitas" className={cn(buttonVariants({ variant: "ghost" }))}>
            Reset
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Aksi</th>
              <th className="px-4 py-3">Entitas</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {list.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {formatTanggalWaktuIndonesia(log.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{log.adminNama}</td>
                <td className="px-4 py-3">
                  <Badge variant={AKSI_BADGE_VARIANT[log.aksi] ?? "outline"}>
                    {AKSI_LABEL[log.aksi] ?? log.aksi}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{log.entitas}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{log.keterangan || "-"}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada aktivitas tercatat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/log-aktivitas"
        searchParams={{ entitas }}
      />
    </div>
  );
}
