import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;
export const MARGIN = 50;

const INSTANSI_NAMA = "SIPATAN — Bidang Pertanahan";
const INSTANSI_INDUK = "Dinas Perumahan & Permukiman Kota Depok";

export interface PdfFonts {
  regular: PDFFont;
  bold: PDFFont;
}

export async function newA4Document(): Promise<{ doc: PDFDocument; page: PDFPage; fonts: PdfFonts }> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  return { doc, page, fonts: { regular, bold } };
}

/** Gambar kop surat sederhana di bagian atas halaman, kembalikan posisi Y setelahnya. */
export function drawKopSurat(page: PDFPage, fonts: PdfFonts, judul: string): number {
  let y = A4_HEIGHT - MARGIN;

  page.drawText(INSTANSI_INDUK, {
    x: MARGIN,
    y,
    size: 10,
    font: fonts.regular,
    color: rgb(0.35, 0.35, 0.35),
  });
  y -= 16;
  page.drawText(INSTANSI_NAMA, {
    x: MARGIN,
    y,
    size: 14,
    font: fonts.bold,
    color: rgb(0.02, 0.36, 0.24),
  });
  y -= 10;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4_WIDTH - MARGIN, y },
    thickness: 1.5,
    color: rgb(0.02, 0.36, 0.24),
  });
  y -= 4;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.83, 0.6, 0.13),
  });
  y -= 28;

  page.drawText(judul, {
    x: MARGIN,
    y,
    size: 13,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 4;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });

  return y - 24;
}

/** Word-wrap teks manual (pdf-lib tidak punya word-wrap bawaan) — kembalikan Y setelah teks digambar. */
export function drawWrappedText(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; maxWidth: number; font: PDFFont; size?: number; lineHeight?: number; color?: ReturnType<typeof rgb> }
): number {
  const size = opts.size ?? 10;
  const lineHeight = opts.lineHeight ?? size * 1.4;
  const color = opts.color ?? rgb(0.15, 0.15, 0.15);
  const words = text.split(/\s+/).filter(Boolean);

  let line = "";
  let y = opts.y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    const width = opts.font.widthOfTextAtSize(candidate, size);
    if (width > opts.maxWidth && line) {
      page.drawText(line, { x: opts.x, y, size, font: opts.font, color });
      y -= lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) {
    page.drawText(line, { x: opts.x, y, size, font: opts.font, color });
    y -= lineHeight;
  }
  return y;
}

/** Gambar sebuah field berlabel dengan garis kosong untuk diisi tangan. */
export function drawBlankField(page: PDFPage, fonts: PdfFonts, opts: { x: number; y: number; width: number; label: string }): void {
  page.drawText(opts.label, { x: opts.x, y: opts.y, size: 9, font: fonts.regular, color: rgb(0.4, 0.4, 0.4) });
  page.drawLine({
    start: { x: opts.x, y: opts.y - 14 },
    end: { x: opts.x + opts.width, y: opts.y - 14 },
    thickness: 0.75,
    color: rgb(0.6, 0.6, 0.6),
  });
}

