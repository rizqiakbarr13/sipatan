import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { isMasaSanggahBerjalan } from "@/lib/masa-sanggah";
import { PageHeader } from "@/components/layout/page-header";
import { SanggahanForm } from "@/components/sanggahan/sanggahan-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ajukan Sanggahan",
};

export default async function AjukanSanggahanPage({
  searchParams,
}: {
  searchParams: Promise<{ bidangId?: string; dokumenId?: string }>;
}) {
  const { bidangId, dokumenId } = await searchParams;

  const [project, bidangList, dokumenList] = await Promise.all([
    getActiveProject(),
    prisma.bidang.findMany({
      orderBy: { noUrut: "asc" },
      select: { id: true, noUrut: true, namaPemilik: true },
    }),
    prisma.dokumenPublikasi.findMany({
      where: { published: true },
      orderBy: { tanggalUpload: "desc" },
      select: { id: true, judul: true, sanggahanDibuka: true },
    }),
  ]);

  const masaSanggahAktif = isMasaSanggahBerjalan(
    project?.masaSanggahMulai ?? null,
    project?.masaSanggahSelesai ?? null
  );

  const dokumenTerkait = dokumenId ? dokumenList.find((d) => d.id === dokumenId) : undefined;
  const kanalDokumenDitutup = dokumenTerkait ? !dokumenTerkait.sanggahanDibuka : false;

  return (
    <div>
      <PageHeader
        title="Ajukan Sanggahan"
        description="Sampaikan sanggahan atas data nominatif atau dokumen publikasi yang menurut Anda tidak sesuai."
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <SanggahanForm
          bidangOptions={bidangList}
          dokumenOptions={dokumenList.map((d) => ({ id: d.id, judul: d.judul }))}
          defaultBidangId={bidangId}
          defaultDokumenId={dokumenId}
          masaSanggahDitutup={!masaSanggahAktif || kanalDokumenDitutup}
        />
      </div>
    </div>
  );
}
