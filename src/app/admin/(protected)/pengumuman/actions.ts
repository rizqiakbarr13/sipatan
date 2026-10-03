"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logAdminAction } from "@/lib/audit-log";

const pengumumanSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  konten: z.string().min(1, "Konten wajib diisi"),
  lampiranUrl: z.string().optional(),
  tanggalTerbit: z.string().min(1),
  published: z.string().optional(),
  projectId: z.string().optional(),
  dokumenTerkaitId: z.string().optional(),
  linkDataNominatif: z.string().optional(),
});

export async function createPengumuman(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = pengumumanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const pengumuman = await prisma.pengumuman.create({
    data: {
      judul: data.judul,
      konten: data.konten,
      lampiranUrl: data.lampiranUrl || null,
      tanggalTerbit: new Date(data.tanggalTerbit),
      published: data.published === "on",
      projectId: data.projectId || null,
      dokumenTerkaitId: data.dokumenTerkaitId || null,
      linkDataNominatif: data.linkDataNominatif === "on",
    },
  });
  await logAdminAction("CREATE", "Pengumuman", pengumuman.id, pengumuman.judul);

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  redirect("/admin/pengumuman?saved=created");
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
      projectId: data.projectId || null,
      dokumenTerkaitId: data.dokumenTerkaitId || null,
      linkDataNominatif: data.linkDataNominatif === "on",
    },
  });
  await logAdminAction("UPDATE", "Pengumuman", id, data.judul);

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  redirect("/admin/pengumuman?saved=updated");
}

export async function deletePengumuman(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const pengumuman = await prisma.pengumuman.findUnique({ where: { id }, select: { judul: true } });
  await prisma.pengumuman.delete({ where: { id } });
  await logAdminAction("DELETE", "Pengumuman", id, pengumuman?.judul);
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}

export async function togglePublishPengumuman(id: string, published: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.pengumuman.update({ where: { id }, data: { published } });
  await logAdminAction("TOGGLE", "Pengumuman", id, `published=${published}`);
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}

export async function toggleSanggahanDibukaPengumuman(id: string, dibuka: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.pengumuman.update({ where: { id }, data: { sanggahanDibuka: dibuka } });
  await logAdminAction("TOGGLE", "Pengumuman", id, `sanggahanDibuka=${dibuka}`);
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}
