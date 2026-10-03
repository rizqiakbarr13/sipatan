"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { KategoriDokumen } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStorageDriver, MAX_UPLOAD_SIZE_BYTES, ALLOWED_UPLOAD_TYPES } from "@/lib/storage";
import { logAdminAction } from "@/lib/audit-log";

const metaSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  kategori: z.enum(KategoriDokumen),
  projectId: z.string().optional(),
  deskripsi: z.string().optional(),
  nomorSurat: z.string().optional(),
  tanggalDokumen: z.string().optional(),
});

export async function createDokumen(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = metaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File dokumen wajib diunggah" };
  }
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    return { error: "Format file harus PDF, JPG, PNG, atau WEBP" };
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { error: "Ukuran file melebihi batas maksimal" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await getStorageDriver().save({
    buffer,
    filename: file.name,
    contentType: file.type,
    folder: "dokumen",
  });

  const dokumen = await prisma.dokumenPublikasi.create({
    data: {
      judul: data.judul,
      kategori: data.kategori,
      deskripsi: data.deskripsi || null,
      nomorSurat: data.nomorSurat || null,
      tanggalDokumen: data.tanggalDokumen ? new Date(data.tanggalDokumen) : null,
      fileUrl: saved.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      projectId: data.projectId || null,
      published: true,
      sanggahanDibuka: true,
    },
  });
  await logAdminAction("CREATE", "Dokumen Publikasi", dokumen.id, dokumen.judul);

  revalidatePath("/admin/dokumen");
  revalidatePath("/dokumen");
  redirect("/admin/dokumen?saved=created");
}

export async function updateDokumenMeta(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = metaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const updateData: Record<string, unknown> = {
    judul: data.judul,
    kategori: data.kategori,
    projectId: data.projectId || null,
    deskripsi: data.deskripsi || null,
    nomorSurat: data.nomorSurat || null,
    tanggalDokumen: data.tanggalDokumen ? new Date(data.tanggalDokumen) : null,
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      return { error: "Format file harus PDF, JPG, PNG, atau WEBP" };
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return { error: "Ukuran file melebihi batas maksimal" };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await getStorageDriver().save({
      buffer,
      filename: file.name,
      contentType: file.type,
      folder: "dokumen",
    });
    updateData.fileUrl = saved.url;
    updateData.fileName = file.name;
    updateData.fileType = file.type;
    updateData.fileSize = file.size;
  }

  await prisma.dokumenPublikasi.update({ where: { id }, data: updateData });
  await logAdminAction("UPDATE", "Dokumen Publikasi", id, data.judul);

  revalidatePath("/admin/dokumen");
  revalidatePath(`/admin/dokumen/${id}`);
  revalidatePath("/dokumen");
  revalidatePath(`/dokumen/${id}`);
  redirect("/admin/dokumen?saved=updated");
}

export async function deleteDokumen(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const dokumen = await prisma.dokumenPublikasi.findUnique({ where: { id }, select: { judul: true } });
  await prisma.dokumenPublikasi.delete({ where: { id } });
  await logAdminAction("DELETE", "Dokumen Publikasi", id, dokumen?.judul);
  revalidatePath("/admin/dokumen");
  revalidatePath("/dokumen");
}

export async function togglePublishDokumen(id: string, published: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.dokumenPublikasi.update({ where: { id }, data: { published } });
  await logAdminAction("TOGGLE", "Dokumen Publikasi", id, `published=${published}`);
  revalidatePath("/admin/dokumen");
  revalidatePath("/dokumen");
}

export async function toggleSanggahanDibuka(id: string, dibuka: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.dokumenPublikasi.update({ where: { id }, data: { sanggahanDibuka: dibuka } });
  await logAdminAction("TOGGLE", "Dokumen Publikasi", id, `sanggahanDibuka=${dibuka}`);
  revalidatePath("/admin/dokumen");
  revalidatePath(`/dokumen/${id}`);
}
