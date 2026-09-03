import { prisma } from "@/lib/prisma";
import { DokumenForm } from "../dokumen-form";
import { createDokumen } from "../actions";

export default async function DokumenBaruPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, namaProyek: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Upload Dokumen Publikasi</h1>
      <DokumenForm
        projects={projects}
        action={async (_prevState, formData) => {
          "use server";
          const result = await createDokumen(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
