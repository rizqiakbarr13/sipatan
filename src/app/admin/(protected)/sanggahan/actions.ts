"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SanggahanStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const updateStatusSchema = z.object({
  status: z.enum(SanggahanStatus),
  catatan: z.string().optional(),
});

export async function updateSanggahanStatus(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = updateStatusSchema.safeParse({
    status: formData.get("status"),
    catatan: formData.get("catatan") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const { status, catatan } = parsed.data;

  const sanggahan = await prisma.sanggahan.findUnique({ where: { id } });
  if (!sanggahan) return { error: "Sanggahan tidak ditemukan" };

  await prisma.$transaction([
    prisma.sanggahan.update({
      where: { id },
      data: {
        status,
        catatanAdmin: catatan || sanggahan.catatanAdmin,
      },
    }),
    prisma.sanggahanLog.create({
      data: {
        sanggahanId: id,
        statusLama: sanggahan.status,
        statusBaru: status,
        catatan: catatan || null,
        olehAdmin: session.user.nama,
      },
    }),
  ]);

  revalidatePath("/admin/sanggahan");
  revalidatePath(`/admin/sanggahan/${id}`);
  return { success: true };
}

export async function toggleTampilPublik(id: string, tampilPublik: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.sanggahan.update({ where: { id }, data: { tampilPublik } });
  revalidatePath("/admin/sanggahan");
  revalidatePath(`/admin/sanggahan/${id}`);
}
