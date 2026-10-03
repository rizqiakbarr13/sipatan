"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { nominatifRowSchema, type NominatifRow } from "@/lib/nominatif-csv";
import { extractNominatifRowsFromPdf } from "@/lib/nominatif-pdf";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage";
import { logAdminAction } from "@/lib/audit-log";

const bidangFormSchema = z.object({
  projectId: z.string().optional(),
  noUrut: z.coerce.number().int().positive(),
  noPetaBidang: z.string().optional(),
  namaPemilik: z.string().min(1, "Nama pemilik wajib diisi"),
  tanggalLahir: z.string().optional(),
  pekerjaan: z.string().optional(),
  alamat: z.string().optional(),
  nik: z.string().optional(),
  nib: z.string().optional(),
  rtRw: z.string().optional(),
  letakKelurahan: z.string().optional(),
  letakKecamatan: z.string().optional(),
  danomNo: z.string().optional(),
  luasSesuaiAlasHak: z.coerce.number().optional(),
  luasHasilUkur: z.coerce.number().optional(),
  nisTerkena: z.string().optional(),
  luasKena: z.coerce.number().optional(),
  nisSisa: z.string().optional(),
  luasSisa: z.coerce.number().optional(),
  suratTandaBukti: z.string().optional(),
  bangunanRingkas: z.string().optional(),
  tanamanRingkas: z.string().optional(),
  keterangan: z.string().optional(),
});

function emptyToUndefined(v: FormDataEntryValue | null) {
  if (v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

function parseBidangForm(formData: FormData) {
  const raw = {
    projectId: formData.get("projectId"),
    noUrut: formData.get("noUrut"),
    noPetaBidang: emptyToUndefined(formData.get("noPetaBidang")),
    namaPemilik: formData.get("namaPemilik"),
    tanggalLahir: emptyToUndefined(formData.get("tanggalLahir")),
    pekerjaan: emptyToUndefined(formData.get("pekerjaan")),
    alamat: emptyToUndefined(formData.get("alamat")),
    nik: emptyToUndefined(formData.get("nik")),
    nib: emptyToUndefined(formData.get("nib")),
    rtRw: emptyToUndefined(formData.get("rtRw")),
    letakKelurahan: emptyToUndefined(formData.get("letakKelurahan")),
    letakKecamatan: emptyToUndefined(formData.get("letakKecamatan")),
    danomNo: emptyToUndefined(formData.get("danomNo")),
    luasSesuaiAlasHak: emptyToUndefined(formData.get("luasSesuaiAlasHak")),
    luasHasilUkur: emptyToUndefined(formData.get("luasHasilUkur")),
    nisTerkena: emptyToUndefined(formData.get("nisTerkena")),
    luasKena: emptyToUndefined(formData.get("luasKena")),
    nisSisa: emptyToUndefined(formData.get("nisSisa")),
    luasSisa: emptyToUndefined(formData.get("luasSisa")),
    suratTandaBukti: emptyToUndefined(formData.get("suratTandaBukti")),
    bangunanRingkas: emptyToUndefined(formData.get("bangunanRingkas")),
    tanamanRingkas: emptyToUndefined(formData.get("tanamanRingkas")),
    keterangan: emptyToUndefined(formData.get("keterangan")),
  };
  return bidangFormSchema.safeParse(raw);
}

export async function createBidang(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = parseBidangForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const { projectId, ...bidangData } = parsed.data;
  if (!projectId) return { error: "Proyek wajib dipilih" };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Proyek yang dipilih tidak ditemukan" };

  const dup = await prisma.bidang.findUnique({
    where: { projectId_noUrut: { projectId: project.id, noUrut: bidangData.noUrut } },
  });
  if (dup) return { error: `No. Urut ${bidangData.noUrut} sudah digunakan pada proyek ini` };

  const bidang = await prisma.bidang.create({ data: { ...bidangData, projectId: project.id } });
  await logAdminAction("CREATE", "Data Nominatif", bidang.id, `No. Urut ${bidang.noUrut} — ${bidang.namaPemilik}`);

  revalidatePath("/admin/nominatif");
  revalidatePath("/data-nominatif");
  redirect("/admin/nominatif?saved=created");
}

export async function updateBidang(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = parseBidangForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  const { projectId: _unused, ...bidangData } = parsed.data;
  void _unused;

  const existing = await prisma.bidang.findUnique({ where: { id }, select: { projectId: true } });
  if (!existing) return { error: "Bidang tidak ditemukan" };

  const dup = await prisma.bidang.findUnique({
    where: { projectId_noUrut: { projectId: existing.projectId, noUrut: bidangData.noUrut } },
  });
  if (dup && dup.id !== id) return { error: `No. Urut ${bidangData.noUrut} sudah digunakan pada proyek ini` };

  await prisma.bidang.update({ where: { id }, data: bidangData });
  await logAdminAction("UPDATE", "Data Nominatif", id, `No. Urut ${bidangData.noUrut} — ${bidangData.namaPemilik}`);

  revalidatePath("/admin/nominatif");
  revalidatePath(`/admin/nominatif/${id}`);
  revalidatePath("/data-nominatif");
  revalidatePath(`/data-nominatif/${parsed.data.noUrut}`);
  redirect("/admin/nominatif?saved=updated");
}

export async function deleteBidang(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const bidang = await prisma.bidang.findUnique({ where: { id }, select: { noUrut: true, namaPemilik: true } });
  await prisma.bidang.delete({ where: { id } });
  await logAdminAction(
    "DELETE",
    "Data Nominatif",
    id,
    bidang ? `No. Urut ${bidang.noUrut} — ${bidang.namaPemilik}` : undefined
  );
  revalidatePath("/admin/nominatif");
  revalidatePath("/data-nominatif");
}

export async function deleteBidangBulk(ids: string[]): Promise<{ error?: string; success?: boolean; count?: number }> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (!ids || ids.length === 0) return { error: "Tidak ada data yang dipilih" };

  const items = await prisma.bidang.findMany({
    where: { id: { in: ids } },
    select: { noUrut: true },
    orderBy: { noUrut: "asc" },
  });
  if (items.length === 0) return { error: "Data yang dipilih tidak ditemukan" };

  await prisma.bidang.deleteMany({ where: { id: { in: ids } } });
  await logAdminAction(
    "DELETE",
    "Data Nominatif",
    undefined,
    `Hapus terpilih ${items.length} bidang (No. Urut: ${items.map((i) => i.noUrut).join(", ")})`
  );

  revalidatePath("/admin/nominatif");
  revalidatePath("/data-nominatif");
  return { success: true, count: items.length };
}

export async function deleteBidangByProject(projectId: string): Promise<{ error?: string; success?: boolean; count?: number }> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (!projectId) return { error: "Proyek wajib dipilih" };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Proyek yang dipilih tidak ditemukan" };

  const { count } = await prisma.bidang.deleteMany({ where: { projectId } });
  await logAdminAction(
    "DELETE",
    "Data Nominatif",
    projectId,
    `Hapus semua ${count} bidang pada proyek "${project.namaProyek}"`
  );

  revalidatePath("/admin/nominatif");
  revalidatePath("/data-nominatif");
  return { success: true, count };
}

