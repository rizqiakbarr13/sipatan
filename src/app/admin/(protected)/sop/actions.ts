"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const sopSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  konten: z.string().min(1, "Konten wajib diisi"),
  urutan: z.coerce.number().int(),
  fileUrl: z.string().optional(),
  published: z.string().optional(),
});

export async function createSop(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = sopSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const existing = await prisma.sOPDoc.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "Slug sudah digunakan, gunakan slug lain" };

  await prisma.sOPDoc.create({
    data: {
      judul: data.judul,
      slug: data.slug,
      konten: data.konten,
      urutan: data.urutan,
      fileUrl: data.fileUrl || null,
      published: data.published === "on",
    },
  });

  revalidatePath("/admin/sop");
  revalidatePath("/sop");
  redirect("/admin/sop");
}

export async function updateSop(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = sopSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const existing = await prisma.sOPDoc.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) return { error: "Slug sudah digunakan, gunakan slug lain" };

  await prisma.sOPDoc.update({
    where: { id },
    data: {
      judul: data.judul,
      slug: data.slug,
      konten: data.konten,
      urutan: data.urutan,
      fileUrl: data.fileUrl || null,
      published: data.published === "on",
    },
  });

  revalidatePath("/admin/sop");
  revalidatePath("/sop");
  redirect("/admin/sop");
}

export async function deleteSop(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.sOPDoc.delete({ where: { id } });
  revalidatePath("/admin/sop");
  revalidatePath("/sop");
}

export async function togglePublishSop(id: string, published: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.sOPDoc.update({ where: { id }, data: { published } });
  revalidatePath("/admin/sop");
  revalidatePath("/sop");
}
