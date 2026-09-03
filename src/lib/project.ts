import { prisma } from "@/lib/prisma";

/**
 * Aplikasi mendukung banyak proyek sekaligus — ini HANYA mengambil proyek yang
 * paling baru dibuat, dipakai untuk sorotan (mis. hero beranda, ringkasan
 * dashboard admin). Jangan pakai ini untuk keperluan yang butuh proyek
 * spesifik (upload dokumen, tambah bidang, dst.) — pilih proyek secara
 * eksplisit di form terkait.
 */
export async function getActiveProject() {
  return prisma.project.findFirst({
    orderBy: { createdAt: "desc" },
  });
}
