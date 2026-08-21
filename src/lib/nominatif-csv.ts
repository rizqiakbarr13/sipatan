import { z } from "zod";

export const NOMINATIF_CSV_HEADERS = [
  "noUrut",
  "noPetaBidang",
  "namaPemilik",
  "tanggalLahir",
  "pekerjaan",
  "alamat",
  "nik",
  "nib",
  "rtRw",
  "danomNo",
  "luasSesuaiAlasHak",
  "luasHasilUkur",
  "nisTerkena",
  "luasKena",
  "nisSisa",
  "luasSisa",
  "suratTandaBukti",
  "bangunanRingkas",
  "tanamanRingkas",
  "keterangan",
] as const;

function emptyToUndefined(v: unknown) {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  return trimmed === "" ? undefined : trimmed;
}

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const optionalFloat = z.preprocess((v) => {
  const s = emptyToUndefined(v);
  if (s === undefined) return undefined;
  const n = Number(String(s).replace(/,/g, "."));
  return Number.isFinite(n) ? n : NaN;
}, z.number().optional());

export const nominatifRowSchema = z.object({
  noUrut: z.preprocess(
    (v) => Number(v),
    z.number().int().positive("No. Urut wajib diisi angka positif")
  ),
  noPetaBidang: optionalString,
  namaPemilik: z.preprocess(
    (v) => emptyToUndefined(v) ?? "",
    z.string().min(1, "Nama pemilik wajib diisi")
  ),
  tanggalLahir: optionalString,
  pekerjaan: optionalString,
  alamat: optionalString,
  nik: optionalString,
  nib: optionalString,
  rtRw: optionalString,
  danomNo: optionalString,
  luasSesuaiAlasHak: optionalFloat,
  luasHasilUkur: optionalFloat,
  nisTerkena: optionalString,
  luasKena: optionalFloat,
  nisSisa: optionalString,
  luasSisa: optionalFloat,
  suratTandaBukti: optionalString,
  bangunanRingkas: optionalString,
  tanamanRingkas: optionalString,
  keterangan: optionalString,
});

export type NominatifRow = z.infer<typeof nominatifRowSchema>;

export type NominatifRowResult =
  | { line: number; ok: true; data: NominatifRow }
  | { line: number; ok: false; errors: string[]; raw: Record<string, string> };

/** Validasi satu baris hasil parse CSV (objek per-kolom) untuk import nominatif. */
export function validateNominatifRow(
  raw: Record<string, string>,
  line: number
): NominatifRowResult {
  // Baris kosong (hanya noUrut, sisanya kosong) dianggap template placeholder, dilewati oleh caller.
  const parsed = nominatifRowSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return { line, ok: false, errors, raw };
  }
  return { line, ok: true, data: parsed.data };
}

/** Baris dianggap placeholder kosong jika hanya noUrut yang terisi. */
export function isBlankTemplateRow(raw: Record<string, string>): boolean {
  return NOMINATIF_CSV_HEADERS.filter((h) => h !== "noUrut").every(
    (h) => !raw[h] || raw[h].trim() === ""
  );
}
