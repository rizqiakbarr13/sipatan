import { prisma } from "@/lib/prisma";
import { getActiveProject } from "@/lib/project";
import { isMasaSanggahBerjalan } from "@/lib/masa-sanggah";
import { getWargaSession } from "@/lib/warga-session";
import { getDictionary } from "@/lib/i18n/server";
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

  const session = await getWargaSession();
  const { dict } = await getDictionary();

  const [project, bidangList, dokumenList, warga] = await Promise.all([
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
    session
      ? prisma.warga.findUnique({
          where: { id: session.id },
          select: { nama: true, email: true, nik: true, noHp: true },
        })
      : null,
  ]);

  const masaSanggahAktif = isMasaSanggahBerjalan(
    project?.masaSanggahMulai ?? null,
    project?.masaSanggahSelesai ?? null
  );

  const dokumenTerkait = dokumenId ? dokumenList.find((d) => d.id === dokumenId) : undefined;
  const kanalDokumenDitutup = dokumenTerkait ? !dokumenTerkait.sanggahanDibuka : false;

  return (
    <div>
      <PageHeader title={dict.sanggahanForm.pageTitle} description={dict.sanggahanForm.pageDesc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <SanggahanForm
          bidangOptions={bidangList}
          dokumenOptions={dokumenList.map((d) => ({ id: d.id, judul: d.judul }))}
          defaultBidangId={bidangId}
          defaultDokumenId={dokumenId}
          masaSanggahDitutup={!masaSanggahAktif || kanalDokumenDitutup}
          warga={warga}
        />
      </div>
    </div>
  );
}
