# Website Pengadaan Tanah untuk Kepentingan Umum
### Pelebaran Simpang Parung Bingung — Kota Depok

Aplikasi publikasi resmi pengadaan tanah: dokumen publikasi, data nominatif, SOP, dan kanal sanggahan masyarakat. Dibangun dengan Next.js (App Router) + TypeScript, Tailwind CSS, Prisma + PostgreSQL, dan Auth.js.

Lihat [`PRD.md`](./PRD.md) untuk spesifikasi lengkap.

## Stack

- **Next.js 15** (App Router) + TypeScript + **React 19**
- Tailwind CSS v4 + komponen UI bergaya shadcn/ui (ditulis manual di `src/components/ui`, bukan hasil CLI — lihat catatan di bawah)
- **PostgreSQL via Prisma ORM 7**, dengan **driver adapter** (`@prisma/adapter-pg` + `pg`) — lihat catatan di bawah
- Auth.js (NextAuth v5) — Credentials, untuk admin, dengan konfigurasi edge-safe terpisah untuk middleware
- Zod v4 + react-hook-form untuk validasi form
- @tanstack/react-table v8 untuk tabel data nominatif
- @react-pdf/renderer v4 untuk generate PDF formulir sanggahan
- Storage dokumen/lampiran: driver `local` / `blob` (Vercel Blob) / `s3` (S3-compatible), dipilih via env

### Catatan versi (penting untuk kontributor)

Beberapa keputusan versi menyimpang dari asumsi umum karena kondisi nyata saat pengembangan:

- **Prisma 7 + driver adapter, bukan `DATABASE_URL` di `schema.prisma`.** Prisma 7 menghapus dukungan `url = env("DATABASE_URL")` di blok `datasource` dan mewajibkan driver adapter untuk koneksi. Koneksi diatur di dua tempat: `prisma.config.ts` (dipakai CLI: migrate/seed/studio) dan `src/lib/prisma.ts` (dipakai aplikasi, via `PrismaPg` dari `@prisma/adapter-pg`). Generator tetap `prisma-client-js` (bukan `prisma-client` yang baru) agar import `@prisma/client` tidak berubah.
- **React 19, bukan 18.** `@react-pdf/renderer` v4 di dalam Next.js 15 App Router route handler (`/api/formulir-pdf`) menghasilkan `Minified React error #31` di React 18; berfungsi normal di React 19.
- **UI components ditulis manual**, bukan hasil `npx shadcn init`. Mengikuti konvensi shadcn (Tailwind + `class-variance-authority` + `cn()` utility, file "dimiliki" bukan di-import dari package UI kit), tanpa bergantung pada CLI interaktif.

## Setup Lokal

### 1. Prasyarat
- Node.js 20+
- Docker Desktop (untuk PostgreSQL lokal) — atau gunakan instance PostgreSQL lain yang sudah berjalan

### 2. Install dependencies

```bash
npm install
```

`postinstall` akan otomatis menjalankan `prisma generate`.

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
npm run db:migrate
npm run db:seed
```

Seed akan membuat:
- 1 Project (Daftar Nominatif Nomor 10/Peng-10.27/VII/2026, dengan masa sanggah 14 hari kerja sejak tanggal pengumuman)
- ~15 Bidang contoh (diimpor dari `data/nominatif.csv`, termasuk rincian bangunan/tanaman terstruktur untuk beberapa bidang)
- 9 tahapan SOP pengadaan tanah
- 2 Dokumen Publikasi contoh (Daftar Nominatif & Pengumuman, dengan PDF placeholder di `public/dokumen-contoh/`)
- 1 Pengumuman
- 1 akun admin **Super Admin** (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` dari `.env`)

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Login admin di `/admin/login`.

### Skrip lain yang tersedia

| Skrip | Kegunaan |
|---|---|
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | `prisma db seed` (menjalankan `prisma/seed.ts` via `tsx`) |
| `npm run db:studio` | Buka Prisma Studio untuk lihat/edit data langsung |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Jalankan hasil build (`next start`) |
| `npm run lint` | ESLint |

## Import Data Nominatif (81 bidang)

Template lengkap 81 baris ada di [`data/nominatif.csv`](./data/nominatif.csv) (15 baris contoh terisi, sisanya header kosong siap diisi). Admin dapat mengimpor file CSV ini (atau turunannya) lewat **Admin → Data Nominatif → Import CSV** (`/admin/nominatif/impor`), dengan preview & validasi Zod sebelum data disimpan. Import bersifat upsert: baris dengan No. Urut yang sudah ada akan diperbarui, yang belum ada akan dibuat baru — aman dijalankan berulang kali.

## Environment Variables

