import { prisma } from "@/lib/prisma";

/** Aplikasi ini melayani satu proyek pengadaan tanah aktif; ambil yang terbaru. */
export async function getActiveProject() {
  return prisma.project.findFirst({
    orderBy: { createdAt: "desc" },
  });
}