export async function addBangunanItem(bidangId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const jenis = String(formData.get("jenis") ?? "").trim();
  if (!jenis) return { error: "Jenis bangunan wajib diisi" };
  const jumlah = formData.get("jumlah") ? Number(formData.get("jumlah")) : null;
  const satuanRaw = emptyToUndefined(formData.get("satuan"));
  const satuan = satuanRaw && ["m²", "m¹", "unit"].includes(satuanRaw) ? satuanRaw : null;

  await prisma.bangunanItem.create({ data: { bidangId, jenis, jumlah, satuan } });
  revalidatePath(`/admin/nominatif/${bidangId}`);
  return { success: true };
}

export async function deleteBangunanItem(id: string, bidangId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.bangunanItem.delete({ where: { id } });
  revalidatePath(`/admin/nominatif/${bidangId}`);
}

export async function addTanamanItem(bidangId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const jenis = String(formData.get("jenis") ?? "").trim();
  if (!jenis) return { error: "Jenis tanaman wajib diisi" };
  const toNum = (v: FormDataEntryValue | null) => (v ? Number(v) : null);

  await prisma.tanamanItem.create({
    data: {
      bidangId,
      jenis,
      kecil: toNum(formData.get("kecil")),
      sedang: toNum(formData.get("sedang")),
      besar: toNum(formData.get("besar")),
      jumlah: toNum(formData.get("jumlah")),
    },
  });
  revalidatePath(`/admin/nominatif/${bidangId}`);
  return { success: true };
}

export async function deleteTanamanItem(id: string, bidangId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.tanamanItem.delete({ where: { id } });
  revalidatePath(`/admin/nominatif/${bidangId}`);
}

export async function addBendaLainItem(bidangId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const jenis = String(formData.get("jenis") ?? "").trim();
  if (!jenis) return { error: "Jenis benda wajib diisi" };
  const jumlah = formData.get("jumlah") ? Number(formData.get("jumlah")) : null;

  await prisma.bendaLainItem.create({ data: { bidangId, jenis, jumlah } });
  revalidatePath(`/admin/nominatif/${bidangId}`);
  return { success: true };
}

export async function deleteBendaLainItem(id: string, bidangId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.bendaLainItem.delete({ where: { id } });
  revalidatePath(`/admin/nominatif/${bidangId}`);
}

export async function importNominatifRows(rows: NominatifRow[], projectId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Proyek yang dipilih tidak ditemukan", created: 0, updated: 0 };

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const parsed = nominatifRowSchema.safeParse(row);
    if (!parsed.success) continue;
    const data = parsed.data;

    const existing = await prisma.bidang.findUnique({
      where: { projectId_noUrut: { projectId: project.id, noUrut: data.noUrut } },
    });

    if (existing) {
      await prisma.bidang.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.bidang.create({ data: { ...data, projectId: project.id } });
      created++;
    }
  }

  await logAdminAction(
    "CREATE",
    "Data Nominatif",
    undefined,
    `Impor massal pada proyek "${project.namaProyek}": ${created} baru, ${updated} diperbarui`
  );

  revalidatePath("/admin/nominatif");
  revalidatePath("/data-nominatif");
  return { success: true, created, updated };
}

export async function extractNominatifPdf(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File PDF wajib diunggah" };
  }
  if (file.type !== "application/pdf") {
    return { error: "File harus berformat PDF" };
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { error: "Ukuran file melebihi batas maksimal" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const { rows, warnings } = await extractNominatifRowsFromPdf(buffer);
    return { rows, warnings };
  } catch {
    return { error: "Gagal membaca file PDF. Pastikan file tidak rusak dan berisi tabel data." };
  }
}
