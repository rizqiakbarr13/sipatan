"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const pengumumanSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  konten: z.string().min(1, "Konten wajib diisi"),
  lampiranUrl: z.string().optional(),
  tanggalTerbit: z.string().min(1),
  published: z.string().optional(),
});

export async function createPengumuman(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = pengumumanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  await prisma.pengumuman.create({
    data: {
      judul: data.judul,
      konten: data.konten,
      lampiranUrl: data.lampiranUrl || null,
      tanggalTerbit: new Date(data.tanggalTerbit),
      published: data.published === "on",
    },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  redirect("/admin/pengumuman");
}

export async function updatePengumuman(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = pengumumanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  await prisma.pengumuman.update({
    where: { id },
    data: {
      judul: data.judul,
      konten: data.konten,
      lampiranUrl: data.lampiranUrl || null,
      tanggalTerbit: new Date(data.tanggalTerbit),
      published: data.published === "on",
    },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  redirect("/admin/pengumuman");
}

export async function deletePengumuman(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.pengumuman.delete({ where: { id } });
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}

export async function togglePublishPengumuman(id: string, published: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.pengumuman.update({ where: { id }, data: { published } });
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}
