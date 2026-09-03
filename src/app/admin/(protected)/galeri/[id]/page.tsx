import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GaleriForm } from "../galeri-form";
import { updateGaleriFotoMeta } from "../actions";

export default async function GaleriEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const foto = await prisma.galeriFoto.findUnique({ where: { id } });
  if (!foto) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Foto Galeri</h1>
      <GaleriForm
        foto={foto}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updateGaleriFotoMeta(id, formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
