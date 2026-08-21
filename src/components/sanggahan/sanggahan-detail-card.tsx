import { Badge } from "@/components/ui/badge";
import { formatTanggalIndonesia, SANGGAHAN_STATUS_BADGE_VARIANT, SANGGAHAN_STATUS_LABEL } from "@/lib/labels";

type SanggahanDetail = {
  nomorTiket: string;
  status: string;
  createdAt: Date;
  catatanAdmin: string | null;
  bidang: { noUrut: number; namaPemilik: string } | null;
  dokumen: { judul: string } | null;
  riwayat: { id: string; statusBaru: string; catatan: string | null; createdAt: Date }[];
};

export function SanggahanDetailCard({ sanggahan }: { sanggahan: SanggahanDetail }) {
  return (
    <div className="space-y-6">
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
              <dd>
                No. {sanggahan.bidang.noUrut} — {sanggahan.bidang.namaPemilik}
              </dd>
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
            <p className="text-xs font-medium uppercase text-zinc-400">Catatan / Tanggapan Admin</p>
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
  );
}
