import Link from "next/link";
import { FileText, Search, Download, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KATEGORI_DOKUMEN_LABEL, formatTanggalIndonesia, formatUkuranFile } from "@/lib/labels";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";
import { Pagination, resolvePage } from "@/components/pagination";
import type { Prisma, KategoriDokumen } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dokumen Publikasi",
};

const KATEGORI_OPTIONS = Object.entries(KATEGORI_DOKUMEN_LABEL);
const PAGE_SIZE = 6;

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string; proyek?: string; page?: string }>;
}) {
  const { kategori, q, proyek, page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);
  const { dict } = await getDictionary();

  const where: Prisma.DokumenPublikasiWhereInput = { published: true };
  if (kategori && kategori in KATEGORI_DOKUMEN_LABEL) {
    where.kategori = kategori as KategoriDokumen;
  }
  if (q) where.judul = { contains: q, mode: "insensitive" };
  if (proyek) where.projectId = proyek;

  const [dokumenList, totalDokumen, projects] = await Promise.all([
    prisma.dokumenPublikasi.findMany({
      where,
      orderBy: { tanggalUpload: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.dokumenPublikasi.count({ where }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, namaProyek: true } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalDokumen / PAGE_SIZE));

  return (
    <div>
      <PageHeader title={dict.dokumen.pageTitle} description={dict.dokumen.pageDesc} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProjectFilterTabs
          projects={projects}
          activeProjectId={proyek}
          basePath="/dokumen"
          searchParams={{ kategori, q }}
          semuaLabel={dict.common.semuaProyek}
        />

        <form method="GET" className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              name="q"
              defaultValue={q}
              placeholder={dict.dokumen.cariPlaceholder}
              className="pl-9"
            />
          </div>
          <select
            name="kategori"
            defaultValue={kategori ?? ""}
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:w-64"
          >
            <option value="">{dict.dokumen.semuaKategori}</option>
            {KATEGORI_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit">{dict.dokumen.terapkan}</Button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dokumenList.map((d) => (
            <div
              key={d.id}
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:group-hover:bg-emerald-900">
                  <FileText className="h-5 w-5" />
                </span>
                <Badge variant="secondary">{KATEGORI_DOKUMEN_LABEL[d.kategori]}</Badge>
              </div>
              <h2 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">{d.judul}</h2>
              <dl className="mt-2 space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {d.nomorSurat && <div>{dict.dokumen.nomorSurat}: {d.nomorSurat}</div>}
                {d.tanggalDokumen && <div>{formatTanggalIndonesia(d.tanggalDokumen)}</div>}
                <div>{formatUkuranFile(d.fileSize)} • {d.jumlahUnduhan}{dict.dokumen.diunduh}</div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dokumen/${d.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Eye className="h-4 w-4" /> {dict.dokumen.lihat}
                </Link>
                <a
                  href={`/api/dokumen/${d.id}/unduh`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  <Download className="h-4 w-4" /> {dict.dokumen.unduh}
                </a>
              </div>
            </div>
          ))}
        </div>

        {dokumenList.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {dict.dokumen.tidakAda}
          </p>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/dokumen"
          searchParams={{ kategori, q, proyek }}
        />
      </div>
    </div>
  );
}
