import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail, resetPasswordEmail } from "@/lib/email";
import type { PasswordResetTipe } from "@prisma/client";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Buat token reset password untuk email + tipe akun tertentu (ADMIN/WARGA) dan
 * kirim link resetnya lewat email. Selalu "berhasil" tanpa membedarkan apakah
 * emailnya terdaftar atau tidak (anti email-enumeration) — pemanggil cukup
 * menampilkan pesan sukses generik ke pengguna apa pun hasilnya.
 */
export async function requestPasswordReset(
  email: string,
  tipe: PasswordResetTipe,
  resetBaseUrl: string
): Promise<void> {
  const akun =
    tipe === "ADMIN"
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.warga.findUnique({ where: { email } });

  if (!akun) return; // Diam-diam tidak melakukan apa-apa — hindari kebocoran info akun terdaftar.

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: { email, tipe, tokenHash, expiresAt },
  });

  const link = `${resetBaseUrl}?token=${token}`;
  const { subject, html } = resetPasswordEmail(link);
  await sendEmail({ to: email, subject, html });
}

export type ResetPasswordResult = { error: string } | { success: true };

/**
 * Tukar token mentah (dari link email) dengan password baru. Token hanya bisa
 * dipakai sekali dan berlaku 1 jam.
 */
export async function resetPasswordWithToken(
  token: string,
  tipe: PasswordResetTipe,
  newPassword: string
): Promise<ResetPasswordResult> {
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!resetToken || resetToken.tipe !== tipe) {
    return { error: "Tautan reset password tidak valid." };
  }
  if (resetToken.usedAt) {
    return { error: "Tautan reset password ini sudah pernah dipakai." };
  }
  if (resetToken.expiresAt < new Date()) {
    return { error: "Tautan reset password sudah kedaluwarsa. Silakan minta tautan baru." };
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  if (tipe === "ADMIN") {
    const user = await prisma.user.findUnique({ where: { email: resetToken.email } });
    if (!user) return { error: "Akun tidak ditemukan." };
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  } else {
    const warga = await prisma.warga.findUnique({ where: { email: resetToken.email } });
    if (!warga) return { error: "Akun tidak ditemukan." };
    await prisma.warga.update({ where: { id: warga.id }, data: { password: hashed } });
  }

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}
