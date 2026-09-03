"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

const TEMP_PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function generateTempPassword(length = 10): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += TEMP_PASSWORD_CHARS[Math.floor(Math.random() * TEMP_PASSWORD_CHARS.length)];
  }
  return out;
}

export async function resetPasswordWarga(id: string): Promise<{ password: string } | { error: string }> {
  await requireAdmin();

  const warga = await prisma.warga.findUnique({ where: { id } });
  if (!warga) return { error: "Akun warga tidak ditemukan" };

  const password = generateTempPassword();
  const hashed = await bcrypt.hash(password, 10);
  await prisma.warga.update({ where: { id }, data: { password: hashed } });

  revalidatePath("/admin/warga");
  return { password };
}

export async function deleteWargaAccount(id: string): Promise<{ error: string } | void> {
  await requireAdmin();

  const warga = await prisma.warga.findUnique({ where: { id } });
  if (!warga) return { error: "Akun warga tidak ditemukan" };

  await prisma.warga.delete({ where: { id } });
  revalidatePath("/admin/warga");
}
