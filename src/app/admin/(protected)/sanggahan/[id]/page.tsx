import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Clock, TriangleAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  SANGGAHAN_STATUS_BADGE_VARIANT,
  SANGGAHAN_STATUS_LABEL,
  formatTanggalWaktuIndonesia,
  formatTanggalIndonesia,
} from "@/lib/labels";
import { getTargetTanggapan } from "@/lib/date-utils";
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
      project: { select: { id: true, namaProyek: true } },
      bidang: { select: { id: true, noUrut: true, namaPemilik: true } },
      dokumen: { select: { id: true, judul: true } },
      pengumuman: { select: { id: true, judul: true } },
      warga: { select: { nama: true, email: true } },
      riwayat: { orderBy: { createdAt: "asc" } },
      lampiran: { orderBy: { createdAt: "asc" } },
      buktiTambahan: { orderBy: { urutan: "asc" } },
    },
  });
  if (!sanggahan) notFound();

  const target = getTargetTanggapan(sanggahan.createdAt);
  const isOverdue = sanggahan.status === "DITERIMA" && Date.now() > target.max.getTime();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100">{sanggahan.nomorTiket}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Diajukan {formatTanggalWaktuIndonesia(sanggahan.createdAt)}</p>
          <Link href={`/admin/proyek/${sanggahan.project.id}`} className="text-sm text-emerald-700 hover:underline dark:text-emerald-400">
            Proyek: {sanggahan.project.namaProyek}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={sanggahan.anonim || !sanggahan.warga ? "secondary" : "default"}>
            {sanggahan.anonim
              ? "Anonim"
              : sanggahan.warga
                ? `Akun: ${sanggahan.warga.nama}`
                : "Anonim"}
          </Badge>
          <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[sanggahan.status]}>
            {SANGGAHAN_STATUS_LABEL[sanggahan.status]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Data Pengaju</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Nama</dt><dd>{sanggahan.nama}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">NIK</dt><dd>{sanggahan.nik}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Email</dt><dd>{sanggahan.kontakEmail || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">No. HP</dt><dd>{sanggahan.kontakHp || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Alas Hak</dt><dd>{sanggahan.alasHak || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">No. Danom</dt><dd>{sanggahan.noDanom || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">No. Peta Bidang</dt><dd>{sanggahan.noPetaBidang || "-"}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-400 dark:text-zinc-500">No. NIS</dt><dd>{sanggahan.noNis || "-"}</dd></div>
            </dl>

            <div className="mt-4">
              <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Bidang / Dokumen / Pengumuman Terkait</p>
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
                {sanggahan.pengumuman && (
                  <Link href={`/admin/pengumuman/${sanggahan.pengumuman.id}`} className="text-emerald-700 hover:underline">
                    Pengumuman: {sanggahan.pengumuman.judul}
                  </Link>
                )}
                {!sanggahan.bidang && !sanggahan.dokumen && !sanggahan.pengumuman && (
                  <span className="text-zinc-500 dark:text-zinc-400">-</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Isi Sanggahan</p>
              <p className="mt-1 whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">{sanggahan.isiSanggahan}</p>
            </div>

            {(sanggahan.lampiranUrl || sanggahan.lampiran.length > 0) && (
              <div className="mt-4">
                <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Lampiran Bukti</p>
                <div className="mt-1 flex flex-col gap-1.5">
                  {sanggahan.lampiranUrl && (
                    <a
                      href={sanggahan.lampiranUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      <FileText className="h-4 w-4" /> Lampiran
                    </a>
                  )}
                  {sanggahan.lampiran.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      <FileText className="h-4 w-4" /> {file.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {sanggahan.buktiTambahan.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">Tabel Bukti Tambahan</p>
                <div className="mt-1 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                      <tr>
                        <th className="px-3 py-2">Jenis Bukti</th>
                        <th className="px-3 py-2">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {sanggahan.buktiTambahan.map((row) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-100">{row.jenisBukti}</td>
                          <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{row.keterangan || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Riwayat Status (Audit Trail)</h2>
            <ol className="space-y-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              {sanggahan.riwayat.map((log) => (
                <li key={log.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {log.statusLama ? `${SANGGAHAN_STATUS_LABEL[log.statusLama] ?? log.statusLama} → ` : ""}
                    {SANGGAHAN_STATUS_LABEL[log.statusBaru] ?? log.statusBaru}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatTanggalWaktuIndonesia(log.createdAt)}
                    {log.olehAdmin && ` · oleh ${log.olehAdmin}`}
                  </p>
                  {log.catatan && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{log.catatan}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Proses Sanggahan</h2>
            <div
              className={`mb-4 flex items-start gap-2 rounded-lg border p-3 text-xs ${
                isOverdue
                  ? "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400"
              }`}
            >
              {isOverdue ? (
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ) : (
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <p>
                Target tanggapan: 3–4 hari kerja sejak diajukan — antara{" "}
                <strong>{formatTanggalIndonesia(target.min)}</strong> dan{" "}
                <strong>{formatTanggalIndonesia(target.max)}</strong>.
                {isOverdue && " Sudah melewati target tanggapan."}
              </p>
            </div>
            <StatusForm id={sanggahan.id} currentStatus={sanggahan.status} />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Transparansi Publik</h2>
            <TampilPublikToggle id={sanggahan.id} checked={sanggahan.tampilPublik} />
          </section>
        </div>
      </div>
    </div>
  );
}
