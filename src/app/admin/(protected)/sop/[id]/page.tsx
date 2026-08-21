import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SopForm } from "../sop-form";
import { updateSop } from "../actions";

export default async function SopEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sop = await prisma.sOPDoc.findUnique({ where: { id } });
  if (!sop) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit SOP</h1>
      <SopForm
        sop={sop}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updateSop(id, formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
