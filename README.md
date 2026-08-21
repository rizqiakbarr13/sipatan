# Website Pengadaan Tanah untuk Kepentingan Umum
### Pelebaran Simpang Parung Bingung — Kota Depok

Aplikasi publikasi resmi pengadaan tanah: dokumen publikasi, data nominatif, SOP, dan kanal sanggahan masyarakat. Dibangun dengan Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Prisma + PostgreSQL, dan Auth.js.

Lihat [`PRD.md`](./PRD.md) untuk spesifikasi lengkap.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL via Prisma ORM
- Auth.js (NextAuth v5) — Credentials, untuk admin
- Zod + react-hook-form untuk validasi form
- @tanstack/react-table untuk tabel data nominatif
- @react-pdf/renderer untuk generate PDF formulir sanggahan
- Storage dokumen/lampiran: driver `local` / `blob` (Vercel Blob) / `s3` (S3-compatible), dipilih via env

## Setup Lokal

### 1. Prasyarat
- Node.js 20+
- Docker Desktop (untuk PostgreSQL lokal) — atau gunakan instance PostgreSQL lain yang sudah berjalan

### 2. Install dependencies

```bash
npm install
```

### 3. Siapkan environment variables

```bash
cp .env.example .env
```

Sesuaikan isinya. Generate `AUTH_SECRET` dengan:

```bash
npx auth secret
```

### 4. Jalankan PostgreSQL lokal via Docker

```bash
docker compose up -d db
```

Ini menjalankan Postgres di `localhost:5432` sesuai `DATABASE_URL` default di `.env.example`.

> Sudah punya PostgreSQL sendiri? Lewati langkah ini dan arahkan `DATABASE_URL` ke instance Anda.

### 5. Migrasi & seed database

```bash
npx prisma migrate dev
npm run db:seed
```

Seed akan membuat:
- 1 Project (Daftar Nominatif Nomor 10/Peng-10.27/VII/2026)
- ~15 Bidang contoh (diimpor dari `data/nominatif.csv`)
- 9 tahapan SOP pengadaan tanah
- 2 Dokumen Publikasi contoh (Daftar Nominatif & Pengumuman)
- 1 Pengumuman
- 1 akun admin (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` dari `.env`)

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Login admin di `/admin/login`.

## Import Data Nominatif (81 bidang)

Template lengkap 81 baris ada di [`data/nominatif.csv`](./data/nominatif.csv) (15 baris contoh terisi, sisanya header kosong siap diisi). Admin dapat mengimpor file CSV ini (atau turunannya) lewat **Admin → Kelola Nominatif → Import CSV**, dengan preview & validasi sebelum data disimpan.

## Environment Variables

Lihat [`.env.example`](./.env.example) untuk daftar lengkap beserta penjelasan. Ringkasan:

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | ya | Connection string PostgreSQL |
| `AUTH_SECRET` | ya | Secret Auth.js, generate via `npx auth secret` |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | ya | URL publik aplikasi |
| `SEED_ADMIN_*` | ya (untuk seed) | Kredensial admin default |
| `STORAGE_DRIVER` | ya | `local` \| `blob` \| `s3` |
| `STORAGE_LOCAL_DIR` | jika `local` | Folder penyimpanan di server/VPS |
| `BLOB_READ_WRITE_TOKEN` | jika `blob` | Token Vercel Blob |
| `S3_*` | jika `s3` | Kredensial & endpoint S3-compatible |
| `MAX_UPLOAD_SIZE_MB` | tidak | Default 5 |
| `RESEND_API_KEY` / `EMAIL_FROM` | tidak | Notifikasi email status sanggahan (opsional) |

## Deployment

> Bagian ini akan dilengkapi (panduan Vercel & VPS/Nginx/PM2/Docker) pada tahap finalisasi proyek.

## Status Pengembangan

Lihat `PRD.md` bagian 11 (Kriteria Selesai) untuk checklist fitur.
