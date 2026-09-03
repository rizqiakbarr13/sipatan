import Link from "next/link";
import { Users, History, FileClock, Megaphone, FileStack, UserPlus, MessageSquareWarning, Table2, IdCard, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { Card, CardContent } from "@/components/ui/card";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import { StatusBarChart, TrendAreaChart, TrendLineChart, PublikasiBarChart } from "@/components/admin/dashboard-charts";
import { PeriodeFilter } from "@/components/admin/period-filter";

export const dynamic = "force-dynamic";

type ActivityItem = {
  id: string;
  createdAt: Date;
  icon: typeof MessageSquareWarning;
  colorClass: string;
  message: string;
};

const PERIODE_OPTIONS = [7, 14, 30, 90];

function bucketByDay(dates: { createdAt: Date }[], days: Date[]): { label: string; value: number }[] {
  return days.map((d) => {
    const count = dates.filter((row) => {
      const rd = row.createdAt;
      return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth() && rd.getDate() === d.getDate();
    }).length;
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, value: count };
  });
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  const { periode } = await searchParams;
  const periodeHari = PERIODE_OPTIONS.includes(Number(periode)) ? Number(periode) : 14;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const trendStart = new Date(startOfToday);
  trendStart.setDate(trendStart.getDate() - (periodeHari - 1));

  const [
    project,
    totalBidang,
    sanggahanPerStatus,
    sanggahanHariIni,
    totalDokumen,
    totalWarga,
    wargaTerbaru,
    sanggahanUntukTren,
    wargaUntukTren,
    dokumenUntukTren,
    pengumumanUntukTren,
    logStatus,
    sanggahanBaru,
    dokumenBaru,
    pengumumanBaru,
  ] = await Promise.all([
    getActiveProject(),
    prisma.bidang.count(),
    prisma.sanggahan.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.sanggahan.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.dokumenPublikasi.count(),
    prisma.warga.count(),
    prisma.warga.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        nama: true,
        email: true,
        createdAt: true,
        _count: { select: { sanggahan: true } },
      },
    }),
    prisma.sanggahan.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.warga.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.dokumenPublikasi.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.pengumuman.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.sanggahanLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { sanggahan: { select: { nomorTiket: true } } },
    }),
    prisma.sanggahan.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, nomorTiket: true, nama: true, createdAt: true },
    }),
    prisma.dokumenPublikasi.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, judul: true, createdAt: true },
    }),
    prisma.pengumuman.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, judul: true, createdAt: true },
    }),
  ]);

  const statusMap = Object.fromEntries(sanggahanPerStatus.map((s) => [s.status, s._count._all]));
  const totalSanggahan = sanggahanPerStatus.reduce((sum, s) => sum + s._count._all, 0);

  const statusChartData = Object.entries(SANGGAHAN_STATUS_LABEL).map(([key, label]) => ({
    key,
    label,
    value: statusMap[key] ?? 0,
  }));

  const trendDays = Array.from({ length: periodeHari }, (_, i) => {
    const d = new Date(trendStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const trendData = bucketByDay(sanggahanUntukTren, trendDays);
  const wargaTrendData = bucketByDay(wargaUntukTren, trendDays);
  const dokumenTrendData = bucketByDay(dokumenUntukTren, trendDays);
  const pengumumanTrendData = bucketByDay(pengumumanUntukTren, trendDays);
  const publikasiTrendData = trendDays.map((d, i) => ({
    label: dokumenTrendData[i].label,
    dokumen: dokumenTrendData[i].value,
    pengumuman: pengumumanTrendData[i].value,
  }));

  const activity: ActivityItem[] = [
    ...logStatus.map((l) => ({
      id: `log-${l.id}`,
      createdAt: l.createdAt,
      icon: History,
      colorClass: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      message: `Status sanggahan ${l.sanggahan.nomorTiket} diubah ke "${SANGGAHAN_STATUS_LABEL[l.statusBaru] ?? l.statusBaru}"${l.olehAdmin ? ` oleh ${l.olehAdmin}` : ""}`,
    })),
    ...sanggahanBaru.map((s) => ({
      id: `sanggahan-${s.id}`,
      createdAt: s.createdAt,
      icon: MessageSquareWarning,
      colorClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
      message: `Sanggahan baru diajukan: ${s.nomorTiket} oleh ${s.nama}`,
    })),
    ...wargaTerbaru.map((w) => ({
      id: `warga-${w.id}`,
      createdAt: w.createdAt,
      icon: UserPlus,
      colorClass: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      message: `Warga baru mendaftar: ${w.nama} (${w.email})`,
    })),
    ...dokumenBaru.map((d) => ({
      id: `dokumen-${d.id}`,
      createdAt: d.createdAt,
      icon: FileStack,
      colorClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      message: `Dokumen dipublikasikan: ${d.judul}`,
    })),
    ...pengumumanBaru.map((p) => ({
      id: `pengumuman-${p.id}`,
      createdAt: p.createdAt,
      icon: Megaphone,
      colorClass: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      message: `Pengumuman diterbitkan: ${p.judul}`,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 15);

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{project?.namaProyek}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm shadow-amber-500/30">
              <Table2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">Total Bidang</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalBidang}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-400 to-violet-600" />
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-sm shadow-violet-500/30">
              <FileStack className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">Total Dokumen Publikasi</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalDokumen}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm shadow-emerald-500/30">
              <MessageSquareWarning className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">Sanggahan Baru Hari Ini</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{sanggahanHariIni}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-cyan-400 to-cyan-600" />
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-sm shadow-cyan-500/30">
              <IdCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">Warga Terdaftar</p>
              <p className="mt-1 text-2xl font-bold text-cyan-700 dark:text-cyan-400">{totalWarga}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-zinc-900 dark:text-zinc-100">
          <TrendingUp className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Statistik &amp; Tren
        </h2>
        <PeriodeFilter value={String(periodeHari)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Sanggahan per Status</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total keseluruhan: {totalSanggahan} sanggahan</p>
            <div className="mt-4">
              <StatusBarChart data={statusChartData} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Sanggahan Masuk ({periodeHari} Hari Terakhir)</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Jumlah sanggahan baru per hari</p>
            <div className="mt-4">
              <TrendAreaChart data={trendData} color="#059669" name="Sanggahan" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Pendaftaran Warga Baru ({periodeHari} Hari Terakhir)</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Jumlah akun warga baru per hari</p>
            <div className="mt-4">
              <TrendLineChart data={wargaTrendData} color="#0891b2" name="Warga Baru" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Aktivitas Publikasi ({periodeHari} Hari Terakhir)</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Dokumen &amp; pengumuman yang diterbitkan per hari</p>
            <div className="mt-4">
              <PublikasiBarChart data={publikasiTrendData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <Users className="h-4 w-4 text-blue-700 dark:text-blue-400" /> Warga Terdaftar
              </h2>
              <Link href="/admin/warga" className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                Kelola Akun Warga
              </Link>
            </div>
            <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {wargaTerbaru.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{w.nama}</p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{w.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {w._count.sanggahan} sanggahan
                  </span>
                </div>
              ))}
              {wargaTerbaru.length === 0 && (
                <p className="py-4 text-sm text-zinc-500 dark:text-zinc-400">Belum ada warga yang mendaftar.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
              <FileClock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" /> Log Aktivitas
            </h2>
            <div className="mt-3 max-h-96 space-y-3 overflow-y-auto pr-1">
              {activity.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${a.colorClass}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-zinc-700 dark:text-zinc-300">{a.message}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {a.createdAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada aktivitas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
