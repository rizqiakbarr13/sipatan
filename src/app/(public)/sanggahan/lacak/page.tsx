import { Search, TriangleAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTanggalIndonesia, SANGGAHAN_STATUS_BADGE_VARIANT, SANGGAHAN_STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lacak Sanggahan",
};

export default async function LacakSanggahanPage({
  searchParams,
}: {
  searchParams: Promise<{ nomorTiket?: string; nik?: string }>;
}) {
  const { nomorTiket, nik } = await searchParams;
  const sudahCari = Boolean(nomorTiket && nik);

  const sanggahan = sudahCari
    ? await prisma.sanggahan.findFirst({
        where: { nomorTiket: nomorTiket!.trim(), nik: nik!.trim() },
        include: {
          riwayat: { orderBy: { createdAt: "asc" } },
          bidang: { select: { noUrut: true, namaPemilik: true } },
          dokumen: { select: { judul: true } },
        },
      })
    : null;

  return (
    <div>
      <PageHeader
        title="Lacak Status Sanggahan"
        description="Masukkan nomor tiket dan NIK yang digunakan saat mengajukan sanggahan."
      />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <form method="GET" className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="nomorTiket">Nomor Tiket</Label>
            <Input id="nomorTiket" name="nomorTiket" placeholder="SGH-2026-0001" defaultValue={nomorTiket} required />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="nik">NIK</Label>
            <Input id="nik" name="nik" inputMode="numeric" maxLength={16} defaultValue={nik} required />
          </div>
          <Button type="submit" className="sm:w-auto">
            <Search className="h-4 w-4" /> Lacak
          </Button>
        </form>

        {sudahCari && !sanggahan && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Data tidak ditemukan. Pastikan nomor tiket dan NIK yang Anda masukkan sudah
              benar.
            </p>
          </div>
        )}

        {sanggahan && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-zinc-900">
                  {sanggahan.nomorTiket}
                </span>
                <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[sanggahan.status]}>
                  {SANGGAHAN_STATUS_LABEL[sanggahan.status]}
                </Badge>
              </div>
              <dl className="mt-4 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-zinc-400">Diajukan</dt>
                  <dd>{formatTanggalIndonesia(sanggahan.createdAt)}</dd>
                </div>
                {sanggahan.bidang && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">Bidang Terkait</dt>
                    <dd>No. {sanggahan.bidang.noUrut} — {sanggahan.bidang.namaPemilik}</dd>
                  </div>
                )}
                {sanggahan.dokumen && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">Dokumen Terkait</dt>
                    <dd>{sanggahan.dokumen.judul}</dd>
                  </div>
                )}
              </dl>
              {sanggahan.catatanAdmin && (
                <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Catatan / Tanggapan Admin
                  </p>
                  <p className="mt-1 whitespace-pre-line">{sanggahan.catatanAdmin}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Riwayat</h2>
              <ol className="mt-3 space-y-3 border-l border-zinc-200 pl-4">
                {sanggahan.riwayat.map((log) => (
                  <li key={log.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <p className="text-sm font-medium text-zinc-900">
                      {SANGGAHAN_STATUS_LABEL[log.statusBaru] ?? log.statusBaru}
                    </p>
                    <p className="text-xs text-zinc-500">{formatTanggalIndonesia(log.createdAt)}</p>
                    {log.catatan && <p className="mt-1 text-sm text-zinc-600">{log.catatan}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
