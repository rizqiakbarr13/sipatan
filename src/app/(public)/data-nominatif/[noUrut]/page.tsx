import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquareWarning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { isMasaSanggahBerjalan } from "@/lib/masa-sanggah";
import { maskNik } from "@/lib/mask";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
}: {
  params: Promise<{ noUrut: string }>;
}) {
  const { noUrut: noUrutParam } = await params;
  const noUrut = Number(noUrutParam);
  if (!Number.isInteger(noUrut)) notFound();

  const [bidang, project, { locale, dict }] = await Promise.all([
    prisma.bidang.findFirst({
      where: { noUrut },
      include: { bangunan: true, tanaman: true },
    }),
    getActiveProject(),
    getDictionary(),
  ]);

  if (!bidang) notFound();

  const masaSanggahAktif = isMasaSanggahBerjalan(
    project?.masaSanggahMulai ?? null,
    project?.masaSanggahSelesai ?? null
  );
  const numberLocale = locale === "en" ? "en-US" : "id-ID";

  return (
    <div>
      <PageHeader title={`Bidang No. ${bidang.noUrut} — ${bidang.namaPemilik}`} />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Pihak yang Berhak</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="Nama Pemilik" value={bidang.namaPemilik} />
            <InfoItem label="NIK" value={maskNik(bidang.nik)} />
            <InfoItem label="Pekerjaan" value={bidang.pekerjaan} />
            <InfoItem label="No. Peta Bidang" value={bidang.noPetaBidang} />
            <InfoItem label="RT/RW" value={bidang.rtRw} />
            <InfoItem label="Alamat" value={bidang.alamat} />
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">Data Tanah</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="NIB" value={bidang.nib} />
            <InfoItem label="No. Danom" value={bidang.danomNo} />
            <InfoItem label="Surat Tanda Bukti" value={bidang.suratTandaBukti} />
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

        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <h2 className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
            <MessageSquareWarning className="h-5 w-5" /> {dict.nominatif.dataTidakSesuai}
          </h2>
          <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.nominatif.dataTidakSesuaiDesc}</p>
          {masaSanggahAktif ? (
            <Link
              href={`/sanggahan/baru?bidangId=${bidang.id}`}
              className={cn(buttonVariants(), "mt-3")}
            >
              {dict.nominatif.ajukanUntukBidang}
            </Link>
          ) : (
            <p className="mt-3 rounded-md bg-white/60 p-2 text-xs text-emerald-900 dark:bg-black/20 dark:text-emerald-200">
              {dict.nominatif.masaSanggahBerakhir}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
