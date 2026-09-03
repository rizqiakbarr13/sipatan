"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createWargaSession, destroyWargaSession } from "@/lib/warga-session";
import { registerWargaSchema, loginWargaSchema } from "@/lib/validation/warga";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

type ActionState = { error?: string };

function safeNextPath(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/akun";
}

function withSavedParam(path: string, saved: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}saved=${saved}`;
}

export async function registerWarga(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ip = await getClientIp();
  if (isRateLimited(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Terlalu banyak percobaan pendaftaran. Silakan coba lagi nanti." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = registerWargaSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const data = parsed.data;

  const existing = await prisma.warga.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "Email sudah terdaftar, silakan masuk" };
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const warga = await prisma.warga.create({
    data: {
      nama: data.nama,
      email: data.email,
      password: hashed,
      nik: data.nik || null,
      noHp: data.noHp || null,
    },
  });

  await createWargaSession({ id: warga.id, nama: warga.nama, email: warga.email });
  redirect(withSavedParam(safeNextPath(formData.get("next")), "registered"));
}

export async function loginWarga(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ip = await getClientIp();
  if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return { error: "Terlalu banyak percobaan masuk. Silakan coba lagi dalam beberapa menit." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = loginWargaSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const data = parsed.data;

  const warga = await prisma.warga.findUnique({ where: { email: data.email } });
  if (!warga) {
    return { error: "Email atau kata sandi salah" };
  }

  const valid = await bcrypt.compare(data.password, warga.password);
  if (!valid) {
    return { error: "Email atau kata sandi salah" };
  }

  await createWargaSession({ id: warga.id, nama: warga.nama, email: warga.email });
  redirect(withSavedParam(safeNextPath(formData.get("next")), "logged-in"));
}

export async function logoutWarga() {
  await destroyWargaSession();
  redirect("/");
}
