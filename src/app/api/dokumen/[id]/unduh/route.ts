import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const dokumen = await prisma.dokumenPublikasi.findUnique({ where: { id } });
  if (!dokumen || !dokumen.published) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
  }

  await prisma.dokumenPublikasi.update({
    where: { id },
    data: { jumlahUnduhan: { increment: 1 } },
  });

  return NextResponse.redirect(new URL(dokumen.fileUrl, request.url));
}
