import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SANGGAHAN_STATUS_LABEL,
  SANGGAHAN_STATUS_BADGE_VARIANT,
  formatTanggalIndonesia,
} from "@/lib/labels";
import type { Prisma, SanggahanStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminSanggahanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const where: Prisma.SanggahanWhereInput = {};
  if (status && status in SANGGAHAN_STATUS_LABEL) where.status = status as SanggahanStatus;
  if (q) {
    where.OR = [
      { nama: { contains: q, mode: "insensitive" } },
      { nomorTiket: { contains: q, mode: "insensitive" } },
    ];
  }

  const list = await prisma.sanggahan.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      bidang: { select: { noUrut: true, namaPemilik: true } },
      dokumen: { select: { judul: true } },
    },
  });

  const exportParams = new URLSearchParams();
  if (status) exportParams.set("status", status);
  if (q) exportParams.set("q", q);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Kelola Sanggahan</h1>
          <p className="text-sm text-zinc-500">{list.length} sanggahan.</p>
        </div>
        <a
          href={`/api/admin/sanggahan/export?${exportParams.toString()}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <form method="GET" className="mb-4 flex flex-wrap gap-2">
        <Input name="q" defaultValue={q} placeholder="Cari nama atau nomor tiket..." className="max-w-xs" />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm"
        >
          <option value="">Semua Status</option>
          {Object.entries(SANGGAHAN_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>Terapkan</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Tiket</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Terkait</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/sanggahan/${s.id}`} className="font-mono text-emerald-700 hover:underline">
                    {s.nomorTiket}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">{s.nama}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {s.bidang && `Bidang No. ${s.bidang.noUrut}`}
                  {s.dokumen && s.bidang && " · "}
                  {s.dokumen && s.dokumen.judul}
                  {!s.bidang && !s.dokumen && "-"}
                </td>
                <td className="px-4 py-3 text-zinc-500">{formatTanggalIndonesia(s.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[s.status]}>
                    {SANGGAHAN_STATUS_LABEL[s.status]}
                  </Badge>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada sanggahan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
