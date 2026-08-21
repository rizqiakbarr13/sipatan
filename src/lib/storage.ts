import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

export interface SaveFileInput {
  buffer: Buffer;
  filename: string;
  contentType: string;
  /** Pengelompokan logis, mis. "dokumen" atau "sanggahan". */
  folder: string;
}

export interface SavedFile {
  /** URL yang disimpan ke DB dan dipakai untuk mengakses file. */
  url: string;
  /** Kunci penyimpanan internal, dipakai untuk menghapus file. */
  key: string;
}

export interface StorageDriver {
  save(input: SaveFileInput): Promise<SavedFile>;
  remove(key: string): Promise<void>;
}

function safeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

function buildKey(folder: string, filename: string): string {
  return `${folder}/${randomUUID()}-${safeFilename(filename)}`;
}

class LocalStorageDriver implements StorageDriver {
  private baseDir: string;

  constructor() {
    this.baseDir = process.env.STORAGE_LOCAL_DIR
      ? path.resolve(process.cwd(), process.env.STORAGE_LOCAL_DIR)
      : path.resolve(process.cwd(), "uploads");
  }

  async save({ buffer, filename, folder }: SaveFileInput): Promise<SavedFile> {
    const key = buildKey(folder, filename);
    const filePath = path.join(this.baseDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    return { url: `/api/files/${key}`, key };
  }

  async remove(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, key);
    await fs.rm(filePath, { force: true });
  }

  /** Dipakai oleh route handler /api/files/[...key] untuk membaca file dari disk. */
  resolvePath(key: string): string {
    return path.join(this.baseDir, key);
  }
}

class BlobStorageDriver implements StorageDriver {
  async save({ buffer, filename, folder, contentType }: SaveFileInput): Promise<SavedFile> {
    const { put } = await import("@vercel/blob");
    const key = buildKey(folder, filename);
    const result = await put(key, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: result.url, key: result.pathname };
  }

  async remove(key: string): Promise<void> {
    const { del } = await import("@vercel/blob");
    await del(key);
  }
}

class S3StorageDriver implements StorageDriver {
  private bucket: string;
  private publicUrlBase: string | undefined;

  constructor() {
    this.bucket = process.env.S3_BUCKET ?? "";
    this.publicUrlBase = process.env.S3_PUBLIC_URL;
    if (!this.bucket) {
      throw new Error("S3_BUCKET belum diatur untuk STORAGE_DRIVER=s3");
    }
  }

  private async client() {
    const { S3Client } = await import("@aws-sdk/client-s3");
    return new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
    });
  }

  async save({ buffer, filename, folder, contentType }: SaveFileInput): Promise<SavedFile> {
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const key = buildKey(folder, filename);
    const client = await this.client();
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
      })
    );
    const url = this.publicUrlBase
      ? `${this.publicUrlBase.replace(/\/$/, "")}/${key}`
      : `${(process.env.S3_ENDPOINT ?? "").replace(/\/$/, "")}/${this.bucket}/${key}`;
    return { url, key };
  }

  async remove(key: string): Promise<void> {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.client();
    await client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}

let driverInstance: StorageDriver | null = null;

export function getStorageDriver(): StorageDriver {
  if (driverInstance) return driverInstance;
  const driver = process.env.STORAGE_DRIVER || "local";
  switch (driver) {
    case "blob":
      driverInstance = new BlobStorageDriver();
      break;
    case "s3":
      driverInstance = new S3StorageDriver();
      break;
    case "local":
    default:
      driverInstance = new LocalStorageDriver();
      break;
  }
  return driverInstance;
}

export function getLocalStorageDriver(): LocalStorageDriver {
  return new LocalStorageDriver();
}

export const MAX_UPLOAD_SIZE_BYTES = Number(process.env.MAX_UPLOAD_SIZE_MB || 5) * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
