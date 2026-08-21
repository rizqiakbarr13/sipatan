import { Search, TriangleAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SanggahanDetailCard } from "@/components/sanggahan/sanggahan-detail-card";

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
          <div className="mt-8">
            <SanggahanDetailCard sanggahan={sanggahan} />
          </div>
        )}
      </div>
    </div>
  );
}
