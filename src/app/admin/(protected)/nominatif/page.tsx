import Link from "next/link";
import { Plus, Upload, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";
import { Pagination, resolvePage } from "@/components/pagination";
import { BidangTableClient } from "./bidang-table-client";

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

      <BidangTableClient
        items={list.map((b) => ({
          id: b.id,
          noUrut: b.noUrut,
          namaPemilik: b.namaPemilik,
          projectNama: b.project.namaProyek,
          nib: b.nib,
          luasKena: b.luasKena,
          suratTandaBukti: b.suratTandaBukti,
        }))}
        activeProjectId={proyek}
        activeProjectNama={projects.find((p) => p.id === proyek)?.namaProyek}
      />

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/nominatif" searchParams={{ proyek }} />
    </div>
  );
}
