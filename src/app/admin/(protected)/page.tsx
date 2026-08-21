import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { getStatusMasaSanggah } from "@/lib/masa-sanggah";
import { Card, CardContent } from "@/components/ui/card";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [project, totalBidang, sanggahanPerStatus, sanggahanHariIni, totalDokumen] =
    await Promise.all([
      getActiveProject(),
      prisma.bidang.count(),
      prisma.sanggahan.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.sanggahan.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.dokumenPublikasi.count(),
    ]);

  const statusMasaSanggah = getStatusMasaSanggah(
    project?.masaSanggahMulai ?? null,
    project?.masaSanggahSelesai ?? null
  );

  const statusMap = Object.fromEntries(
    sanggahanPerStatus.map((s) => [s.status, s._count._all])
  );
  const totalSanggahan = sanggahanPerStatus.reduce((sum, s) => sum + s._count._all, 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
      <p className="text-sm text-zinc-500">{project?.namaProyek}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-zinc-500">Total Bidang</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{totalBidang}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-zinc-500">Total Dokumen Publikasi</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{totalDokumen}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-zinc-500">Sanggahan Baru Hari Ini</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{sanggahanHariIni}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-zinc-500">Sisa Masa Sanggah</p>
            <p className="mt-1 text-2xl font-bold text-amber-700">
              {statusMasaSanggah.status === "berjalan"
                ? `${statusMasaSanggah.sisaHari} hari`
                : statusMasaSanggah.status === "berakhir"
                  ? "Berakhir"
                  : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-zinc-900">Sanggahan per Status</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(SANGGAHAN_STATUS_LABEL).map(([key, label]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">{statusMap[key] ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-xs text-zinc-500">Total keseluruhan: {totalSanggahan} sanggahan</p>
      </div>
    </div>
  );
}
