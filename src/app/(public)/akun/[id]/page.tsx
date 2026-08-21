import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getWargaSession } from "@/lib/warga-session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { SanggahanDetailCard } from "@/components/sanggahan/sanggahan-detail-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Sanggahan",
};

export default async function AkunSanggahanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getWargaSession();
  if (!session) redirect("/akun/masuk");

  const { id } = await params;

  const sanggahan = await prisma.sanggahan.findFirst({
    where: { id, wargaId: session.id },
    include: {
      riwayat: { orderBy: { createdAt: "asc" } },
      bidang: { select: { noUrut: true, namaPemilik: true } },
      dokumen: { select: { judul: true } },
    },
  });

  if (!sanggahan) notFound();

  return (
    <div>
      <PageHeader title="Detail Sanggahan" description={sanggahan.nomorTiket} />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/akun" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Akun Saya
        </Link>
        <SanggahanDetailCard sanggahan={sanggahan} />
      </div>
    </div>
  );
}
