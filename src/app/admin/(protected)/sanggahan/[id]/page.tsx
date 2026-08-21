import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  SANGGAHAN_STATUS_BADGE_VARIANT,
  SANGGAHAN_STATUS_LABEL,
  formatTanggalIndonesia,
} from "@/lib/labels";
import { StatusForm } from "../status-form";
import { TampilPublikToggle } from "../tampil-publik-toggle";

export default async function SanggahanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sanggahan = await prisma.sanggahan.findUnique({
    where: { id },
    include: {
      bidang: { select: { id: true, noUrut: true, namaPemilik: true } },
      dokumen: { select: { id: true, judul: true } },
      riwayat: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!sanggahan) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-zinc-900">{sanggahan.nomorTiket}</h1>
          <p className="text-sm text-zinc-500">Diajukan {formatTanggalIndonesia(sanggahan.createdAt)}</p>
        </div>
        <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[sanggahan.status]}>
          {SANGGAHAN_STATUS_LABEL[sanggahan.status]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Data Pengaju</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs uppercase text-zinc-400">Nama</dt><dd>{sanggahan.nama}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">NIK</dt><dd>{sanggahan.nik}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">Email</dt><dd>{sanggahan.kontakEmail || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">No. HP</dt><dd>{sanggahan.kontakHp || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">Alas Hak</dt><dd>{sanggahan.alasHak || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">No. Danom</dt><dd>{sanggahan.noDanom || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">No. Peta Bidang</dt><dd>{sanggahan.noPetaBidang || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400">No. NIS</dt><dd>{sanggahan.noNis || "-"}</dd></div>
            </dl>

            <div className="mt-4">
              <p className="text-xs uppercase text-zinc-400">Bidang / Dokumen Terkait</p>
              <div className="mt-1 flex flex-wrap gap-3 text-sm">
                {sanggahan.bidang && (
                  <Link href={`/admin/nominatif/${sanggahan.bidang.id}`} className="text-emerald-700 hover:underline">
                    Bidang No. {sanggahan.bidang.noUrut} — {sanggahan.bidang.namaPemilik}
                  </Link>
                )}
                {sanggahan.dokumen && (
                  <Link href={`/admin/dokumen/${sanggahan.dokumen.id}`} className="text-emerald-700 hover:underline">
                    Dokumen: {sanggahan.dokumen.judul}
                  </Link>
                )}
                {!sanggahan.bidang && !sanggahan.dokumen && <span className="text-zinc-500">-</span>}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase text-zinc-400">Isi Sanggahan</p>
              <p className="mt-1 whitespace-pre-line text-sm text-zinc-700">{sanggahan.isiSanggahan}</p>
            </div>

            {sanggahan.lampiranUrl && (
              <a
                href={sanggahan.lampiranUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline"
              >
                <FileText className="h-4 w-4" /> Lihat Lampiran
              </a>
            )}
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Riwayat Status (Audit Trail)</h2>
            <ol className="space-y-3 border-l border-zinc-200 pl-4">
              {sanggahan.riwayat.map((log) => (
                <li key={log.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <p className="text-sm font-medium text-zinc-900">
                    {log.statusLama ? `${SANGGAHAN_STATUS_LABEL[log.statusLama] ?? log.statusLama} → ` : ""}
                    {SANGGAHAN_STATUS_LABEL[log.statusBaru] ?? log.statusBaru}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatTanggalIndonesia(log.createdAt)}
                    {log.olehAdmin && ` · oleh ${log.olehAdmin}`}
                  </p>
                  {log.catatan && <p className="mt-1 text-sm text-zinc-600">{log.catatan}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Proses Sanggahan</h2>
            <StatusForm id={sanggahan.id} currentStatus={sanggahan.status} />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Transparansi Publik</h2>
            <TampilPublikToggle id={sanggahan.id} checked={sanggahan.tampilPublik} />
          </section>
        </div>
      </div>
    </div>
  );
}
