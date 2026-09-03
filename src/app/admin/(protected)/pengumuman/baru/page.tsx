import { prisma } from "@/lib/prisma";
import { PengumumanForm } from "../pengumuman-form";
import { createPengumuman } from "../actions";

export default async function PengumumanBaruPage() {
  const [dokumenList, projectList] = await Promise.all([
    prisma.dokumenPublikasi.findMany({
      orderBy: { tanggalUpload: "desc" },
      select: { id: true, judul: true },
    }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, namaProyek: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Tambah Pengumuman</h1>
      <PengumumanForm
        dokumenList={dokumenList}
        projectList={projectList}
        action={async (_prevState, formData) => {
          "use server";
          const result = await createPengumuman(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
