# Panduan Hosting SIPATAN ke Production (Vercel — Tanpa VPS)

Jalur ini **lebih sederhana dan lebih murah** dibanding VPS (lihat [PANDUAN-HOSTING.md](./PANDUAN-HOSTING.md)): tidak ada SSH, tidak ada Nginx, tidak ada server yang harus dirawat sendiri. Anda cukup push kode ke GitHub, hubungkan ke Vercel, dan Vercel yang menjalankan semuanya. Database dan storage file memakai layanan terpisah yang **gratis untuk skala kecil–menengah**.

**Biaya perkiraan:** Rp0/bulan di awal (semua pakai free tier), naik bertahap hanya jika trafik/data membesar. **Waktu:** ±30–45 menit untuk yang pertama kali.

**Domain:** `sipatan.id` atau `sipatan.com` — keduanya bisa dipakai, tinggal beli lalu arahkan ke Vercel (langkah 6).

---

## Ringkasan Alur

1. Push kode ke GitHub
2. Buat database gratis di Neon
3. Buat project di Vercel, hubungkan ke repo GitHub
4. Isi Environment Variables di Vercel
5. Aktifkan Vercel Blob (untuk simpan file upload)
6. Beli & pasang domain `sipatan.id`/`sipatan.com`
7. Migrasi database & buat akun admin pertama
8. Checklist setelah live

---

## 1. Push Kode ke GitHub

Dari folder project ini, di terminal:

```bash
git init          # kalau belum pernah di-init git sebelumnya (cek dulu: ls -a .git)
git add .
git commit -m "Initial commit"
```

