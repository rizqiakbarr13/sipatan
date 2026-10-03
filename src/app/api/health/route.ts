import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint health-check untuk uptime monitor eksternal (UptimeRobot, Better
 * Uptime, load balancer, dll). Memverifikasi koneksi database benar-benar
 * hidup (bukan cuma proses Next.js yang hidup), tanpa membocorkan data apa pun.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: "ok", database: "up", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("[health] Database tidak dapat diakses:", err);
    return NextResponse.json(
      { status: "error", database: "down", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
