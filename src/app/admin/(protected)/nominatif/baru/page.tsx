import { prisma } from "@/lib/prisma";
import { BidangForm } from "../bidang-form";
import { createBidang } from "../actions";

export default async function BidangBaruPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, namaProyek: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Tambah Bidang</h1>
      <BidangForm
        projects={projects}
        action={async (_prevState, formData) => {
          "use server";
          const result = await createBidang(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
