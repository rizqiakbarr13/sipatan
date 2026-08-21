import Link from "next/link";
import { FileText, Search, Download, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KATEGORI_DOKUMEN_LABEL, formatTanggalIndonesia, formatUkuranFile } from "@/lib/labels";
import type { Prisma, KategoriDokumen } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dokumen Publikasi",
};

const KATEGORI_OPTIONS = Object.entries(KATEGORI_DOKUMEN_LABEL);

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>;
}) {
  const { kategori, q } = await searchParams;

  const where: Prisma.DokumenPublikasiWhereInput = { published: true };
  if (kategori && kategori in KATEGORI_DOKUMEN_LABEL) {
    where.kategori = kategori as KategoriDokumen;
  }
  if (q) where.judul = { contains: q, mode: "insensitive" };

  const dokumenList = await prisma.dokumenPublikasi.findMany({
    where,
    orderBy: { tanggalUpload: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Dokumen Publikasi"
        description="Dokumen resmi pengadaan tanah: daftar nominatif, pengumuman, peta bidang, SK penetapan lokasi, dan berita acara."
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <form method="GET" className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Cari judul dokumen..."
              className="pl-9"
            />
          </div>
          <select
            name="kategori"
            defaultValue={kategori ?? ""}
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:w-64"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit">Terapkan</Button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dokumenList.map((d) => (
            <div
              key={d.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </span>
                <Badge variant="secondary">{KATEGORI_DOKUMEN_LABEL[d.kategori]}</Badge>
              </div>
              <h2 className="mt-3 font-semibold text-zinc-900">{d.judul}</h2>
              <dl className="mt-2 space-y-0.5 text-xs text-zinc-500">
                {d.nomorSurat && <div>No. Surat: {d.nomorSurat}</div>}
                {d.tanggalDokumen && <div>{formatTanggalIndonesia(d.tanggalDokumen)}</div>}
                <div>{formatUkuranFile(d.fileSize)} • {d.jumlahUnduhan}x diunduh</div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dokumen/${d.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <Eye className="h-4 w-4" /> Lihat
                </Link>
                <a
                  href={`/api/dokumen/${d.id}/unduh`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  <Download className="h-4 w-4" /> Unduh
                </a>
              </div>
            </div>
          ))}
        </div>

        {dokumenList.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            Tidak ada dokumen yang sesuai dengan pencarian Anda.
          </p>
        )}
      </div>
    </div>
  );
}
