import { NOMINATIF_CSV_HEADERS } from "./nominatif-csv";

type FieldKey = (typeof NOMINATIF_CSV_HEADERS)[number];

interface TextRun {
  x: number;
  str: string;
}

interface Line {
  y: number;
  runs: TextRun[];
}

interface Column {
  field: FieldKey | null;
  start: number;
  end: number;
}

export interface NominatifPdfExtractResult {
  rows: Record<string, string>[];
  warnings: string[];
}

const Y_TOLERANCE = 3;
const MIN_HEADER_MATCHES = 4;

function normalizeHeader(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9/ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Kamus alias label header (Bahasa Indonesia, berbagai variasi penulisan) -> nama field `NominatifRow`. */
function matchHeaderField(raw: string): FieldKey | null {
  const h = normalizeHeader(raw);
  if (!h) return null;
  const has = (s: string) => h.includes(s);

  if (h === "no" || has("urut")) return "noUrut";
  if (has("peta bidang")) return "noPetaBidang";
  if (has("danom")) return "danomNo";
  if (has("nib")) return "nib";
  if (has("nik")) return "nik";
  if (has("nama")) return "namaPemilik";
  if (has("tempat") || has("tgl lahir") || has("tanggal lahir")) return "tanggalLahir";
  if (has("pekerjaan")) return "pekerjaan";
  if (has("alamat")) return "alamat";
  if (has("rt") && has("rw")) return "rtRw";
  if (has("nis") && has("terkena")) return "nisTerkena";
  if (has("nis") && has("sisa")) return "nisSisa";
  if (has("luas") && has("sesuai")) return "luasSesuaiAlasHak";
  if (has("luas") && has("ukur")) return "luasHasilUkur";
  if (has("luas") && has("sisa")) return "luasSisa";
  if (has("luas") && (has("kena") || has("m2"))) return "luasKena";
  if (has("surat") || has("tanda bukti") || has("alas hak")) return "suratTandaBukti";
  if (has("bangunan")) return "bangunanRingkas";
  if (has("tanaman")) return "tanamanRingkas";
  if (has("keterangan")) return "keterangan";
  return null;
}

function groupIntoLines(items: Array<{ str: string; transform: number[] }>): Line[] {
  const lines: Line[] = [];
  for (const item of items) {
    const str = item.str;
    if (!str || !str.trim()) continue;
    const x = item.transform[4];
    const y = item.transform[5];
    let line = lines.find((l) => Math.abs(l.y - y) <= Y_TOLERANCE);
    if (!line) {
      line = { y, runs: [] };
      lines.push(line);
    }
    line.runs.push({ x, str });
  }
  lines.sort((a, b) => b.y - a.y);
  for (const line of lines) line.runs.sort((a, b) => a.x - b.x);
  return lines;
}

function tryDetectHeader(line: Line, unknownHeaders: Set<string>): Column[] | null {
  const matches = line.runs.map((r) => matchHeaderField(r.str));
  const matchedCount = matches.filter((m) => m !== null).length;
  if (matchedCount < MIN_HEADER_MATCHES || matchedCount < line.runs.length * 0.5) return null;

  matches.forEach((m, i) => {
    if (!m) unknownHeaders.add(line.runs[i].str.trim());
  });

  return line.runs.map((r, i) => ({
    field: matches[i],
    start: r.x - 2,
    end: i + 1 < line.runs.length ? line.runs[i + 1].x - 2 : Number.POSITIVE_INFINITY,
  }));
}

function lineToRecord(line: Line, columns: Column[]): Record<string, string> {
  const cells = new Map<number, string[]>();
  for (const run of line.runs) {
    let colIndex = columns.findIndex((c) => run.x >= c.start && run.x < c.end);
    if (colIndex === -1) colIndex = columns.length - 1;
    const arr = cells.get(colIndex) ?? [];
    arr.push(run.str);
    cells.set(colIndex, arr);
  }

  const record: Record<string, string> = {};
  columns.forEach((col, i) => {
    if (!col.field) return;
    const text = (cells.get(i) ?? []).join(" ").trim();
    if (!text) return;
    record[col.field] = record[col.field] ? `${record[col.field]} ${text}` : text;
  });
  return record;
}

/**
 * Strategi 2: dokumen "PIHAK YANG BERHAK" bergaya blok berlabel per bidang — umum pada
 * formulir resmi BPN/dinas yang di-scan lalu di-OCR (bukan tabel grid rapi seperti strategi
 * 1). Setiap bidang berupa blok multi-baris dengan sub-label "a. Nama :", "b. Tanggal lahir :",
 * "c. Pekerjaan :", "d. Alamat :", "e. NIK/No. KTP :" (identitas pemilik) dan "a. RT/RW :",
 * "b. Kelurahan :", "c. Kecamatan :" (letak). Blok baru ditandai baris yang diawali dua angka
 * (No. Urut + No. Urut di Peta Bidang) diikuti "a. Nama". Karena berasal dari OCR, label dicocokkan
 * secara longgar (toleran salah eja/kapitalisasi) dan hanya field identitas yang diekstrak —
 * kolom tanah/bangunan/tanaman pada tabel lebar di sebelahnya TIDAK diekstrak (posisinya terlalu
 * tidak presisi akibat OCR untuk dipetakan dengan andal) dan harus dilengkapi manual.
 */
interface LabelMarker {
  field: string;
  re: RegExp;
}

// Prefiks huruf label (a./b./c./d./e.) sendiri sering salah-OCR jadi huruf lain (mis. "a." jadi
// "s."), jadi TIDAK dipakai sebagai penanda — hanya kata labelnya (yang relatif lebih stabil
// dibaca OCR) yang dicocokkan secara longgar.
const RECORD_START_RE = /(\d{1,4})\s+(\d{1,4})\s+[a-z]{0,2}[.,]?\s*Nama\s*:?/i;
const LABEL_MARKERS: LabelMarker[] = [
  { field: "namaPemilik", re: /\bNama\s*:?/i },
  { field: "tanggalLahir", re: /\bTan\w{0,4}\s*lah\w{0,3}\s*:?/i },
  { field: "pekerjaan", re: /\bPeke\w{0,4}aan\s*:?/i },
  { field: "alamat", re: /\bA[l!1]a?mat\s*:?/i },
  { field: "nik", re: /\bNIK\s*\/?\s*No\.?\s*KTP\s*:?/i },
  { field: "rtRw", re: /\bR[TUVYtuvy][\/IiLl]?R[Ww]\b\s*:?/ },
  { field: "letakKelurahan", re: /\bKe[a-z]{0,3}rahan\s*:?/i },
  { field: "letakKecamatan", re: /\bKec[a-z]{0,4}tan\s*:?/i },
];
const SURAT_TANDA_BUKTI_RE = /\b(SHM|SHGB|SHP|SHGU|AJB|GS)\.?\s*No\.?\s*[\w./-]+/i;
const MAX_FIELD_VALUE_LENGTH = 150;

function cleanFieldValue(raw: string): string {
  let value = raw.replace(/^[:\s]+/, "").trim().slice(0, MAX_FIELD_VALUE_LENGTH);
  // Buang sisa penanda huruf label berikutnya yang tidak tertangkap sebagai marker
  // (mis. "Gang s." / "Wlraswasta c.") — hampir selalu sisa "a./b./c./d./e." yang
  // menempel di ujung nilai karena huruf itu sendiri salah-OCR.
  value = value.replace(/\s+[a-eA-E][.,]?$/, "").trim();
  value = value.replace(/^[.,]+|[.,]+$/g, "").trim();
  return value;
}

function extractLabeledBlockRows(pagesLines: Line[][]): { rows: Record<string, string>[]; recordCount: number } {
  const rows: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;
  let currentRaw = "";
  let lastField: string | null = null;

  function finishCurrent() {
    if (!current) return;
    const suratMatch = currentRaw.match(SURAT_TANDA_BUKTI_RE);
    if (suratMatch && !current.suratTandaBukti) {
      current.suratTandaBukti = cleanFieldValue(suratMatch[0]);
    }
    rows.push(current);
  }

  for (const lines of pagesLines) {
    for (const line of lines) {
      let text = line.runs.map((r) => r.str).join(" ").replace(/\s+/g, " ").trim();
      if (!text) continue;

      const startMatch = text.match(RECORD_START_RE);
      if (startMatch && startMatch.index !== undefined) {
        finishCurrent();
        current = { noUrut: startMatch[1], noPetaBidang: startMatch[2] };
        currentRaw = "";
        lastField = null;
        // Keep an "a. Nama :" marker at the front so the normal marker-scan below still
        // picks up the owner's name as the value that follows it.
        text = "a. Nama :" + text.slice(startMatch.index + startMatch[0].length);
      }

      if (!current) continue;
      currentRaw += ` ${text}`;

      const found: { field: string; start: number; end: number }[] = [];
      for (const marker of LABEL_MARKERS) {
        const re = new RegExp(marker.re.source, marker.re.flags.includes("g") ? marker.re.flags : marker.re.flags + "g");
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          found.push({ field: marker.field, start: m.index, end: m.index + m[0].length });
        }
      }
      found.sort((a, b) => a.start - b.start);

      if (found.length === 0) {
        // Baris lanjutan tanpa label (mis. sambungan alamat multi-baris) — gabung ke field terakhir.
        if (lastField && /^:/.test(text.trim())) {
          const val = cleanFieldValue(text);
          if (val) {
            current[lastField] = current[lastField] ? `${current[lastField]}, ${val}` : val;
          }
        }
        continue;
      }

      for (let i = 0; i < found.length; i++) {
        const seg = found[i];
        const valueStart = seg.end;
        const valueEnd = i + 1 < found.length ? found[i + 1].start : text.length;
        const value = cleanFieldValue(text.slice(valueStart, valueEnd));
        if (!value) {
          lastField = seg.field;
          continue;
        }
        if (seg.field === "namaPemilik") {
          current.namaPemilik = current.namaPemilik ? `${current.namaPemilik}; ${value}` : value;
        } else if (!current[seg.field]) {
          current[seg.field] = value;
        }
        lastField = seg.field;
      }
    }
  }
  finishCurrent();

  return { rows, recordCount: rows.length };
}

