import path from "path";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getLocalStorageDriver } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  // Tolak segmen path traversal (mis. "..") sebelum digabung — mencegah akses
  // file di luar direktori upload (lihat juga cek boundary kedua di bawah).
  if (keyParts.some((part) => part === ".." || part.includes("/") || part.includes("\\"))) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  }
  const key = keyParts.join("/");

  try {
    const driver = getLocalStorageDriver();
    const filePath = driver.resolvePath(key);
    const baseDir = driver.resolvePath("");
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(path.normalize(baseDir + path.sep))) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }
    const buffer = await fs.readFile(normalized);
    const contentType = guessContentType(normalized);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  }
}

function guessContentType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
