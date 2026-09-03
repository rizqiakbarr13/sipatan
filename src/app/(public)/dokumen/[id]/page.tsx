import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download, MessageSquareWarning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
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
  const [dokumen, { dict }] = await Promise.all([
    prisma.dokumenPublikasi.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!dokumen || !dokumen.published) notFound();

  const sanggahanPublik = await prisma.sanggahan.findMany({
    where: { dokumenId: id, tampilPublik: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true, isiSanggahan: true, catatanAdmin: true, createdAt: true },
  });

  const bisaSanggah = dokumen.sanggahanDibuka;
  const isPdf = dokumen.fileType === "application/pdf" || dokumen.fileUrl.endsWith(".pdf");

  return (
    <div>
      <PageHeader title={dokumen.judul} />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/dokumen"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" /> {dict.common.back} — {dict.dokumen.pageTitle}
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isPdf ? (
              <iframe
                src={dokumen.fileUrl}
                title={dokumen.judul}
                className="h-[75vh] w-full rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dokumen.fileUrl}
                alt={dokumen.judul}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <Badge variant="secondary">{KATEGORI_DOKUMEN_LABEL[dokumen.kategori]}</Badge>
              <dl className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {dokumen.nomorSurat && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">{dict.dokumen.nomorSurat}</dt>
                    <dd>{dokumen.nomorSurat}</dd>
                  </div>
                )}
                {dokumen.tanggalDokumen && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-400">{dict.dokumen.tanggalDokumen}</dt>
                    <dd>{formatTanggalIndonesia(dokumen.tanggalDokumen)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase text-zinc-400">{dict.dokumen.ukuranFile}</dt>
                  <dd>{formatUkuranFile(dokumen.fileSize)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-zinc-400">{dict.dokumen.jumlahUnduhan}</dt>
                  <dd>{dokumen.jumlahUnduhan}x</dd>
                </div>
              </dl>
              {dokumen.deskripsi && (
                <p className="mt-4 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                  {dokumen.deskripsi}
                </p>
              )}
              <a
                href={`/api/dokumen/${dokumen.id}/unduh`}
                className={cn(buttonVariants(), "mt-4 w-full")}
              >
                <Download className="h-4 w-4" /> {dict.dokumen.unduhDokumen}
              </a>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
              <h2 className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
                <MessageSquareWarning className="h-5 w-5" /> {dict.dokumen.dataTidakSesuai}
              </h2>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                {dict.dokumen.dataTidakSesuaiDesc}
              </p>
              {bisaSanggah ? (
                <Link
                  href={`/sanggahan/baru?dokumenId=${dokumen.id}`}
                  className={cn(buttonVariants({ variant: "default" }), "mt-3 w-full")}
                >
                  {dict.dokumen.ajukanAtasDokumen}
                </Link>
              ) : (
                <p className="mt-3 rounded-md bg-white/60 p-2 text-xs text-emerald-900 dark:bg-black/20 dark:text-emerald-200">
                  {dict.dokumen.kanalTertutup}
                </p>
              )}
            </div>
          </div>
        </div>

        {sanggahanPublik.length > 0 && (
          <section className="mt-10">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {dict.dokumen.sanggahanDitanggapi} ({sanggahanPublik.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{dict.dokumen.transparansiDesc}</p>
            <div className="mt-4 space-y-3">
              {sanggahanPublik.map((s) => (
                <div key={s.id} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    {initialName(s.nama)} · {formatTanggalIndonesia(s.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{s.isiSanggahan}</p>
                  {s.catatanAdmin && (
                    <div className="mt-2 rounded-md bg-emerald-50 p-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <span className="font-medium">{dict.dokumen.tanggapanAdmin} </span>
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
