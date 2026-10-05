import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { NominatifTable } from "@/components/nominatif/nominatif-table";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daftar Nominatif",
};

function jenisAlasHak(suratTandaBukti: string | null): string {
  if (!suratTandaBukti) return "Lainnya";
  const s = suratTandaBukti.toUpperCase();
  if (s.includes("SHM")) return "SHM";
  if (s.includes("SHGB")) return "SHGB";
  if (s.includes("SHP")) return "SHP";
  return "Lainnya";
}

export default async function DataNominatifPage({
  searchParams,
}: {
  searchParams: Promise<{ proyek?: string }>;
}) {
  const { proyek } = await searchParams;

  const [bidangList, projects, { locale, dict }] = await Promise.all([
    prisma.bidang.findMany({
      where: proyek ? { projectId: proyek } : undefined,
      orderBy: { noUrut: "asc" },
      select: {
        id: true,
        projectId: true,
        noUrut: true,
        namaPemilik: true,
        nik: true,
        nib: true,
        rtRw: true,
        luasSesuaiAlasHak: true,
        luasHasilUkur: true,
        luasKena: true,
        luasSisa: true,
        suratTandaBukti: true,
        keterangan: true,
      },
    }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, namaProyek: true } }),
    getDictionary(),
  ]);

  const totalLuasKena = bidangList.reduce((sum, b) => sum + (b.luasKena ?? b.luasHasilUkur ?? 0), 0);
  const jenisCounts = bidangList.reduce<Record<string, number>>((acc, b) => {
    const jenis = jenisAlasHak(b.suratTandaBukti);
    acc[jenis] = (acc[jenis] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title={dict.nominatif.pageTitle} description={dict.nominatif.pageDesc} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProjectFilterTabs
          projects={projects}
          activeProjectId={proyek}
          basePath="/data-nominatif"
          searchParams={{}}
          semuaLabel={dict.common.semuaProyek}
        />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">{dict.nominatif.totalBidang}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{bidangList.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">{dict.nominatif.totalLuasTerkena}</p>
              <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">
                {totalLuasKena.toLocaleString(locale === "en" ? "en-US" : "id-ID")} m²
              </p>
            </CardContent>
          </Card>
          {["SHM", "SHGB"].map((jenis) => (
            <Card key={jenis}>
              <CardContent className="p-4">
                <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">{jenis}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {jenisCounts[jenis] ?? 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <NominatifTable data={bidangList} />
      </div>
    </div>
  );
}
