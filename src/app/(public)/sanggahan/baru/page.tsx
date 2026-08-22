import { prisma } from "@/lib/prisma";
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
  searchParams: Promise<{ bidangId?: string; dokumenId?: string; pengumumanId?: string }>;
}) {
  const { bidangId, dokumenId, pengumumanId } = await searchParams;

  const session = await getWargaSession();
  const { dict } = await getDictionary();

  const [bidangList, dokumenList, pengumumanList, warga] = await Promise.all([
    prisma.bidang.findMany({
      orderBy: { noUrut: "asc" },
      select: { id: true, noUrut: true, namaPemilik: true },
    }),
    prisma.dokumenPublikasi.findMany({
      where: { published: true },
      orderBy: { tanggalUpload: "desc" },
      select: { id: true, judul: true, sanggahanDibuka: true },
    }),
    prisma.pengumuman.findMany({
      where: { published: true },
      orderBy: { tanggalTerbit: "desc" },
      select: { id: true, judul: true, sanggahanDibuka: true },
    }),
    session
      ? prisma.warga.findUnique({
          where: { id: session.id },
          select: { nama: true, email: true, nik: true, noHp: true },
        })
      : null,
  ]);

  const dokumenTerkait = dokumenId ? dokumenList.find((d) => d.id === dokumenId) : undefined;
  const kanalDokumenDitutup = dokumenTerkait ? !dokumenTerkait.sanggahanDibuka : false;

  const pengumumanTerkait = pengumumanId ? pengumumanList.find((p) => p.id === pengumumanId) : undefined;
  const kanalPengumumanDitutup = pengumumanTerkait ? !pengumumanTerkait.sanggahanDibuka : false;

  return (
    <div>
      <PageHeader title={dict.sanggahanForm.pageTitle} description={dict.sanggahanForm.pageDesc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <SanggahanForm
          bidangOptions={bidangList}
          dokumenOptions={dokumenList.map((d) => ({ id: d.id, judul: d.judul }))}
          pengumumanOptions={pengumumanList
            .filter((p) => p.sanggahanDibuka)
            .map((p) => ({ id: p.id, judul: p.judul }))}
          defaultBidangId={bidangId}
          defaultDokumenId={dokumenId}
          defaultPengumumanId={pengumumanId}
          masaSanggahDitutup={kanalDokumenDitutup || kanalPengumumanDitutup}
          warga={warga}
        />
      </div>
    </div>
  );
}
