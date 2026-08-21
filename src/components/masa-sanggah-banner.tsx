import { getStatusMasaSanggah } from "@/lib/masa-sanggah";
import { AlarmClock, CheckCircle2, HelpCircle } from "lucide-react";

export function MasaSanggahBanner({
  mulai,
  selesai,
}: {
  mulai: Date | null;
  selesai: Date | null;
}) {
  const status = getStatusMasaSanggah(mulai, selesai);

  if (status.status === "belum_diatur") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
        <HelpCircle className="h-5 w-5 shrink-0 text-zinc-500" />
        <span>Jadwal masa sanggah belum diumumkan.</span>
      </div>
    );
  }

  if (status.status === "berakhir") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-500" />
        <span>
          Masa sanggah telah berakhir pada{" "}
          <strong>
            {status.selesai.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          . Pengajuan sanggahan baru untuk data ini tidak lagi diterima.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlarmClock className="h-5 w-5 shrink-0 text-amber-600" />
      <span>
        Masa sanggah berakhir dalam <strong>{status.sisaHari} hari</strong>{" "}
        (sampai dengan{" "}
        {status.selesai.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        ).
      </span>
    </div>
  );
}
