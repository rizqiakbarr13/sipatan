import { getStatusMasaSanggah } from "@/lib/masa-sanggah";
import { AlarmClock, CheckCircle2, HelpCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/id";

export function MasaSanggahBanner({
  mulai,
  selesai,
  locale,
  dict,
}: {
  mulai: Date | null;
  selesai: Date | null;
  locale: Locale;
  dict: Dictionary;
}) {
  const status = getStatusMasaSanggah(mulai, selesai);
  const dateLocale = locale === "en" ? "en-US" : "id-ID";

  if (status.status === "belum_diatur") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <HelpCircle className="h-5 w-5 shrink-0 text-zinc-500" />
        <span>{dict.banner.belumDiatur}</span>
      </div>
    );
  }

  if (status.status === "berakhir") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-500" />
        <span>
          {dict.banner.berakhirPrefix}{" "}
          <strong>
            {status.selesai.toLocaleDateString(dateLocale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          . {dict.banner.berakhirSuffix}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <AlarmClock className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>
        {dict.banner.sisaPrefix} <strong>{status.sisaHari} {dict.banner.sisaHari}</strong>{" "}
        ({dict.banner.sisaSuffix}{" "}
        {status.selesai.toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        ).
      </span>
    </div>
  );
}
