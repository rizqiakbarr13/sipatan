import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SOP Pengadaan Tanah",
};

export default async function SopPage() {
  const tahapan = await prisma.sOPDoc.findMany({
    where: { published: true },
    orderBy: { urutan: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="SOP Pengadaan Tanah"
        description="Tahapan proses pengadaan tanah untuk kepentingan umum, dari perencanaan hingga pelepasan hak."
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <ol className="relative border-l border-emerald-200 pl-6">
          {tahapan.map((t, i) => (
            <li key={t.id} className="mb-8 last:mb-0">
              <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <Link
                href={`/sop/${t.slug}`}
                className="group flex items-start justify-between gap-3 rounded-lg border border-transparent p-3 -m-3 hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div>
                  <h2 className="font-semibold text-zinc-900 group-hover:text-emerald-800">
                    {t.judul}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                    {t.konten.replace(/[#*_`>-]/g, "").slice(0, 160)}
                  </p>
                  {t.fileUrl && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">
                      <FileText className="h-3.5 w-3.5" /> Ada lampiran PDF
                    </span>
                  )}
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-zinc-400 group-hover:text-emerald-700" />
              </Link>
            </li>
          ))}
        </ol>

        {tahapan.length === 0 && (
          <p className="text-sm text-zinc-500">Belum ada tahapan SOP yang dipublikasikan.</p>
        )}
      </div>
    </div>
  );
}
