import { FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { formatTanggalIndonesia } from "@/lib/labels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengumuman",
};

export default async function PengumumanPage() {
  const [daftar, { dict }] = await Promise.all([
    prisma.pengumuman.findMany({
      where: { published: true },
      orderBy: { tanggalTerbit: "desc" },
    }),
    getDictionary(),
  ]);

  return (
    <div>
      <PageHeader title={dict.pengumuman.pageTitle} description={dict.pengumuman.pageDesc} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        {daftar.map((p) => (
          <article key={p.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {formatTanggalIndonesia(p.tanggalTerbit)}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{p.judul}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {p.konten}
            </p>
            {p.lampiranUrl && (
              <a
                href={p.lampiranUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                <FileDown className="h-4 w-4" /> {dict.pengumuman.lihatLampiran}
              </a>
            )}
          </article>
        ))}

        {daftar.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{dict.pengumuman.belumAda}</p>
        )}
      </div>
    </div>
  );
}
