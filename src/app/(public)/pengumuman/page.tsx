import { FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { formatTanggalIndonesia } from "@/lib/labels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengumuman",
};

export default async function PengumumanPage() {
  const daftar = await prisma.pengumuman.findMany({
    where: { published: true },
    orderBy: { tanggalTerbit: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Pengumuman"
        description="Pengumuman resmi terkait kegiatan pengadaan tanah untuk kepentingan umum."
      />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        {daftar.map((p) => (
          <article key={p.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {formatTanggalIndonesia(p.tanggalTerbit)}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">{p.judul}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
              {p.konten}
            </p>
            {p.lampiranUrl && (
              <a
                href={p.lampiranUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline"
              >
                <FileDown className="h-4 w-4" /> Lihat lampiran
              </a>
            )}
          </article>
        ))}

        {daftar.length === 0 && (
          <p className="text-sm text-zinc-500">Belum ada pengumuman.</p>
        )}
      </div>
    </div>
  );
}
