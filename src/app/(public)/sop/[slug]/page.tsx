import Link from "next/link";
import { notFound } from "next/navigation";
import { FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function SopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sop = await prisma.sOPDoc.findUnique({ where: { slug } });

  if (!sop || !sop.published) notFound();

  const semua = await prisma.sOPDoc.findMany({
    where: { published: true },
    orderBy: { urutan: "asc" },
    select: { slug: true, judul: true, urutan: true },
  });
  const index = semua.findIndex((s) => s.slug === slug);
  const sebelumnya = index > 0 ? semua[index - 1] : null;
  const berikutnya = index >= 0 && index < semua.length - 1 ? semua[index + 1] : null;

  return (
    <div>
      <PageHeader title={sop.judul} description={`Tahap ${sop.urutan}`} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <article className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{sop.konten}</ReactMarkdown>
        </article>

        {sop.fileUrl && (
          <a
            href={sop.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <FileDown className="h-4 w-4" /> Unduh Lampiran PDF
          </a>
        )}

        <div className="mt-10 flex items-center justify-between border-t pt-6 text-sm">
          {sebelumnya ? (
            <Link href={`/sop/${sebelumnya.slug}`} className="text-emerald-700 hover:underline">
              ← {sebelumnya.judul}
            </Link>
          ) : (
            <span />
          )}
          {berikutnya ? (
            <Link href={`/sop/${berikutnya.slug}`} className="text-emerald-700 hover:underline">
              {berikutnya.judul} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
