import Link from "next/link";
import { Plus, Upload, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";
import { Pagination, resolvePage } from "@/components/pagination";
import { BidangRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminNominatifPage({
  searchParams,
}: {
  searchParams: Promise<{ proyek?: string; page?: string }>;
}) {
  const { proyek, page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);
  const where = { projectId: proyek || undefined };
  const [projects, list, total] = await Promise.all([
    prisma.project.findMany({ select: { id: true, namaProyek: true }, orderBy: { createdAt: "desc" } }),
    prisma.bidang.findMany({
      where,
      include: { project: { select: { namaProyek: true } } },
      orderBy: [{ projectId: "asc" }, { noUrut: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.bidang.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Data Nominatif</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{total} bidang terdaftar.</p>
        </div>
        <div className="flex gap-2">
          <a href="/data-nominatif" target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>
            <Download className="h-4 w-4" /> Lihat Publik
          </a>
          <Link href="/admin/nominatif/impor" className={cn(buttonVariants({ variant: "outline" }))}>
            <Upload className="h-4 w-4" /> Import Data
          </Link>
          <Link href="/admin/nominatif/baru" className={cn(buttonVariants())}>
            <Plus className="h-4 w-4" /> Tambah
          </Link>
        </div>
      </div>

      <ProjectFilterTabs
        projects={projects}
        activeProjectId={proyek}
        basePath="/admin/nominatif"
        searchParams={{ proyek }}
        semuaLabel="Semua Proyek"
      />

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Nama Pemilik</th>
              <th className="px-4 py-3">Proyek</th>
              <th className="px-4 py-3">NIB</th>
              <th className="px-4 py-3">Luas Terkena</th>
              <th className="px-4 py-3">Surat Tanda Bukti</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {list.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.noUrut}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{b.namaPemilik}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.project.namaProyek}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.nib || "-"}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.luasKena ? `${b.luasKena.toLocaleString("id-ID")} m²` : "-"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.suratTandaBukti || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/nominatif/${b.id}`} className="text-emerald-700 hover:underline">
                      Edit
                    </Link>
                    <BidangRowActions id={b.id} />
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada data. Tambah manual atau import dari CSV/PDF.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/nominatif" searchParams={{ proyek }} />
    </div>
  );
}
