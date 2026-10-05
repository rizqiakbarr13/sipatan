import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquareWarning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { maskPenuh, maskAngka, maskSebagian, initialName } from "@/lib/mask";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { formatTanggalWaktuIndonesia } from "@/lib/labels";

export const dynamic = "force-dynamic";

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs uppercase text-zinc-400">{label}</dt>
      <dd className="text-sm text-zinc-800 dark:text-zinc-200">{value ?? "-"}</dd>
    </div>
  );
}

export default async function DetailBidangPage({
  params,
  searchParams,
}: {
  params: Promise<{ noUrut: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { noUrut: noUrutParam } = await params;
  const { p: projectId } = await searchParams;
  const noUrut = Number(noUrutParam);
  if (!Number.isInteger(noUrut)) notFound();

  const [matches, { locale, dict }] = await Promise.all([
    prisma.bidang.findMany({
      where: projectId ? { noUrut, projectId } : { noUrut },
      include: { bangunan: true, tanaman: true, bendaLain: true, project: { select: { id: true, namaProyek: true } } },
    }),
    getDictionary(),
  ]);

  if (matches.length === 0) notFound();

  if (matches.length > 1) {
    return (
      <div>
        <PageHeader
          title={`Bidang No. ${noUrut}`}
          backHref="/data-nominatif"
          backLabel={dict.nominatif.kembaliKeDaftar}
        />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Nomor urut ini ditemukan di beberapa proyek. Pilih proyek yang dimaksud:
          </p>
          <div className="space-y-2">
            {matches.map((m) => (
              <Link
                key={m.id}
                href={`/data-nominatif/${noUrut}?p=${m.projectId}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4 hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{m.project.namaProyek}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{m.namaPemilik}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const bidang = matches[0];

  const sanggahanPublik = await prisma.sanggahan.findMany({
    where: { bidangId: bidang.id, tampilPublik: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true, isiSanggahan: true, catatanAdmin: true, createdAt: true },
  });

  const numberLocale = locale === "en" ? "en-US" : "id-ID";

  return (
    <div>
      <PageHeader
        title={`Bidang No. ${bidang.noUrut} — ${bidang.namaPemilik}`}
        backHref="/data-nominatif"
        backLabel={dict.nominatif.kembaliKeDaftar}
      />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Pihak yang Berhak</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="Nama Pemilik" value={bidang.namaPemilik} />
            <InfoItem label="NIK" value={maskPenuh(bidang.nik)} />
            <InfoItem label="Tanggal Lahir" value={maskPenuh(bidang.tanggalLahir)} />
            <InfoItem label="Pekerjaan" value={maskSebagian(bidang.pekerjaan)} />
            <InfoItem label="No. Peta Bidang" value={bidang.noPetaBidang} />
            <InfoItem label="RT/RW" value={maskPenuh(bidang.rtRw)} />
            <InfoItem
              label="Letak"
              value={
                bidang.letakKelurahan || bidang.letakKecamatan
                  ? maskPenuh(`${bidang.letakKelurahan ?? ""}${bidang.letakKecamatan ?? ""}`)
                  : null
              }
            />
            <InfoItem label="Alamat" value={maskPenuh(bidang.alamat)} />
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Data Tanah</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="NIB" value={maskAngka(bidang.nib)} />
            <InfoItem label="No. Danom" value={bidang.danomNo} />
            <InfoItem label="Surat Tanda Bukti" value={maskAngka(bidang.suratTandaBukti)} />
            <InfoItem
              label="Luas Sesuai Alas Hak"
              value={bidang.luasSesuaiAlasHak ? `${bidang.luasSesuaiAlasHak.toLocaleString(numberLocale)} m²` : null}
            />
            <InfoItem
              label="Luas Hasil Ukur"
              value={bidang.luasHasilUkur ? `${bidang.luasHasilUkur.toLocaleString(numberLocale)} m²` : null}
            />
            <InfoItem label="NIS Terkena" value={bidang.nisTerkena} />
            <InfoItem
              label="Luas Terkena"
              value={bidang.luasKena ? `${bidang.luasKena.toLocaleString(numberLocale)} m²` : null}
            />
            <InfoItem label="NIS Sisa" value={bidang.nisSisa} />
            <InfoItem
              label="Luas Sisa"
              value={bidang.luasSisa ? `${bidang.luasSisa.toLocaleString(numberLocale)} m²` : null}
            />
          </dl>
          {bidang.keterangan && (
            <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {bidang.keterangan}
            </p>
          )}
        </section>

        {(bidang.bangunan.length > 0 || bidang.bangunanRingkas) && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Rincian Bangunan</h2>
            {bidang.bangunan.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-zinc-400">
                  <tr>
                    <th className="pb-2">Jenis</th>
                    <th className="pb-2">Jumlah</th>
                    <th className="pb-2">Satuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {bidang.bangunan.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{b.jenis}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{b.jumlah ?? "-"}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{b.satuan ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{bidang.bangunanRingkas}</p>
            )}
          </section>
        )}

        {(bidang.tanaman.length > 0 || bidang.tanamanRingkas) && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Rincian Tanaman</h2>
            {bidang.tanaman.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-zinc-400">
                  <tr>
                    <th className="pb-2">Jenis</th>
                    <th className="pb-2">Kecil</th>
                    <th className="pb-2">Sedang</th>
                    <th className="pb-2">Besar</th>
                    <th className="pb-2">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {bidang.tanaman.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{t.jenis}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{t.kecil ?? "-"}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{t.sedang ?? "-"}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{t.besar ?? "-"}</td>
                      <td className="py-2 text-zinc-800 dark:text-zinc-200">{t.jumlah ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{bidang.tanamanRingkas}</p>
            )}
          </section>
        )}

        {bidang.bendaLain.length > 0 && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Benda Lain yang Berkaitan dengan Tanah</h2>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-zinc-400">
                <tr>
                  <th className="pb-2">Jenis</th>
                  <th className="pb-2">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {bidang.bendaLain.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2 text-zinc-800 dark:text-zinc-200">{b.jenis}</td>
                    <td className="py-2 text-zinc-800 dark:text-zinc-200">{b.jumlah ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <h2 className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
            <MessageSquareWarning className="h-5 w-5" /> {dict.nominatif.dataTidakSesuai}
          </h2>
          <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.nominatif.dataTidakSesuaiDesc}</p>
          <Link
            href={`/sanggahan/baru?bidangId=${bidang.id}`}
            className={cn(buttonVariants(), "mt-3")}
          >
            {dict.nominatif.ajukanUntukBidang}
          </Link>
        </section>

        {sanggahanPublik.length > 0 && (
          <section>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {dict.dokumen.sanggahanDitanggapi} ({sanggahanPublik.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{dict.dokumen.transparansiDesc}</p>
            <div className="mt-4 space-y-3">
              {sanggahanPublik.map((s) => (
                <div key={s.id} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    {initialName(s.nama)} · {formatTanggalWaktuIndonesia(s.createdAt)}
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
