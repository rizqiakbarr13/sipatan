import { z } from "zod";

export const sanggahanFormSchema = z
  .object({
    projectId: z.string().min(1, "Pilih proyek terkait sanggahan ini"),
    nama: z.string().min(3, "Nama wajib diisi (minimal 3 karakter)"),
    nik: z
      .string()
      .trim()
      .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
    alasHak: z.string().optional(),
    noDanom: z.string().optional(),
    noPetaBidang: z.string().optional(),
    noNis: z.string().optional(),
    bidangId: z.string().optional(),
    dokumenId: z.string().optional(),
    pengumumanId: z.string().optional(),
    kontakEmail: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .refine((v) => !v || z.email().safeParse(v).success, {
        message: "Format email tidak valid",
      }),
    kontakHp: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^0\d{9,14}$/.test(v), {
        message: "Nomor HP tidak valid, contoh: 081234567890",
      }),
    isiSanggahan: z
      .string()
      .min(20, "Isi sanggahan minimal 20 karakter, jelaskan secara rinci"),
    pernyataanBenar: z
      .boolean()
      .refine((v) => v === true, "Anda harus menyatakan bahwa data yang diisi benar"),
  })
  .refine((data) => data.kontakEmail || data.kontakHp, {
    message: "Isi salah satu kontak: email atau nomor HP",
    path: ["kontakHp"],
  });

export type SanggahanFormValues = z.infer<typeof sanggahanFormSchema>;

export const buktiTambahanRowSchema = z.object({
  jenisBukti: z.string().trim().min(1, "Jenis bukti wajib diisi"),
  keterangan: z.string().trim().optional(),
});

export const buktiTambahanSchema = z.array(buktiTambahanRowSchema).max(10, "Maksimal 10 baris bukti tambahan");

export type BuktiTambahanRow = z.infer<typeof buktiTambahanRowSchema>;

export const lacakSanggahanSchema = z.object({
  nomorTiket: z.string().trim().min(1, "Nomor tiket wajib diisi"),
  nik: z.string().trim().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
});

export type LacakSanggahanValues = z.infer<typeof lacakSanggahanSchema>;
