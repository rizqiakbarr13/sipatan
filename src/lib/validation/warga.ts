import { z } from "zod";

export const registerWargaSchema = z
  .object({
    nama: z.string().trim().min(3, "Nama wajib diisi (minimal 3 karakter)"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine((v) => z.email().safeParse(v).success, { message: "Format email tidak valid" }),
    nik: z
      .string()
      .trim()
      .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
    noHp: z
      .string()
      .trim()
      .regex(/^0\d{9,14}$/, "Nomor HP tidak valid, contoh: 081234567890"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    konfirmasiPassword: z.string(),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasiPassword"],
  });

export type RegisterWargaValues = z.infer<typeof registerWargaSchema>;

export const loginWargaSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => z.email().safeParse(v).success, { message: "Format email tidak valid" }),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type LoginWargaValues = z.infer<typeof loginWargaSchema>;
