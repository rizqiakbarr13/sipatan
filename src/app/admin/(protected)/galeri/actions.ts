"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStorageDriver, MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const metaSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
});

export async function createGaleriFoto(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = metaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Foto wajib diunggah" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Format foto harus JPG, PNG, atau WEBP" };
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { error: "Ukuran foto melebihi batas maksimal" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await getStorageDriver().save({
    buffer,
    filename: file.name,
    contentType: file.type,
    folder: "galeri",
  });

  await prisma.galeriFoto.create({
    data: {
      judul: data.judul,
      fileUrl: saved.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      published: true,
    },
  });

  revalidatePath("/admin/galeri");
  revalidatePath("/");
  redirect("/admin/galeri?saved=created");
}

export async function updateGaleriFotoMeta(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = metaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const updateData: Record<string, unknown> = {
    judul: data.judul,
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: "Format foto harus JPG, PNG, atau WEBP" };
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return { error: "Ukuran foto melebihi batas maksimal" };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await getStorageDriver().save({
      buffer,
      filename: file.name,
      contentType: file.type,
      folder: "galeri",
    });
    updateData.fileUrl = saved.url;
    updateData.fileName = file.name;
    updateData.fileType = file.type;
    updateData.fileSize = file.size;
  }

  await prisma.galeriFoto.update({ where: { id }, data: updateData });

  revalidatePath("/admin/galeri");
  revalidatePath(`/admin/galeri/${id}`);
  revalidatePath("/");
  redirect("/admin/galeri?saved=updated");
}

export async function deleteGaleriFoto(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.galeriFoto.delete({ where: { id } });
  revalidatePath("/admin/galeri");
  revalidatePath("/");
}

export async function toggleGaleriFotoPublish(id: string, published: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.galeriFoto.update({ where: { id }, data: { published } });
  revalidatePath("/admin/galeri");
  revalidatePath("/");
}