Buat repo baru di [github.com/new](https://github.com/new) (pilih **Private** supaya kode tidak publik), lalu hubungkan dan push:

```bash
git remote add origin https://github.com/USERNAME-ANDA/dinas-pertanahan.git
git branch -M main
git push -u origin main
```

> Pastikan `.env` **tidak ikut** ter-push (sudah ada di `.gitignore` secara default) — jangan sampai password/secret bocor ke GitHub.

## 2. Buat Database Gratis di Neon

1. Daftar di [neon.tech](https://neon.tech) (bisa langsung login pakai akun GitHub).
2. Klik **Create a project** → beri nama `sipatan` → pilih region terdekat (Singapore kalau ada).
3. Setelah dibuat, Neon menampilkan **Connection String**, bentuknya seperti:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copy connection string ini** — dipakai di langkah 4.

## 3. Buat Project di Vercel

1. Daftar/login di [vercel.com](https://vercel.com) pakai akun **GitHub yang sama**.
2. Klik **Add New → Project**.
3. Pilih repo `dinas-pertanahan` yang baru di-push → klik **Import**.
4. Di halaman konfigurasi, **jangan klik Deploy dulu** — lanjut ke langkah 4 untuk isi Environment Variables terlebih dahulu (kalau sudah ter-deploy duluan, tidak masalah, nanti bisa redeploy ulang setelah isi env).

## 4. Isi Environment Variables di Vercel

Masih di halaman **Import/Configure Project**, buka bagian **Environment Variables**, tambahkan satu per satu:

| Nama Variabel | Isi |
|---|---|
| `DATABASE_URL` | Connection string dari Neon (langkah 2) |
| `AUTH_SECRET` | String acak — generate dengan `npx auth secret` di terminal lokal, copy hasilnya |
| `AUTH_URL` | `https://sipatan.id` (atau `.com`, sesuaikan domain final Anda) |
| `NEXT_PUBLIC_APP_URL` | Sama seperti `AUTH_URL` |
| `WARGA_SESSION_SECRET` | String acak lain — generate dengan `openssl rand -base64 32` (atau pakai situs generator password acak 32+ karakter) |
| `SEED_ADMIN_NAME` | Nama Super Admin pertama, mis. `Administrator` |
| `SEED_ADMIN_EMAIL` | Email Super Admin pertama |
| `SEED_ADMIN_PASSWORD` | Password kuat untuk Super Admin pertama (ganti setelah login pertama) |
| `STORAGE_DRIVER` | `blob` ⚠️ **wajib** `blob`, bukan `local`, karena Vercel tidak punya disk permanen |
| `MAX_UPLOAD_SIZE_MB` | `10` |
| `RESEND_API_KEY` | Opsional — isi jika mau notifikasi email aktif ([resend.com](https://resend.com), gratis 3.000 email/bulan) |
| `EMAIL_FROM` | Opsional — mis. `SIPATAN <no-reply@sipatan.id>` (hanya berfungsi jika domain email sudah diverifikasi di Resend) |

Klik **Deploy**. Tunggu ±2 menit sampai build selesai.

## 5. Aktifkan Vercel Blob (Penyimpanan File)

File upload (dokumen, lampiran sanggahan, foto galeri) disimpan di **Vercel Blob**, bukan disk server.

1. Di dashboard project Vercel, buka tab **Storage** → **Create Database** → pilih **Blob**.
2. Beri nama (mis. `sipatan-files`) → **Create**.
3. Vercel otomatis menambahkan environment variable `BLOB_READ_WRITE_TOKEN` ke project Anda.
4. Buka tab **Deployments** → klik **Redeploy** pada deployment terakhir, supaya env variable baru ini terbaca aplikasi.

## 6. Pasang Domain `sipatan.id` / `sipatan.com`

1. **Beli domain** dulu kalau belum punya — bisa lewat [Niagahoster](https://niagahoster.co.id), [Rumahweb](https://rumahweb.com), atau [Namecheap](https://namecheap.com). Keduanya (`sipatan.id` atau `sipatan.com`) tinggal pilih sesuai ketersediaan & budget (`.id` biasanya sedikit lebih mahal per tahun dibanding `.com`).
2. Di dashboard Vercel, buka project → tab **Settings → Domains** → ketik `sipatan.id` (atau `.com`) → **Add**.
3. Vercel akan menampilkan instruksi DNS, biasanya:

   | Tipe | Host | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

4. Login ke panel **tempat Anda beli domain** (bukan Vercel), buka **DNS Management**, tambahkan dua record di atas persis seperti ditampilkan Vercel.
5. Tunggu beberapa menit–beberapa jam (propagasi DNS). Vercel otomatis mengecek dan memasang **SSL/HTTPS gratis** begitu DNS terdeteksi benar — tidak perlu Certbot atau apa pun secara manual.

## 7. Migrasi Database & Buat Akun Admin

Karena Vercel tidak memberi akses SSH ke server, migrasi dijalankan **dari komputer Anda**, cukup arahkan sementara ke database Neon:

```bash
# Di folder project, dari komputer Anda (BUKAN di server)
DATABASE_URL="<connection-string-neon-dari-langkah-2>" npx prisma migrate deploy
DATABASE_URL="<connection-string-neon-dari-langkah-2>" npx prisma db seed
```

> Di Windows PowerShell, gunakan: `$env:DATABASE_URL="<connection-string>"; npx prisma migrate deploy` (lalu ulangi untuk `db seed`).

Ini akan membuat seluruh tabel di database Neon dan 1 akun Super Admin sesuai `SEED_ADMIN_*` yang Anda isi di langkah 4.

---

## Checklist Setelah Live

- [ ] Buka `https://sipatan.id/admin/login`, login dengan `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`, langsung **ganti password** lewat menu Kelola User.
- [ ] Cek `https://sipatan.id/api/health` → harus muncul `{"status":"ok","database":"up",...}`.
- [ ] Coba ajukan sanggahan dummy dari halaman publik — pastikan upload file (Vercel Blob) berjalan.
- [ ] Cek halaman `/halaman-tidak-ada` → harus muncul halaman 404 custom SIPATAN.
- [ ] Simpan baik-baik: connection string Neon, isi seluruh Environment Variables Vercel (screenshot/simpan di tempat aman), kredensial GitHub.

### Update Aplikasi di Kemudian Hari

Tidak perlu SSH sama sekali — cukup:

```bash
git add .
git commit -m "Update fitur X"
git push
```

Vercel **otomatis** mendeteksi push baru dan deploy ulang. Jika ada migrasi database baru, jalankan `DATABASE_URL="..." npx prisma migrate deploy` dari komputer Anda seperti langkah 7, sebelum atau setelah push.

### Batas Free Tier (kapan perlu upgrade)

| Layanan | Batas Gratis | Kapan perlu upgrade |
|---|---|---|
| Vercel (Hobby) | Cukup longgar untuk trafik instansi kecil–menengah | Trafik sangat tinggi / butuh fitur tim |
| Neon (Free) | 0.5 GB storage, auto-sleep saat tidak dipakai | Data nominatif + dokumen sudah besar (>0.5GB) |
| Vercel Blob (Free) | 1 GB penyimpanan file | Banyak dokumen PDF/foto terkumpul |

Kalau nanti kena limit, tinggal upgrade paket layanan yang bersangkutan saja (tidak perlu pindah platform).

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Build gagal di Vercel | Buka tab **Deployments → klik deployment yang gagal → Logs**, baca error-nya. Paling sering: env variable belum lengkap. |
| Domain belum aktif setelah DNS diatur | Tunggu propagasi (bisa sampai 24 jam), cek status di Vercel → Settings → Domains (ada tanda centang hijau jika sudah benar) |
| Upload file gagal | Pastikan `STORAGE_DRIVER=blob` dan Blob store sudah dibuat + sudah **Redeploy** setelah itu |
| Login admin gagal terus | Pastikan migrasi & seed (langkah 7) sudah dijalankan — tanpa ini, tabel/akun belum ada di database |
| Email notifikasi tidak terkirim | Wajar jika `RESEND_API_KEY` dikosongkan — itu opsional, aplikasi tetap jalan normal tanpanya |

---

## Kapan sebaiknya pindah ke VPS?

Jalur Vercel ini cukup untuk hampir semua kebutuhan instansi. Pertimbangkan pindah ke [VPS](./PANDUAN-HOSTING.md) hanya jika: butuh kontrol penuh server, data sudah sangat besar sehingga biaya layanan gratis mulai naik signifikan, atau ada kebijakan internal yang mengharuskan data disimpan di server sendiri (bukan pihak ketiga).