/**
 * Ekstrak baris tabel "Daftar Nominatif" dari PDF berbasis posisi teks (bukan OCR gambar).
 * Strategi 1 (utama): cari baris header (kecocokan label kolom >= 4), gunakan posisi-x tiap
 * label header sebagai batas kolom, lalu petakan setiap baris berikutnya ke kolom terdekat.
 * Baris tanpa "No. Urut" numerik dianggap sambungan (wrap) baris sebelumnya dan digabung.
 * Strategi 2 (fallback): dokumen blok berlabel "PIHAK YANG BERHAK" (lihat `extractLabeledBlockRows`),
 * dicoba bila strategi 1 tidak menemukan baris sama sekali. Hasil SELALU harus melalui
 * preview+konfirmasi manual sebelum disimpan — kedua strategi bersifat best-effort, bukan OCR
 * yang presisi.
 */
export async function extractNominatifRowsFromPdf(buffer: Buffer): Promise<NominatifPdfExtractResult> {
  const pdfjsLib = await import(/* webpackIgnore: true */ "pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  const warnings: string[] = [];
  const unknownHeaders = new Set<string>();
  const rows: Record<string, string>[] = [];
  const pagesLines: Line[][] = [];

  let columns: Column[] | null = null;
  let lastRow: Record<string, string> | null = null;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = groupIntoLines(content.items as Array<{ str: string; transform: number[] }>);
    pagesLines.push(lines);

    for (const line of lines) {
      const detected = tryDetectHeader(line, unknownHeaders);
      if (detected) {
        columns = detected;
        lastRow = null;
        continue;
      }
      if (!columns) continue;

      const record = lineToRecord(line, columns);
      const noUrutText = record.noUrut;

      if (noUrutText && /^\d+$/.test(noUrutText)) {
        rows.push(record);
        lastRow = record;
      } else if (lastRow) {
        for (const [field, text] of Object.entries(record)) {
          if (!text) continue;
          lastRow[field] = lastRow[field] ? `${lastRow[field]} ${text}` : text;
        }
      }
    }
  }

  if (rows.length === 0) {
    const labeled = extractLabeledBlockRows(pagesLines);
    if (labeled.rows.length > 0) {
      rows.push(...labeled.rows);
      warnings.push(
        "PDF ini terdeteksi memakai format blok berlabel per bidang (mis. hasil scan/OCR), bukan tabel grid biasa. " +
          "Hanya data identitas (No. Urut, Nama, NIK, Tanggal Lahir, Pekerjaan, Alamat, RT/RW, Kelurahan, Kecamatan) " +
          "yang berhasil diekstrak otomatis — data tanah/bangunan/tanaman/keterangan TIDAK diekstrak dan harus " +
          "dilengkapi manual per bidang setelah import. Karena berasal dari OCR, periksa kembali ejaan nama/alamat " +
          "sebelum konfirmasi."
      );
    }
  }

  if (unknownHeaders.size > 0) {
    warnings.push(`Kolom header tidak dikenali (diabaikan): ${Array.from(unknownHeaders).join(", ")}`);
  }
  if (rows.length === 0) {
    warnings.push(
      "Tidak ada baris data yang berhasil dikenali. Pastikan PDF berisi tabel dengan baris header kolom yang jelas (No, Nama, NIK, dst)."
    );
  }

  return { rows, warnings };
}
