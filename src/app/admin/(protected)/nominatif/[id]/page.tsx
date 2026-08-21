import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BidangForm } from "../bidang-form";
import { updateBidang } from "../actions";
import { BangunanManager, TanamanManager } from "../item-manager";

export default async function BidangEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bidang = await prisma.bidang.findUnique({
    where: { id },
    include: { bangunan: true, tanaman: true },
  });
  if (!bidang) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
        Edit Bidang No. {bidang.noUrut} — {bidang.namaPemilik}
      </h1>
      <BidangForm
        bidang={bidang}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updateBidang(id, formData);
          return result ?? {};
        }}
      />

      <div className="mt-10 max-w-4xl space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Rincian Bangunan</h2>
          <BangunanManager bidangId={bidang.id} items={bidang.bangunan} />
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Rincian Tanaman</h2>
          <TanamanManager bidangId={bidang.id} items={bidang.tanaman} />
        </section>
      </div>
    </div>
  );
}
