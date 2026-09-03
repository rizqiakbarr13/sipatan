import { redirect } from "next/navigation";
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
  searchParams: Promise<{ projectId?: string; bidangId?: string; dokumenId?: string; pengumumanId?: string }>;
}) {
  const { projectId, bidangId, dokumenId, pengumumanId } = await searchParams;

  const session = await getWargaSession();
  if (!session) {
    const params = new URLSearchParams();
    if (projectId) params.set("projectId", projectId);
    if (bidangId) params.set("bidangId", bidangId);
    if (dokumenId) params.set("dokumenId", dokumenId);
    if (pengumumanId) params.set("pengumumanId", pengumumanId);
    const query = params.toString();
    redirect(`/akun/masuk?next=${encodeURIComponent(`/sanggahan/baru${query ? `?${query}` : ""}`)}`);
  }
  const { dict } = await getDictionary();

  const [projects, bidangList, dokumenList, pengumumanList, warga] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, namaProyek: true, masaSanggahSelesai: true },
    }),
    prisma.bidang.findMany({
      orderBy: { noUrut: "asc" },
      select: { id: true, projectId: true, noUrut: true, namaPemilik: true },
    }),
    prisma.dokumenPublikasi.findMany({
      where: { published: true },
      orderBy: { tanggalUpload: "desc" },
      select: { id: true, projectId: true, judul: true, sanggahanDibuka: true },
    }),
    prisma.pengumuman.findMany({
      where: { published: true },
      orderBy: { tanggalTerbit: "desc" },
      select: { id: true, projectId: true, judul: true, sanggahanDibuka: true },
    }),
    prisma.warga.findUnique({
      where: { id: session.id },
      select: { nama: true, email: true, nik: true, noHp: true },
    }),
  ]);

  if (!warga) {
    redirect("/akun/masuk");
  }

  const dokumenTerkait = dokumenId ? dokumenList.find((d) => d.id === dokumenId) : undefined;
  const kanalDokumenDitutup = dokumenTerkait ? !dokumenTerkait.sanggahanDibuka : false;

  const pengumumanTerkait = pengumumanId ? pengumumanList.find((p) => p.id === pengumumanId) : undefined;
  const kanalPengumumanDitutup = pengumumanTerkait ? !pengumumanTerkait.sanggahanDibuka : false;

  const bidangTerkait = bidangId ? bidangList.find((b) => b.id === bidangId) : undefined;

  // Resolve default project from whichever entity was deep-linked, so the
  // cascading selects in the form arrive already scoped correctly.
  const resolvedProjectId =
    projectId ?? bidangTerkait?.projectId ?? dokumenTerkait?.projectId ?? pengumumanTerkait?.projectId ?? undefined;

  return (
    <div>
      <PageHeader title={dict.sanggahanForm.pageTitle} description={dict.sanggahanForm.pageDesc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <SanggahanForm
          projects={projects}
          bidangOptions={bidangList}
          dokumenOptions={dokumenList.map((d) => ({ id: d.id, projectId: d.projectId, judul: d.judul }))}
          pengumumanOptions={pengumumanList
            .filter((p) => p.sanggahanDibuka)
            .map((p) => ({ id: p.id, projectId: p.projectId, judul: p.judul }))}
          defaultProjectId={resolvedProjectId}
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
