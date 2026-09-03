import Link from "next/link";
import { FileDown, FileText, ListChecks, Megaphone, MessageSquareWarning, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { formatTanggalIndonesia } from "@/lib/labels";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";
import { PengumumanCarousel } from "@/components/pengumuman/pengumuman-carousel";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengumuman",
};

const TUJUH_HARI_MS = 7 * 24 * 60 * 60 * 1000;
const GRID_LIMIT = 3;

export default async function PengumumanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; proyek?: string }>;
}) {
  const { q, status, sort, proyek } = await searchParams;
  const { dict } = await getDictionary();

  const where: Prisma.PengumumanWhereInput = { published: true };
  if (q) {
    where.OR = [
      { judul: { contains: q, mode: "insensitive" } },
      { konten: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status === "dibuka") where.sanggahanDibuka = true;
  if (status === "tutup") where.sanggahanDibuka = false;
  if (proyek) where.projectId = proyek;

  const [daftar, projects] = await Promise.all([
    prisma.pengumuman.findMany({
      where,
      orderBy: { tanggalTerbit: sort === "terlama" ? "asc" : "desc" },
      include: { dokumenTerkait: { select: { id: true, judul: true } } },
    }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, namaProyek: true } }),
  ]);

  const now = Date.now();
  const gridItems = daftar.slice(0, GRID_LIMIT);
  const extraItems = daftar.slice(GRID_LIMIT);

  return (
    <div>
      <PageHeader title={dict.pengumuman.pageTitle} description={dict.pengumuman.pageDesc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <ProjectFilterTabs
          projects={projects}
          activeProjectId={proyek}
          basePath="/pengumuman"
          searchParams={{ q, status, sort }}
          semuaLabel={dict.common.semuaProyek}
        />

        <form method="GET" className="mb-6 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input name="q" defaultValue={q} placeholder={dict.pengumuman.cariPlaceholder} className="pl-9" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              name="status"
              defaultValue={status ?? ""}
              className="h-10 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="">{dict.pengumuman.semuaStatus}</option>
              <option value="dibuka">{dict.pengumuman.filterDibuka}</option>
              <option value="tutup">{dict.pengumuman.filterTutup}</option>
            </select>
            <select
              name="sort"
              defaultValue={sort ?? "terbaru"}
              aria-label={dict.pengumuman.urutkanLabel}
              className="h-10 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="terbaru">{dict.pengumuman.urutkanLabel}: {dict.pengumuman.urutkanTerbaru}</option>
              <option value="terlama">{dict.pengumuman.urutkanLabel}: {dict.pengumuman.urutkanTerlama}</option>
            </select>
            <button type="submit" className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}>
              {dict.pengumuman.terapkan}
            </button>
          </div>
        </form>

        <div className="space-y-5">
          {gridItems.map((p) => {
            const isBaru = now - p.tanggalTerbit.getTime() < TUJUH_HARI_MS;
            return (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Megaphone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                        {formatTanggalIndonesia(p.tanggalTerbit)}
                      </p>
                      {isBaru && <Badge variant="success">{dict.pengumuman.baruBadge}</Badge>}
                      {p.sanggahanDibuka && <Badge variant="warning">{dict.pengumuman.kanalDibuka}</Badge>}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{p.judul}</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {p.konten}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {p.lampiranUrl && (
                        <a
                          href={p.lampiranUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          <FileDown className="h-4 w-4" /> {dict.pengumuman.lihatLampiran}
                        </a>
                      )}
                      {p.sanggahanDibuka && (
                        <Link href={`/sanggahan/baru?pengumumanId=${p.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                          <MessageSquareWarning className="h-4 w-4" /> {dict.nav.ajukanSanggahan}
                        </Link>
                      )}
                      {p.dokumenTerkait && (
                        <Link
                          href={`/dokumen/${p.dokumenTerkait.id}`}
                          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                        >
                          <FileText className="h-4 w-4" /> {dict.pengumuman.lihatDokumenTerkait}
                        </Link>
                      )}
                      {p.linkDataNominatif && (
                        <Link
                          href="/data-nominatif"
                          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                        >
                          <ListChecks className="h-4 w-4" /> {dict.pengumuman.lihatDataNominatif}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {daftar.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {q || status ? dict.pengumuman.tidakAda : dict.pengumuman.belumAda}
            </p>
          )}
        </div>

        {extraItems.length > 0 && <PengumumanCarousel items={extraItems} dict={dict} now={now} />}
      </div>
    </div>
  );
}
