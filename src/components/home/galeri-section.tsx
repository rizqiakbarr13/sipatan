import { Camera } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Dictionary } from "@/lib/i18n/dictionaries/id";
import { formatTanggalWaktuIndonesia } from "@/lib/labels";
import { GaleriGrid, type GaleriTile } from "@/components/home/galeri-grid";

export async function GaleriSection({ dict }: { dict: Dictionary }) {
  const foto = await prisma.galeriFoto.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  if (foto.length === 0) return null;

  const items: GaleriTile[] = foto.map((f, i) => ({
    id: f.id,
    caption: f.judul,
    fileUrl: f.fileUrl,
    span: i === 0 ? "sm:col-span-2 sm:row-span-2" : "",
    uploadedAtLabel: formatTanggalWaktuIndonesia(f.createdAt),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Camera className="h-5 w-5 text-emerald-700 dark:text-emerald-400" /> {dict.home.galeriTitle}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{dict.home.galeriDesc}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
            <Camera className="h-3 w-3" /> {dict.home.galeriSoon}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{dict.home.galeriKlikPerbesar}</span>
        </div>
      </div>

      <GaleriGrid items={items} />
    </section>
  );
}
