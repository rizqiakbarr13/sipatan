"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getMasaSanggahRange } from "@/lib/date-utils";
import { logAdminAction } from "@/lib/audit-log";

const proyekSchema = z
  .object({
    namaProyek: z.string().min(1, "Nama proyek wajib diisi"),
    nomorPeng: z.string().min(1, "Nomor pengumuman wajib diisi"),
    tanggalPeng: z.string().min(1, "Tanggal pengumuman wajib diisi"),
    kelurahan: z.string().min(1),
    kecamatan: z.string().min(1),
    kota: z.string().min(1),
    provinsi: z.string().min(1),
    deskripsi: z.string().optional(),
    // Opsional: jika diisi, menggantikan perhitungan otomatis (14 hari sejak
    // tanggal pengumuman) — ini yang dipakai admin untuk memperpanjang masa
    // sanggah. Dikosongkan → fallback ke perhitungan otomatis.
    masaSanggahSelesai: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.masaSanggahSelesai ||
      new Date(data.masaSanggahSelesai).getTime() >= new Date(data.tanggalPeng).getTime(),
    {
      message: "Tanggal akhir masa sanggah tidak boleh sebelum tanggal pengumuman",
      path: ["masaSanggahSelesai"],
    }
  );

type ActionState = { error?: string; success?: boolean };

export async function createProyek(formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = proyekSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const tanggalPeng = new Date(data.tanggalPeng);
  const { mulai, selesai: selesaiDefault } = getMasaSanggahRange(tanggalPeng);
  const selesai = data.masaSanggahSelesai ? new Date(data.masaSanggahSelesai) : selesaiDefault;

  const proyek = await prisma.project.create({
    data: {
      namaProyek: data.namaProyek,
      nomorPeng: data.nomorPeng,
      tanggalPeng,
      kelurahan: data.kelurahan,
      kecamatan: data.kecamatan,
      kota: data.kota,
      provinsi: data.provinsi,
      deskripsi: data.deskripsi || null,
      masaSanggahMulai: mulai,
      masaSanggahSelesai: selesai,
    },
  });
  await logAdminAction("CREATE", "Proyek", proyek.id, proyek.namaProyek);

  revalidatePath("/admin/proyek");
  revalidatePath("/");
  redirect("/admin/proyek?saved=created");
}

export async function updateProyek(id: string, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = proyekSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const data = parsed.data;

  const tanggalPeng = new Date(data.tanggalPeng);
  const { mulai, selesai: selesaiDefault } = getMasaSanggahRange(tanggalPeng);
  const selesai = data.masaSanggahSelesai ? new Date(data.masaSanggahSelesai) : selesaiDefault;

  const sebelumnya = await prisma.project.findUnique({ where: { id }, select: { masaSanggahSelesai: true } });

  await prisma.project.update({
    where: { id },
    data: {
      namaProyek: data.namaProyek,
      nomorPeng: data.nomorPeng,
      tanggalPeng,
      kelurahan: data.kelurahan,
      kecamatan: data.kecamatan,
      kota: data.kota,
      provinsi: data.provinsi,
      deskripsi: data.deskripsi || null,
      masaSanggahMulai: mulai,
      masaSanggahSelesai: selesai,
    },
  });

  const keterangan =
    sebelumnya?.masaSanggahSelesai && sebelumnya.masaSanggahSelesai.getTime() !== selesai.getTime()
      ? `${data.namaProyek} — masa sanggah diubah ke ${selesai.toLocaleDateString("id-ID")}`
      : data.namaProyek;
  await logAdminAction("UPDATE", "Proyek", id, keterangan);

  revalidatePath("/admin/proyek");
  revalidatePath(`/admin/proyek/${id}`);
  revalidatePath("/");
  redirect("/admin/proyek?saved=updated");
}

export async function deleteProyek(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [bidang, dokumen, pengumuman, sanggahan] = await Promise.all([
    prisma.bidang.count({ where: { projectId: id } }),
    prisma.dokumenPublikasi.count({ where: { projectId: id } }),
    prisma.pengumuman.count({ where: { projectId: id } }),
    prisma.sanggahan.count({ where: { projectId: id } }),
  ]);
  const total = bidang + dokumen + pengumuman + sanggahan;
  if (total > 0) {
    return {
      error: `Proyek tidak dapat dihapus karena masih memiliki ${bidang} bidang, ${dokumen} dokumen, ${pengumuman} pengumuman, dan ${sanggahan} sanggahan terkait. Hapus data terkait terlebih dahulu.`,
    };
  }

  const proyek = await prisma.project.findUnique({ where: { id }, select: { namaProyek: true } });
  await prisma.project.delete({ where: { id } });
  await logAdminAction("DELETE", "Proyek", id, proyek?.namaProyek);
  revalidatePath("/admin/proyek");
  revalidatePath("/");
  return { success: true };
}
