import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DokumenForm } from "../dokumen-form";
import { updateDokumenMeta } from "../actions";
import { Badge } from "@/components/ui/badge";
import { SANGGAHAN_STATUS_BADGE_VARIANT, SANGGAHAN_STATUS_LABEL, formatTanggalIndonesia } from "@/lib/labels";

export default async function DokumenEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dokumen = await prisma.dokumenPublikasi.findUnique({
    where: { id },
    include: { sanggahan: { orderBy: { createdAt: "desc" } } },
  });
  if (!dokumen) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Dokumen Publikasi</h1>
      <DokumenForm
        dokumen={dokumen}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updateDokumenMeta(id, formData);
          return result ?? {};
        }}
      />

      <div className="mt-10 max-w-2xl">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Sanggahan Terkait ({dokumen.sanggahan.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
              <tr>
                <th className="px-4 py-2.5">Tiket</th>
                <th className="px-4 py-2.5">Nama</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {dokumen.sanggahan.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/sanggahan/${s.id}`} className="font-mono text-emerald-700 hover:underline">
                      {s.nomorTiket}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">{s.nama}</td>
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{formatTanggalIndonesia(s.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[s.status]}>
                      {SANGGAHAN_STATUS_LABEL[s.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
              {dokumen.sanggahan.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                    Belum ada sanggahan untuk dokumen ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
