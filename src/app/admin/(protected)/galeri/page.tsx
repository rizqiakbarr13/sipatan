import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTanggalIndonesia, formatUkuranFile } from "@/lib/labels";
import { Pagination, resolvePage } from "@/components/pagination";
import { GaleriRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);
  const [list, total] = await Promise.all([
    prisma.galeriFoto.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.galeriFoto.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Galeri Kegiatan</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {total} foto. Foto yang dipublikasikan akan tampil di Galeri Kegiatan pada halaman Beranda publik.
          </p>
        </div>
        <Link href="/admin/galeri/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Unggah Foto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Caption</th>
              <th className="px-4 py-3">Diunggah</th>
              <th className="px-4 py-3">Ukuran</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {list.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3">
                  <Image
                    src={f.fileUrl}
                    alt={f.judul}
                    width={80}
                    height={56}
                    className="h-14 w-20 rounded-md object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{f.judul}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatTanggalIndonesia(f.createdAt)}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatUkuranFile(f.fileSize)}</td>
                <td className="px-4 py-3">
                  <GaleriRowActions id={f.id} published={f.published} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/galeri/${f.id}`} className="text-emerald-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada foto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/galeri" searchParams={{}} />
    </div>
  );
}
