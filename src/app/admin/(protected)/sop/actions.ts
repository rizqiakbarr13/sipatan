"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStorageDriver, MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage";
import { logAdminAction } from "@/lib/audit-log";

type ActionState = { error?: string; success?: boolean };

function revalidateSop() {
  revalidatePath("/admin/sop");
  revalidatePath("/sop");
}

/** Unggah PDF SOP baru. Versi ini otomatis menjadi yang aktif (tampil di halaman publik). */
export async function uploadSopPdf(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "File PDF wajib dipilih" };
  if (file.type !== "application/pdf") return { error: "File harus berformat PDF" };
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return { error: "Ukuran file melebihi batas maksimal" };

  const judul = String(formData.get("judul") ?? "").trim() || "SOP Pengadaan Tanah";
  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await getStorageDriver().save({
    buffer,
    filename: file.name,
    contentType: file.type,
    folder: "sop",
  });

  const sop = await prisma.$transaction(async (tx) => {
    await tx.dokumenPublikasi.updateMany({
      where: { kategori: "SOP" },
      data: { published: false },
    });
    return tx.dokumenPublikasi.create({
      data: {
        judul,
        kategori: "SOP",
        fileUrl: saved.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        published: true,
        sanggahanDibuka: false,
      },
    });
  });

  await logAdminAction("CREATE", "SOP", sop.id, `Unggah PDF SOP: ${file.name}`);
  revalidateSop();
  redirect("/admin/sop?saved=created");
}

/** Jadikan salah satu versi PDF SOP sebagai yang aktif (tampil di halaman publik). */
export async function setActiveSopPdf(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const sop = await prisma.dokumenPublikasi.findFirst({ where: { id, kategori: "SOP" } });
  if (!sop) return { error: "Dokumen SOP tidak ditemukan" };

  await prisma.$transaction([
    prisma.dokumenPublikasi.updateMany({ where: { kategori: "SOP" }, data: { published: false } }),
    prisma.dokumenPublikasi.update({ where: { id }, data: { published: true } }),
  ]);
  await logAdminAction("TOGGLE", "SOP", id, `Aktifkan PDF SOP: ${sop.fileName}`);
  revalidateSop();
  return { success: true };
}

/** Hapus satu versi PDF SOP. */
export async function deleteSopPdf(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const sop = await prisma.dokumenPublikasi.findFirst({ where: { id, kategori: "SOP" } });
  if (!sop) return { error: "Dokumen SOP tidak ditemukan" };

  await prisma.dokumenPublikasi.delete({ where: { id } });
  await logAdminAction("DELETE", "SOP", id, sop.fileName);
  revalidateSop();
  return { success: true };
}
