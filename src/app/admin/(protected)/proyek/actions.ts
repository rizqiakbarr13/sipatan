"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const proyekSchema = z.object({
  id: z.string().min(1),
  namaProyek: z.string().min(1, "Nama proyek wajib diisi"),
  nomorPeng: z.string().min(1, "Nomor pengumuman wajib diisi"),
  tanggalPeng: z.string().min(1, "Tanggal pengumuman wajib diisi"),
  kelurahan: z.string().min(1),
  kecamatan: z.string().min(1),
  kota: z.string().min(1),
  provinsi: z.string().min(1),
  masaSanggahMulai: z.string().optional(),
  masaSanggahSelesai: z.string().optional(),
  deskripsi: z.string().optional(),
});

export async function updateProyek(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = proyekSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const data = parsed.data;

  await prisma.project.update({
    where: { id: data.id },
    data: {
      namaProyek: data.namaProyek,
      nomorPeng: data.nomorPeng,
      tanggalPeng: new Date(data.tanggalPeng),
      kelurahan: data.kelurahan,
      kecamatan: data.kecamatan,
      kota: data.kota,
      provinsi: data.provinsi,
      masaSanggahMulai: data.masaSanggahMulai ? new Date(data.masaSanggahMulai) : null,
      masaSanggahSelesai: data.masaSanggahSelesai ? new Date(data.masaSanggahSelesai) : null,
      deskripsi: data.deskripsi || null,
    },
  });

  revalidatePath("/admin/proyek");
  revalidatePath("/");
  return { success: true };
}
