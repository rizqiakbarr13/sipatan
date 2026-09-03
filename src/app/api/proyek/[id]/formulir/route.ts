import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  newA4Document,
  drawUnderlineHeading,
  drawCenteredWrappedText,
  drawColonField,
  drawDotsLine,
  drawSignatureBlock,
  MARGIN,
  A4_WIDTH,
  A4_HEIGHT,
} from "@/lib/pdf";

const IDENTITAS_FIELDS = ["Nama", "NIK", "Alas Hak", "No. Danom", "No. Peta Bidang", "No. NIS"];
const JUMLAH_BARIS_ISI = 17;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  }

  const { doc, page, fonts } = await newA4Document();
  const contentWidth = A4_WIDTH - MARGIN * 2;
  let y = A4_HEIGHT - MARGIN;

  y = drawUnderlineHeading(page, fonts, { y, text: "SANGGAHAN" });
  y -= 6;
  y = drawCenteredWrappedText(page, project.namaProyek.toUpperCase(), {
    y,
    font: fonts.bold,
    size: 12,
    lineHeight: 16,
    maxWidth: contentWidth,
  });
  y -= 22;

  page.drawText("Yang bertanda tangan di bawah ini :", {
    x: MARGIN,
    y,
    size: 10,
    font: fonts.regular,
  });
  y -= 24;

  for (const label of IDENTITAS_FIELDS) {
    y = drawColonField(page, fonts, { x: MARGIN, y, label, labelWidth: 110 });
  }
  y -= 4;

  page.drawText("Menyatakan Bahwa :", { x: MARGIN, y, size: 10, font: fonts.regular });
  y -= 22;

  for (let i = 0; i < JUMLAH_BARIS_ISI; i++) {
    drawDotsLine(page, fonts, { x: MARGIN, y, width: contentWidth });
    y -= 20;
  }
  y -= 20;

  drawSignatureBlock(page, fonts, {
    x: MARGIN,
    y,
    width: contentWidth,
    kota: "Depok",
    roleLabel: "Yang Bertanda Tangan",
  });

  const bytes = await doc.save();
  const slug = project.namaProyek.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="formulir-sanggahan-${slug}.pdf"`,
    },
  });
}
