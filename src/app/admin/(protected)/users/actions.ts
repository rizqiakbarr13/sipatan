"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Hanya Super Admin yang dapat mengelola akun user");
  }
  return session;
}

const createUserSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(Role),
});

export async function createUser(formData: FormData) {
  await requireSuperAdmin();

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: "Email sudah digunakan" };

  const hashed = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: { nama: data.nama, email: data.email, password: hashed, role: data.role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=created");
}

const updateUserSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  role: z.enum(Role),
  password: z.string().optional(),
});

export async function updateUser(id: string, formData: FormData) {
  await requireSuperAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateUserSchema.safeParse({
    nama: raw.nama,
    role: raw.role,
    password: raw.password || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  if (data.password && data.password.length < 8) {
    return { error: "Password minimal 8 karakter" };
  }

  await prisma.user.update({
    where: { id },
    data: {
      nama: data.nama,
      role: data.role,
      ...(data.password ? { password: await bcrypt.hash(data.password, 10) } : {}),
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=updated");
}

export async function deleteUser(id: string) {
  const session = await requireSuperAdmin();

  if (session.user.id === id) {
    return { error: "Anda tidak dapat menghapus akun Anda sendiri" };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
