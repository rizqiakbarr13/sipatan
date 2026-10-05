"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SanggahanStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail, sanggahanStatusEmail } from "@/lib/email";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import { logAdminAction } from "@/lib/audit-log";
import { cocokkanIdentitas } from "@/lib/identitas";

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

/**
 * Verifikasi identitas pengaju (nama & NIK) terhadap data pemilik bidang.
 * Jika sesuai → DIVERIFIKASI. Jika tidak sesuai → DITOLAK otomatis (dengan
 * catatan dan email ke pengaju). Jika sanggahan tidak terkait bidang, tidak
 * ada data untuk dicocokkan sehingga langsung DIVERIFIKASI.
 */
export async function verifikasiIdentitas(id: string): Promise<{ error?: string; success?: boolean; ditolak?: boolean }> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const sanggahan = await prisma.sanggahan.findUnique({
    where: { id },
    include: { bidang: { select: { namaPemilik: true, nik: true } } },
  });
  if (!sanggahan) return { error: "Sanggahan tidak ditemukan" };
  if (sanggahan.status === "DITOLAK" || sanggahan.status === "SELESAI") {
    return { error: "Sanggahan ini sudah berstatus final" };
  }

  const hasil = cocokkanIdentitas(
    { nama: sanggahan.nama, nik: sanggahan.nik },
    sanggahan.bidang ? { namaPemilik: sanggahan.bidang.namaPemilik, nik: sanggahan.bidang.nik } : null
  );
  const ditolak = hasil.tidakSesuai;
  const statusBaru = ditolak ? "DITOLAK" : "DIVERIFIKASI";
  const catatanOtomatis = ditolak
    ? "Identitas pengaju (nama/NIK) tidak sesuai dengan data pemilik pada bidang yang disanggah."
    : null;
  const catatanFinal = catatanOtomatis ?? sanggahan.catatanAdmin;

  await prisma.$transaction([
    prisma.sanggahan.update({
      where: { id },
      data: { status: statusBaru, catatanAdmin: catatanFinal },
    }),
    prisma.sanggahanLog.create({
      data: {
        sanggahanId: id,
        statusLama: sanggahan.status,
        statusBaru,
        catatan: ditolak ? catatanOtomatis : "Identitas pengaju sesuai (verifikasi admin)",
        olehAdmin: session.user.nama,
      },
    }),
  ]);
  await logAdminAction(
    "UPDATE",
    "Sanggahan",
    id,
    `${sanggahan.nomorTiket}: verifikasi identitas → ${SANGGAHAN_STATUS_LABEL[statusBaru]}`
  );

  revalidatePath("/admin/sanggahan");
  revalidatePath(`/admin/sanggahan/${id}`);

  if (sanggahan.kontakEmail) {
    const { subject, html } = sanggahanStatusEmail(
      sanggahan.nomorTiket,
      SANGGAHAN_STATUS_LABEL[statusBaru],
      catatanFinal
    );
    await sendEmail({ to: sanggahan.kontakEmail, subject, html });
  }

  return { success: true, ditolak };
}
