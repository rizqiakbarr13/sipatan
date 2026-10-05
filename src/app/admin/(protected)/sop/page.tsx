import { prisma } from "@/lib/prisma";
import { formatTanggalIndonesia } from "@/lib/labels";
import { SopPdfManager } from "./sop-pdf-manager";

export const dynamic = "force-dynamic";

export default async function AdminSopPage() {
  const items = await prisma.dokumenPublikasi.findMany({
    where: { kategori: "SOP" },
    orderBy: { tanggalUpload: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola SOP</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Satu PDF SOP yang tampil di halaman publik. Bisa diganti kapan saja dengan mengunggah versi baru.
        </p>
      </div>

      <SopPdfManager
        items={items.map((i) => ({
          id: i.id,
          judul: i.judul,
          fileUrl: i.fileUrl,
          fileName: i.fileName,
          fileSize: i.fileSize,
          published: i.published,
          tanggalUpload: formatTanggalIndonesia(i.tanggalUpload),
        }))}
      />
    </div>
  );
}
