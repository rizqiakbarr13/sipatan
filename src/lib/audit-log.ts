import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Catat aksi admin (tambah/ubah/hapus/toggle) ke AdminAuditLog, untuk
 * akuntabilitas di luar riwayat status sanggahan (SanggahanLog) yang sudah ada.
 * Dipanggil dari server action setelah mutasi berhasil — gagal mencatat log
 * tidak boleh menggagalkan aksi utamanya, jadi error di sini hanya di-log ke
 * console, tidak di-throw.
 */
export async function logAdminAction(
  aksi: "CREATE" | "UPDATE" | "DELETE" | "TOGGLE",
  entitas: string,
  entitasId?: string | null,
  keterangan?: string | null
): Promise<void> {
  try {
    const session = await auth();
    await prisma.adminAuditLog.create({
      data: {
        adminId: session?.user?.id ?? null,
        adminNama: session?.user?.nama ?? "Sistem",
        aksi,
        entitas,
        entitasId: entitasId ?? null,
        keterangan: keterangan ?? null,
      },
    });
  } catch (err) {
    console.error("[audit-log] Gagal mencatat log aktivitas:", err);
  }
}