Lihat [`.env.example`](./.env.example) untuk daftar lengkap beserta penjelasan. Ringkasan:

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | ya | Connection string PostgreSQL |
| `AUTH_SECRET` | ya | Secret Auth.js, generate via `npx auth secret` |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | ya | URL publik aplikasi (wajib benar di production) |
| `SEED_ADMIN_*` | ya (untuk seed) | Kredensial admin default |
| `STORAGE_DRIVER` | ya | `local` \| `blob` \| `s3` |
| `STORAGE_LOCAL_DIR` | jika `local` | Folder penyimpanan di server/VPS (di luar `/public`) |
| `BLOB_READ_WRITE_TOKEN` | jika `blob` | Token Vercel Blob |
| `S3_*` | jika `s3` | Kredensial & endpoint S3-compatible |
| `MAX_UPLOAD_SIZE_MB` | tidak | Default 5 |
| `RESEND_API_KEY` / `EMAIL_FROM` | tidak | Notifikasi email status sanggahan (belum diimplementasikan, disiapkan untuk pengembangan lanjutan) |

## Deployment

### A. Vercel

1. **Database**: buat database Postgres di [Neon](https://neon.tech) atau [Supabase](https://supabase.com), salin connection string ke `DATABASE_URL` pada Environment Variables Vercel.
2. **Storage**: set `STORAGE_DRIVER=blob`, aktifkan [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) pada project, lalu set `BLOB_READ_WRITE_TOKEN` (biasanya otomatis terisi saat store dihubungkan). **Jangan** pakai `STORAGE_DRIVER=local` di Vercel — filesystem-nya read-only/ephemeral.
3. Set seluruh environment variable lain (`AUTH_SECRET`, `AUTH_URL`/`NEXT_PUBLIC_APP_URL` sesuai domain Vercel, `SEED_ADMIN_*`).
4. Build command default (`next build`) sudah cukup — `postinstall` menjalankan `prisma generate` otomatis.
5. Jalankan migrasi & seed sekali dari lokal (dengan `DATABASE_URL` diarahkan ke database production) atau lewat Vercel CLI:
   ```bash
   DATABASE_URL="<connection-string-production>" npx prisma migrate deploy
   DATABASE_URL="<connection-string-production>" npx prisma db seed
   ```
6. Deploy seperti biasa (`vercel` CLI atau import repo dari dashboard).

### B. Self-host / VPS (Node + Nginx + PM2)

1. **PostgreSQL lokal**: pakai `docker-compose.yml` yang disediakan (`docker compose up -d db`), atau instal Postgres native di VPS.
2. **Storage**: set `STORAGE_DRIVER=local` dan `STORAGE_LOCAL_DIR=/var/www/dinas-pertanahan/uploads` (atau path lain di luar direktori web root publik). Pastikan folder ini persisten (backup rutin) dan tidak ikut ter-hapus saat redeploy.
3. Clone repo, `npm install`, `cp .env.example .env` lalu isi sesuai lingkungan production.
4. Migrasi & seed:
   ```bash
   npm run db:migrate -- --name init  # atau: npx prisma migrate deploy (jika migrasi sudah ada)
   npm run db:seed
   ```
5. Build & jalankan dengan PM2:
   ```bash
   npm run build
   pm2 start npm --name dinas-pertanahan -- start
   pm2 save
   ```
6. **Nginx reverse proxy** (contoh `/etc/nginx/sites-available/dinas-pertanahan`):
   ```nginx
   server {
       listen 80;
       server_name pengadaan-tanah.contoh.go.id;

       client_max_body_size 10M; # sesuaikan dengan MAX_UPLOAD_SIZE_MB

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Aktifkan dengan `ln -s` ke `sites-enabled`, lalu pasang SSL (mis. `certbot --nginx`).
7. **Opsional — full Docker**: `docker-compose.yml` menyertakan contoh service `app` (dikomentari) untuk menjalankan aplikasi dalam container juga, jika VPS lebih nyaman dikelola penuh via Docker daripada PM2 native.

## Struktur Proyek Singkat

```
prisma/schema.prisma       Skema database
prisma/seed.ts             Seed data awal
prisma.config.ts           Konfigurasi Prisma CLI (ganti Prisma 7)
data/nominatif.csv         Template import 81 bidang
src/app/(public)/...       Halaman publik
src/app/admin/...          Halaman admin (login + area terproteksi)
src/app/api/...            Route handler (upload, unduh, PDF, sanggahan, auth)
src/lib/...                Util bersama (storage, validasi, masa sanggah, mask NIK, dst.)
src/components/ui/...      Komponen UI dasar bergaya shadcn
```

## Keamanan & Privasi

- Password admin di-hash dengan bcrypt.
- Route `/admin/*` diproteksi middleware Auth.js; `/admin/users` dibatasi role `SUPER_ADMIN` (dicek di middleware maupun server action).
- NIK disamarkan (`3276●●●●●●●●0003`) di seluruh tampilan publik; hanya admin yang melihat NIK penuh.
- Endpoint `POST /api/sanggahan` memiliki rate-limit in-memory sederhana (5 pengajuan/jam per IP) — cukup untuk deployment single-instance; untuk multi-instance/production skala besar, ganti dengan solusi eksternal (mis. Upstash Ratelimit / Redis).
- Validasi tipe & ukuran file upload (PDF/JPG/PNG/WEBP, maks. `MAX_UPLOAD_SIZE_MB`) di server, bukan hanya klien.

## Status Pengembangan

Lihat `PRD.md` bagian 11 (Kriteria Selesai) untuk checklist fitur.
