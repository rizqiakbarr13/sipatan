"use client";

import type { PdfTextItem } from "./nominatif-pdf";

export interface PdfTextPages {
  pages: PdfTextItem[][];
  /** Jumlah item teks bermakna di seluruh dokumen; 0 berarti PDF hasil scan (gambar saja). */
  textItemCount: number;
}

/**
 * Baca lapisan teks PDF langsung di browser dengan pdf.js — file tidak diunggah ke server.
 * Build "legacy" dipakai agar tetap jalan di browser lama.
 */
export async function readPdfTextInBrowser(file: File): Promise<PdfTextPages> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: PdfTextItem[][] = [];
  let textItemCount = 0;
  try {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const items = (content.items as Array<Partial<PdfTextItem>>)
        .filter((it): it is PdfTextItem => typeof it.str === "string" && Array.isArray(it.transform))
        .map((it) => ({ str: it.str, transform: it.transform }));
      textItemCount += items.filter((it) => it.str.trim()).length;
      pages.push(items);
    }
  } finally {
    await pdf.destroy();
  }
  return { pages, textItemCount };
}
