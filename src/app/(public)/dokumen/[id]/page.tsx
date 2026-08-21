import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, MessageSquareWarning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { isMasaSanggahBerjalan } from "@/lib/masa-sanggah";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  KATEGORI_DOKUMEN_LABEL,
  formatTanggalIndonesia,
  formatUkuranFile,
} from "@/lib/labels";
import { initialName } from "@/lib/mask";

export const dynamic = "force-dynamic";

export default async function DokumenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dokumen, project] = await Promise.all([
    prisma.dokumenPublikasi.findUnique({ where: { id } }),
    getActiveProject(),
  ]);

  if (!dokumen || !dokumen.published) notFound();

  const sanggahanPublik = await prisma.sanggahan.findMany({
    where: { dokumenId: id, tampilPublik: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true, isiSanggahan: true, catatanAdmin: true, createdAt: true },
  });

  const masaSanggahAktif = isMasaSanggahBerjalan(
    project?.masaSanggahMulai ?? null,
    project?.masaSanggahSelesai ?? null
  );
  const bisaSanggah = masaSanggahAktif && dokumen.sanggahanDibuka;
  const isPdf = dokumen.fileType === "application/pdf" || dokumen.fileUrl.endsWith(".pdf");

  return (
    <div>
      <PageHeader title={dokumen.judul} />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isPdf ? (
              <iframe
                src={dokumen.fileUrl}
                title={dokumen.judul}
                className="h-[75vh] w-full rounded-xl border border-zinc-200 bg-zinc-50"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dokumen.fileUrl}
                alt={dokumen.judul}
                className="w-full rounded-xl border border-zinc-200"
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <Badge variant="secondary">{KATEGORI_DOKUMEN_LABEL[dokumen.kategori]}</Badge>
              <dl className="mt-4 space-y-2 text-sm text-zinc-600">
                {dokumen.nomorSurat && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">Nomor Surat</dt>
                    <dd>{dokumen.nomorSurat}</dd>
                  </div>
                )}
                {dokumen.tanggalDokumen && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">Tanggal Dokumen</dt>
                    <dd>{formatTanggalIndonesia(dokumen.tanggalDokumen)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase text-zinc-400">Ukuran File</dt>
                  <dd>{formatUkuranFile(dokumen.fileSize)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-zinc-400">Jumlah Unduhan</dt>
                  <dd>{dokumen.jumlahUnduhan}x</dd>
                </div>
              </dl>
              {dokumen.deskripsi && (
                <p className="mt-4 whitespace-pre-line text-sm text-zinc-600">
                  {dokumen.deskripsi}
                </p>
              )}
              <a
                href={`/api/dokumen/${dokumen.id}/unduh`}
                className={cn(buttonVariants(), "mt-4 w-full")}
              >
                <Download className="h-4 w-4" /> Unduh Dokumen
              </a>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="flex items-center gap-2 font-semibold text-emerald-900">
                <MessageSquareWarning className="h-5 w-5" /> Data tidak sesuai?
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                Jika data Anda pada dokumen ini tidak sesuai, silakan ajukan sanggahan.
              </p>
              {bisaSanggah ? (
                <Link
                  href={`/sanggahan/baru?dokumenId=${dokumen.id}`}
                  className={cn(buttonVariants({ variant: "default" }), "mt-3 w-full")}
                >
                  Ajukan Sanggahan atas Dokumen Ini
                </Link>
              ) : (
                <p className="mt-3 rounded-md bg-white/60 p-2 text-xs text-emerald-900">
                  Kanal sanggahan untuk dokumen ini sedang tidak tersedia (masa sanggah
                  berakhir atau kanal ditutup admin).
                </p>
              )}
            </div>
          </div>
        </div>

        {sanggahanPublik.length > 0 && (
          <section className="mt-10">
            <h2 className="font-semibold text-zinc-900">
              Sanggahan yang Sudah Ditanggapi ({sanggahanPublik.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Ditampilkan sebagai bentuk transparansi. Identitas penyanggah disamarkan.
            </p>
            <div className="mt-4 space-y-3">
              {sanggahanPublik.map((s) => (
                <div key={s.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    {initialName(s.nama)} · {formatTanggalIndonesia(s.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700">{s.isiSanggahan}</p>
                  {s.catatanAdmin && (
                    <div className="mt-2 rounded-md bg-emerald-50 p-2 text-sm text-emerald-800">
                      <span className="font-medium">Tanggapan Admin: </span>
                      {s.catatanAdmin}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
