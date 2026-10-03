import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => z.email().safeParse(v).success, { message: "Format email tidak valid" }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Tautan tidak valid"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    konfirmasiPassword: z.string(),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasiPassword"],
  });
