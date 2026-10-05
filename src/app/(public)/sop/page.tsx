import { Download, ExternalLink, FileText } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "SOP Pengadaan Tanah",
};

const SK_SOP_URL = "/dokumen-sop/SK-Penetapan-SOP-Bidang-Pertanahan.pdf";

export default async function SopPage() {
  const { dict } = await getDictionary();

  return (
    <div>
      <PageHeader title={dict.sop.pageTitle} description={dict.sop.pageDesc} />

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                SK Penetapan SOP Bidang Pertanahan
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Dokumen resmi dalam format PDF</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={SK_SOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
            >
              <ExternalLink className="h-4 w-4" /> Buka di tab baru
            </a>
            <a
              href={SK_SOP_URL}
              download
              className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
            >
              <Download className="h-4 w-4" /> Unduh PDF
            </a>
          </div>
        </div>

        <iframe
          src={SK_SOP_URL}
          title="SK Penetapan SOP Bidang Pertanahan"
          className="h-[80vh] w-full rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}
