import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProyekForm } from "../proyek-form";
import { updateProyek } from "../actions";

export default async function ProyekEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Proyek</h1>
      <ProyekForm
        project={project}
        action={async (_prevState, formData) => {
          "use server";
          return updateProyek(id, formData);
        }}
      />
    </div>
  );
}
