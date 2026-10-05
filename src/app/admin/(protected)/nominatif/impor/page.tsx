import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ImportCsvClient } from "./import-csv-client";
import { ImportPdfClient } from "./import-pdf-client";

export default async function ImportNominatifPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const activeMode = mode === "pdf" ? "pdf" : "csv";

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, namaProyek: true },
  });

  const tabClass = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
      active
        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
        : "border-zinc-300 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
    );

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Import Daftar Nominatif</h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Upload file CSV atau PDF untuk membuat atau memperbarui data bidang secara massal. Data akan
        divalidasi dan ditampilkan sebagai preview sebelum disimpan.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/nominatif/impor?mode=csv" className={tabClass(activeMode === "csv")}>
          Import CSV
        </Link>
        <Link href="/admin/nominatif/impor?mode=pdf" className={tabClass(activeMode === "pdf")}>
          Import PDF
        </Link>
      </div>

      {activeMode === "csv" ? (
        <ImportCsvClient projects={projects} />
      ) : (
        <ImportPdfClient projects={projects} />
      )}
    </div>
  );
}
