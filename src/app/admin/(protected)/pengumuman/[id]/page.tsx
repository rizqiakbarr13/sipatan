import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PengumumanForm } from "../pengumuman-form";
import { updatePengumuman } from "../actions";

export default async function PengumumanEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pengumuman = await prisma.pengumuman.findUnique({ where: { id } });
  if (!pengumuman) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Pengumuman</h1>
      <PengumumanForm
        pengumuman={pengumuman}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updatePengumuman(id, formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
