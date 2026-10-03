"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SanggahanStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail, sanggahanStatusEmail } from "@/lib/email";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import { logAdminAction } from "@/lib/audit-log";

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

  if (sanggahan.kontakEmail && sanggahan.status !== status) {
    const { subject, html } = sanggahanStatusEmail(
      sanggahan.nomorTiket,
      SANGGAHAN_STATUS_LABEL[status] ?? status,
      catatan
    );
    await sendEmail({ to: sanggahan.kontakEmail, subject, html });
  }

  return { success: true };
}

export async function toggleTampilPublik(id: string, tampilPublik: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.sanggahan.update({ where: { id }, data: { tampilPublik } });
  await logAdminAction("TOGGLE", "Sanggahan", id, `tampilPublik=${tampilPublik}`);
  revalidatePath("/admin/sanggahan");
  revalidatePath(`/admin/sanggahan/${id}`);
}

export async function deleteSanggahan(id: string): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const sanggahan = await prisma.sanggahan.findUnique({ where: { id }, select: { nomorTiket: true, nama: true } });
  if (!sanggahan) return { error: "Sanggahan tidak ditemukan" };

  await prisma.sanggahan.delete({ where: { id } });
  await logAdminAction("DELETE", "Sanggahan", id, `${sanggahan.nomorTiket} — ${sanggahan.nama}`);

  revalidatePath("/admin/sanggahan");
  return { success: true };
}
