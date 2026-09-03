import { FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { Pagination, resolvePage } from "@/components/pagination";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unduh Formulir Sanggahan",
};

const PAGE_SIZE = 5;

export default async function FormulirSanggahanPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);

  const [projects, totalProjects, { dict }] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, namaProyek: true, nomorPeng: true, kelurahan: true, kecamatan: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.project.count(),
    getDictionary(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalProjects / PAGE_SIZE));

  return (
    <div>
      <PageHeader title={dict.home.unduhFormulirTitle} description={dict.home.unduhFormulirPilihProyekDesc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {projects.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada proyek yang tersedia.</p>
        )}
        <div className="space-y-3">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/api/proyek/${p.id}/formulir`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{p.namaProyek}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {p.nomorPeng} · Kel. {p.kelurahan}, Kec. {p.kecamatan}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400">
                <FileDown className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/sanggahan/formulir"
          searchParams={{}}
        />
      </div>
    </div>
  );
}
