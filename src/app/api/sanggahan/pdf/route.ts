import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { SANGGAHAN_STATUS_LABEL, formatTanggalWaktuIndonesia } from "@/lib/labels";
import {
  newA4Document,
  drawUnderlineHeading,
  drawCenteredWrappedText,
  drawColonField,
  drawWrappedText,
  drawSignatureBlock,
  formatTanggalIndonesiaPdf,
  MARGIN,
  A4_WIDTH,
  A4_HEIGHT,
} from "@/lib/pdf";

export async function GET(request: NextRequest) {
  const ip = await getClientIp();
  if (isRateLimited(`bukti-sanggahan-pdf:${ip}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Silakan coba lagi nanti." }, { status: 429 });
  }

  const tiket = request.nextUrl.searchParams.get("tiket")?.trim();
  const nik = request.nextUrl.searchParams.get("nik")?.trim();
  if (!tiket || !nik) {
    return NextResponse.json({ error: "Nomor tiket dan NIK wajib diisi" }, { status: 400 });
  }

  const sanggahan = await prisma.sanggahan.findFirst({
    where: { nomorTiket: tiket, nik },
    include: {
      project: { select: { namaProyek: true, nomorPeng: true } },
      lampiran: { orderBy: { createdAt: "asc" } },
      buktiTambahan: { orderBy: { urutan: "asc" } },
    },
  });
  if (!sanggahan) {
    return NextResponse.json({ error: "Sanggahan tidak ditemukan" }, { status: 404 });
  }

  const { doc, page, fonts } = await newA4Document();
  const contentWidth = A4_WIDTH - MARGIN * 2;
  let y = A4_HEIGHT - MARGIN;

  y = drawUnderlineHeading(page, fonts, { y, text: "BUKTI PENGAJUAN SANGGAHAN" });
  y -= 6;
  y = drawCenteredWrappedText(page, sanggahan.project.namaProyek.toUpperCase(), {
    y,
    font: fonts.bold,
    size: 12,
    lineHeight: 16,
    maxWidth: contentWidth,
  });
  y -= 22;

  const rows: [string, string][] = [
    ["Nomor Tiket", sanggahan.nomorTiket],
    ["Nomor Pengumuman", sanggahan.project.nomorPeng],
    ["Tanggal Diajukan", formatTanggalWaktuIndonesia(sanggahan.createdAt)],
    ["Status Saat Ini", SANGGAHAN_STATUS_LABEL[sanggahan.status] ?? sanggahan.status],
    ["Nama", sanggahan.nama],
    ["NIK", sanggahan.nik],
    ["Alas Hak", sanggahan.alasHak || "-"],
    ["No. Danom", sanggahan.noDanom || "-"],
    ["No. Peta Bidang", sanggahan.noPetaBidang || "-"],
    ["No. NIS", sanggahan.noNis || "-"],
  ];

  for (const [label, value] of rows) {
    y = drawColonField(page, fonts, { x: MARGIN, y, label, labelWidth: 130, value, lineGap: 18 });
  }

  y -= 10;
  page.drawText("Menyatakan Bahwa :", { x: MARGIN, y, size: 10, font: fonts.regular });
  y -= 16;
  y = drawWrappedText(page, sanggahan.isiSanggahan, {
    x: MARGIN,
    y,
    maxWidth: contentWidth,
    font: fonts.regular,
    size: 10,
  });

  if (sanggahan.lampiran.length > 0 || sanggahan.buktiTambahan.length > 0) {
    y -= 14;
    page.drawText("Lampiran Bukti :", { x: MARGIN, y, size: 10, font: fonts.regular });
    y -= 16;

    for (const file of sanggahan.lampiran) {
      y = drawWrappedText(page, `- ${file.fileName}`, {
        x: MARGIN,
        y,
        maxWidth: contentWidth,
        font: fonts.regular,
        size: 9,
        lineHeight: 13,
      });
    }
    for (const bukti of sanggahan.buktiTambahan) {
      const text = bukti.keterangan ? `- ${bukti.jenisBukti}: ${bukti.keterangan}` : `- ${bukti.jenisBukti}`;
      y = drawWrappedText(page, text, {
        x: MARGIN,
        y,
        maxWidth: contentWidth,
        font: fonts.regular,
        size: 9,
        lineHeight: 13,
      });
    }
  }

  y -= 30;
  drawSignatureBlock(page, fonts, {
    x: MARGIN,
    y,
    width: contentWidth,
    kota: "Depok",
    tanggal: formatTanggalIndonesiaPdf(new Date()),
    roleLabel: "Petugas Penerima,",
  });

  const bytes = await doc.save();

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bukti-sanggahan-${sanggahan.nomorTiket}.pdf"`,
    },
  });
}