/** Judul rata tengah, tebal, bergaris bawah (mis. "SANGGAHAN"). */
export function drawUnderlineHeading(page: PDFPage, fonts: PdfFonts, opts: { y: number; text: string; size?: number }): number {
  const size = opts.size ?? 14;
  const width = fonts.bold.widthOfTextAtSize(opts.text, size);
  const x = (A4_WIDTH - width) / 2;
  page.drawText(opts.text, { x, y: opts.y, size, font: fonts.bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({
    start: { x, y: opts.y - 3 },
    end: { x: x + width, y: opts.y - 3 },
    thickness: 0.75,
    color: rgb(0.1, 0.1, 0.1),
  });
  return opts.y - size * 1.6;
}

/** Teks rata tengah multi-baris (word-wrap), untuk judul proyek di bawah heading utama. */
export function drawCenteredWrappedText(
  page: PDFPage,
  text: string,
  opts: { y: number; font: PDFFont; size?: number; lineHeight?: number; maxWidth?: number; color?: ReturnType<typeof rgb> }
): number {
  const size = opts.size ?? 12;
  const lineHeight = opts.lineHeight ?? size * 1.35;
  const maxWidth = opts.maxWidth ?? A4_WIDTH - MARGIN * 2;
  const color = opts.color ?? rgb(0.1, 0.1, 0.1);
  const words = text.split(/\s+/).filter(Boolean);

  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (opts.font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  let y = opts.y;
  for (const l of lines) {
    const w = opts.font.widthOfTextAtSize(l, size);
    page.drawText(l, { x: (A4_WIDTH - w) / 2, y, size, font: opts.font, color });
    y -= lineHeight;
  }
  return y;
}

/** Baris "Label :" rata kiri pada posisi kolom tetap. Bila `value` diisi, dicetak setelah titik dua (dokumen terisi); bila tidak, dibiarkan kosong untuk diisi tangan. */
export function drawColonField(
  page: PDFPage,
  fonts: PdfFonts,
  opts: { x: number; y: number; label: string; labelWidth?: number; value?: string; maxWidth?: number; size?: number; lineGap?: number }
): number {
  const size = opts.size ?? 10;
  const labelWidth = opts.labelWidth ?? 130;
  const lineGap = opts.lineGap ?? 22;
  const color = rgb(0.15, 0.15, 0.15);

  page.drawText(opts.label, { x: opts.x, y: opts.y, size, font: fonts.regular, color });
  const colonX = opts.x + labelWidth;
  page.drawText(":", { x: colonX, y: opts.y, size, font: fonts.regular, color });

  if (opts.value) {
    const valueX = colonX + 14;
    const maxWidth = opts.maxWidth ?? A4_WIDTH - MARGIN - valueX;
    const yAfter = drawWrappedText(page, opts.value, {
      x: valueX,
      y: opts.y,
      maxWidth,
      font: fonts.bold,
      size,
      lineHeight: size * 1.4,
    });
    return Math.min(yAfter, opts.y - lineGap);
  }

  return opts.y - lineGap;
}

/** Baris titik-titik kosong untuk diisi tangan (mis. isi pernyataan sanggahan). */
export function drawDotsLine(page: PDFPage, fonts: PdfFonts, opts: { x: number; y: number; width: number; size?: number }): void {
  const size = opts.size ?? 10;
  let dots = "";
  while (fonts.regular.widthOfTextAtSize(dots + "..", size) <= opts.width) {
    dots += "..";
  }
  page.drawText(dots, { x: opts.x, y: opts.y, size, font: fonts.regular, color: rgb(0.55, 0.55, 0.55) });
}

/** Gambar blok "Depok, tanggal" + label peran + garis tanda tangan + placeholder nama. Bila `tanggal` tidak diisi, tanggal dibiarkan kosong untuk diisi tangan. */
export function drawSignatureBlock(
  page: PDFPage,
  fonts: PdfFonts,
  opts: { x: number; y: number; width: number; kota: string; tanggal?: string; roleLabel: string }
): number {
  let y = opts.y;
  const rightX = opts.x + opts.width;

  const DATE_BLOCK_WIDTH = 160;
  if (opts.tanggal) {
    const dateline = `${opts.kota}, ${opts.tanggal}`;
    const datelineWidth = fonts.regular.widthOfTextAtSize(dateline, 10);
    page.drawText(dateline, { x: rightX - datelineWidth, y, size: 10, font: fonts.regular, color: rgb(0.15, 0.15, 0.15) });
  } else {
    const label = `${opts.kota}, `;
    const labelWidth = fonts.regular.widthOfTextAtSize(label, 10);
    const blockX = rightX - DATE_BLOCK_WIDTH;
    page.drawText(label, { x: blockX, y, size: 10, font: fonts.regular, color: rgb(0.15, 0.15, 0.15) });
    drawDotsLine(page, fonts, { x: blockX + labelWidth, y, width: DATE_BLOCK_WIDTH - labelWidth, size: 10 });
  }
  y -= 16;

  const roleWidth = fonts.regular.widthOfTextAtSize(opts.roleLabel, 10);
  page.drawText(opts.roleLabel, { x: rightX - roleWidth, y, size: 10, font: fonts.regular, color: rgb(0.15, 0.15, 0.15) });
  y -= 70;

  const ruleX = rightX - 160;
  page.drawLine({
    start: { x: ruleX, y },
    end: { x: rightX, y },
    thickness: 0.75,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 14;

  const placeholder = "(………………………...………)";
  const placeholderWidth = fonts.regular.widthOfTextAtSize(placeholder, 9);
  page.drawText(placeholder, {
    x: ruleX + (160 - placeholderWidth) / 2,
    y,
    size: 9,
    font: fonts.regular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return y - 10;
}

export function formatTanggalIndonesiaPdf(date: Date): string {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
