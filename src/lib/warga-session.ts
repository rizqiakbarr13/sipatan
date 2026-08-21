import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const WARGA_COOKIE = "warga_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecretKey() {
  const secret = process.env.WARGA_SESSION_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("WARGA_SESSION_SECRET atau AUTH_SECRET wajib diisi di env");
  }
  return new TextEncoder().encode(secret);
}

export interface WargaSessionPayload {
  id: string;
  nama: string;
  email: string;
}

export async function createWargaSession(payload: WargaSessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .setAudience("warga")
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(WARGA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getWargaSession(): Promise<WargaSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(WARGA_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { audience: "warga" });
    if (
      typeof payload.id !== "string" ||
      typeof payload.nama !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return { id: payload.id, nama: payload.nama, email: payload.email };
  } catch {
    return null;
  }
}

export async function destroyWargaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(WARGA_COOKIE);
}
