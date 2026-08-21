# PRD & Prompt untuk Claude Code
## Website Pengadaan Tanah untuk Kepentingan Umum — Pelebaran Simpang Parung Bingung, Kota Depok

---

## 0. Cara Pakai Dokumen Ini

Salin seluruh isi dokumen ini ke Claude Code sebagai instruksi awal, atau simpan sebagai `PRD.md` di root project lalu jalankan:

```
claude "Baca PRD.md di root project ini dan bangun aplikasi sesuai spesifikasi. Mulai dari scaffolding, database, lalu fitur publik, lalu admin. Konfirmasi rencana dulu sebelum menulis banyak kode."
```

---

## 1. Ringkasan Produk

Website resmi publikasi pengadaan tanah bagi pembangunan untuk kepentingan umum (Pelebaran Simpang Parung Bingung, Jalan Raya Sawangan, Jalan Raya Muchtar, Jalan Meruyung Raya, Kecamatan Pancoran Mas & Sawangan, Kota Depok, Jawa Barat).

Tiga peran pengguna:

1. **Publik/Masyarakat** — melihat **dokumen publikasi resmi** yang diunggah admin (PDF daftar nominatif, pengumuman, peta bidang, SK, dll), melihat pengumuman data nominatif, luas tanah/bangunan/tanaman yang terkena pembebasan, SOP proses pengadaan, dan **mengajukan sanggahan/komentar** (baik terhadap bidang di data nominatif maupun terhadap dokumen publikasi yang diunggah).
2. **Admin** — **mengunggah & mengelola dokumen publikasi**, mengelola data nominatif, mengelola konten SOP/pengumuman, dan memproses (verifikasi, tanggapi, ubah status) sanggahan yang masuk.
3. **Super Admin** (opsional, kelola akun admin).

**Alur inti:** Admin mengunggah dokumen resmi pengadaan tanah → dokumen dipublikasikan ke halaman publik → masyarakat (khususnya pemilik tanah) membaca/mengunduh dokumen → jika ada data yang tidak sesuai, masyarakat mengajukan sanggahan/komentar yang terhubung ke dokumen atau bidang terkait → admin memproses sanggahan dengan status & audit trail.

Konteks dokumen resmi: Daftar Nominatif Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026, berisi 81 bidang. Ada juga formulir sanggahan resmi berformat PDF yang harus bisa diunduh dan sekaligus tersedia versi form online.

---

## 2. Tujuan & Non-Tujuan

**Tujuan**
- Transparansi publik atas data nominatif dan luasan yang terkena.
- Kanal digital resmi untuk menerima sanggahan masyarakat dalam masa sanggah (biasanya 14 hari kerja setelah pengumuman).
- Memudahkan admin memproses sanggahan secara terlacak (audit trail).
- Bisa dideploy ke Vercel maupun hosting Node/VPS sendiri.

**Non-Tujuan (di luar scope awal)**
- Integrasi pembayaran/ganti rugi.
- Peta GIS bidang tanah interaktif (sisakan sebagai enhancement opsional).
- Tanda tangan digital tersertifikasi.

---

## 3. Tech Stack (wajib)

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 14/15 (App Router) + TypeScript** | SSR/SSG, mudah deploy Vercel & self-host |
| UI | **Tailwind CSS + shadcn/ui** | cepat, konsisten, aksesibel |
| Database | **PostgreSQL** via **Prisma ORM** | portable; di Vercel pakai Neon/Supabase Postgres, di hosting pakai Postgres lokal. Sediakan juga opsi SQLite untuk dev lokal cepat |
| Auth | **Auth.js (NextAuth v5)** dengan Credentials (email+password) untuk admin | sederhana, tanpa vendor lock |
| File/PDF | **@react-pdf/renderer** atau generate PDF server-side untuk formulir sanggahan; upload lampiran via storage lokal / Vercel Blob / S3-compatible | fleksibel dua lingkungan |
| Validasi | **Zod** + **react-hook-form** | validasi form sanggahan |
| Tabel data | **@tanstack/react-table** | daftar nominatif besar (81+ baris), sort/filter/paginate |
| Email (opsional) | **Resend/Nodemailer** | notifikasi status sanggahan |

Gunakan environment variable untuk semua konfigurasi (DATABASE_URL, NEXTAUTH_SECRET, dll). Sediakan `.env.example`.

---

## 4. Model Data (Prisma Schema)

Buat schema kira-kira seperti berikut (sesuaikan penamaan):

```prisma
model Project {
  id            String   @id @default(cuid())
  namaProyek    String   // Pelebaran Simpang Parung Bingung ...
  nomorPeng     String   // 10/Peng-10.27/VII/2026
  tanggalPeng   DateTime // 31 Juli 2026
  kelurahan     String   // Rangkapan Jaya Baru
  kecamatan     String   // Pancoran Mas
  kota          String   // Kota Depok
  provinsi      String   // Jawa Barat
  masaSanggahMulai   DateTime?
  masaSanggahSelesai DateTime?
  deskripsi     String?  @db.Text
  bidang        Bidang[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Bidang {
  id              String   @id @default(cuid())
  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])
  noUrut          Int      // No. Urut
  noPetaBidang    String?  // No. Urut di Peta Bidang
  // Pihak yang berhak
  namaPemilik     String
  tanggalLahir    String?
  pekerjaan       String?
  alamat          String?  @db.Text
  nik             String?
  // Tanah
  nib             String?
  rtRw            String?  // 005/003
  danomNo         String?  // No. Danom
  luasSesuaiAlasHak Float? // m2
  luasHasilUkur   Float?   // m2
  nisTerkena      String?
  luasKena        Float?   // m2 yang terkena
  nisSisa         String?
  luasSisa        Float?   // m2
  suratTandaBukti String?  // SHM No .... / SHGB / SHP / dll
  // Ringkasan aset
  bangunanRingkas String?  @db.Text // ringkasan jenis+jumlah bangunan
  tanamanRingkas  String?  @db.Text
  keterangan      String?  @db.Text // PBT No, Surat Dinas, tanggal
  // Relasi detail (opsional, lihat di bawah)
  bangunan        BangunanItem[]
  tanaman         TanamanItem[]
  sanggahan       Sanggahan[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([projectId, noUrut])
}

model BangunanItem {
  id        String  @id @default(cuid())
  bidangId  String
  bidang    Bidang  @relation(fields: [bidangId], references: [id])
  jenis     String  // Bangunan Permanen, Lt Floor/Beton, Pagar, dll
  jumlah    Float?
  satuan    String? // m2, M1, unit
}

model TanamanItem {
  id        String  @id @default(cuid())
  bidangId  String
  bidang    Bidang  @relation(fields: [bidangId], references: [id])
  jenis     String  // Mangga, Rambutan, dll
  kecil     Int?
  sedang    Int?
  besar     Int?
  jumlah    Int?
}

model Sanggahan {
  id            String   @id @default(cuid())
  nomorTiket    String   @unique // auto: SGH-2026-0001
  projectId     String
  bidangId      String?  // optional, jika penyanggah tahu bidangnya
  bidang        Bidang?  @relation(fields: [bidangId], references: [id])
  dokumenId     String?  // optional, jika sanggahan ditujukan ke dokumen publikasi tertentu
  dokumen       DokumenPublikasi? @relation(fields: [dokumenId], references: [id])
  nama          String
  nik           String
  alasHak       String?
  noDanom       String?
  noPetaBidang  String?
  noNis         String?
  kontakEmail   String?
  kontakHp      String?
  isiSanggahan  String   @db.Text
  lampiranUrl   String?  // file bukti (opsional, bisa multiple -> tabel terpisah)
  status        SanggahanStatus @default(DITERIMA)
  catatanAdmin  String?  @db.Text
  riwayat       SanggahanLog[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum SanggahanStatus {
  DITERIMA      // baru masuk
  DIVERIFIKASI  // sedang ditinjau
  DITINDAKLANJUTI
  DITERIMA_SAH  // sanggahan diterima/valid
  DITOLAK       // sanggahan ditolak
  SELESAI
}

model SanggahanLog {
  id           String   @id @default(cuid())
  sanggahanId  String
  sanggahan    Sanggahan @relation(fields: [sanggahanId], references: [id])
  statusLama   String?
  statusBaru   String
  catatan      String?  @db.Text
  olehAdmin    String?
  createdAt    DateTime @default(now())
}

model SOPDoc {
  id        String   @id @default(cuid())
  judul     String
  slug      String   @unique
  konten    String   @db.Text // markdown/richtext tahapan proses
  urutan    Int      @default(0)
  fileUrl   String?  // lampiran PDF SOP jika ada
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pengumuman {
  id          String   @id @default(cuid())
  judul       String
  konten      String   @db.Text
  lampiranUrl String?
  tanggalTerbit DateTime @default(now())
  published   Boolean  @default(true)
}

model DokumenPublikasi {
  id            String   @id @default(cuid())
  projectId     String?
  judul         String   // mis. "Daftar Nominatif No. 10/Peng-10.27/VII/2026"
  deskripsi     String?  @db.Text
  kategori      KategoriDokumen @default(DAFTAR_NOMINATIF)
  fileUrl       String   // file yang diunggah (PDF/gambar)
  fileName      String
  fileType      String?  // application/pdf, image/jpeg, dll
  fileSize      Int?     // bytes
  nomorSurat    String?
  tanggalDokumen DateTime?
  tanggalUpload DateTime @default(now())
  published     Boolean  @default(true)
  // buka/tutup kanal sanggahan untuk dokumen ini
  sanggahanDibuka Boolean @default(true)
  jumlahUnduhan Int      @default(0)
  sanggahan     Sanggahan[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum KategoriDokumen {
  DAFTAR_NOMINATIF
  PENGUMUMAN
  PETA_BIDANG
  SK_PENETAPAN_LOKASI
  SOP
  BERITA_ACARA
  LAINNYA
}

model User {
  id        String   @id @default(cuid())
  nama      String
  email     String   @unique
  password  String   // hashed (bcrypt)
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

enum Role {
  SUPER_ADMIN
  ADMIN
}
```

---

## 5. Fitur — Sisi Publik (tanpa login)

### 5.1 Beranda
- Judul proyek, nomor & tanggal pengumuman, lokasi.
- Banner masa sanggah: countdown "Masa sanggah berakhir dalam X hari" jika `masaSanggahSelesai` aktif; jika lewat, tampilkan status "Masa sanggah telah berakhir".
- Tombol besar: **Lihat Data Nominatif**, **Ajukan Sanggahan**, **SOP Pengadaan**, **Unduh Formulir Sanggahan (PDF)**.

### 5.2 Halaman Data Nominatif (`/data-nominatif`)
- Tabel semua bidang: No Urut, Nama Pemilik, NIB, RT/RW, Luas Sesuai Alas Hak, Luas Hasil Ukur, Luas Terkena, Luas Sisa, Surat Tanda Bukti, Keterangan.
- Fitur: **search** (nama/NIB/no urut), **filter** (kelurahan/RT-RW/jenis alas hak SHM/SHGB/SHP), **sort**, **pagination**, **export CSV**.
- Klik baris → halaman **detail bidang** (`/data-nominatif/[noUrut]`) menampilkan seluruh kolom termasuk rincian bangunan & tanaman, plus tombol "Ajukan Sanggahan untuk bidang ini" (prefill bidang).
- Ringkasan statistik di atas tabel: total bidang, total luas terkena (m²), jumlah bidang per jenis alas hak.

### 5.3 Halaman Dokumen Publikasi (`/dokumen`) — BARU
- Daftar semua dokumen resmi yang diunggah admin (kartu/list): judul, kategori (Daftar Nominatif / Pengumuman / Peta Bidang / SK Penetapan Lokasi / Berita Acara / dll), nomor surat, tanggal dokumen, ukuran file.
- Filter berdasarkan kategori & pencarian judul.
- Setiap dokumen bisa **dilihat (preview PDF inline)** dan **diunduh** (hitung `jumlahUnduhan`).
- Halaman **detail dokumen** (`/dokumen/[id]`): preview dokumen + metadata + tombol **"Ajukan Sanggahan atas dokumen ini"** (prefill `dokumenId`) selama `sanggahanDibuka = true` dan masa sanggah masih berjalan.
- Di detail dokumen tampilkan juga ringkasan: "Jika data Anda pada dokumen ini tidak sesuai, silakan ajukan sanggahan." dengan tombol jelas.
- (Opsional) tampilkan daftar sanggahan yang sudah **berstatus publik/ditanggapi** untuk dokumen tsebagai bentuk transparansi — sembunyikan data pribadi penyanggah (hanya inisial + isi + tanggapan admin), aktifkan lewat pengaturan admin.

### 5.4 Halaman SOP (`/sop`)
- Daftar tahapan proses pengadaan lahan (perencanaan → penetapan lokasi → pengumuman data nominatif → masa sanggah → verifikasi → penetapan → musyawarah ganti rugi → pembayaran → pelepasan hak). Konten dari `SOPDoc`, dirender dari markdown.
- Bisa lampiran PDF per SOP.

### 5.5 Halaman Ajukan Sanggahan (`/sanggahan/baru`)
Form online yang mereplikasi formulir PDF resmi, field:
- Nama, NIK, Alas Hak, No. Danom, No. Peta Bidang, No. NIS
- (opsional) pilih **Bidang terkait** dari dropdown (dari data nominatif)
- (opsional) pilih **Dokumen publikasi terkait** dari dropdown (dari daftar dokumen) — terisi otomatis jika masuk dari tombol "Ajukan Sanggahan atas dokumen ini"
- Kontak: email dan/atau nomor HP
- Isi sanggahan/komentar (textarea, wajib)
- Upload lampiran bukti (opsional, PDF/JPG/PNG, maks mis. 5MB)
- Checkbox pernyataan kebenaran data
- Validasi Zod (NIK 16 digit, dsb).
- **Blokir submit jika masa sanggah sudah lewat** atau jika `sanggahanDibuka = false` pada dokumen terkait (tampilkan pesan), kecuali admin menonaktifkan pembatasan.
- Setelah submit: buat `nomorTiket` unik, tampilkan halaman sukses dengan nomor tiket + tombol "Lacak status sanggahan".

### 5.6 Lacak Sanggahan (`/sanggahan/lacak`)
- Input nomor tiket + NIK → tampilkan status terkini dan riwayat (log) tanpa membocorkan data orang lain.

### 5.7 Unduh Formulir PDF
- Endpoint yang men-generate PDF formulir sanggahan resmi (judul proyek, field kosong: Nama/NIK/Alas Hak/No Danom/No Peta Bidang/No NIS, area pernyataan, tempat tanda tangan "Depok, ..." ) — mereplikasi `Data_Form_Sanggahan.pdf`. Sediakan juga versi terisi otomatis dari data form online (opsional).

---

## 6. Fitur — Sisi Admin (`/admin`, wajib login)

### 6.1 Dashboard
- Kartu ringkasan: total bidang, total sanggahan per status, sisa hari masa sanggah, sanggahan baru hari ini.

### 6.2 Kelola Proyek/Pengumuman
- Edit metadata proyek, atur tanggal masa sanggah mulai/selesai, toggle publish.
- CRUD Pengumuman.

### 6.3 Kelola Dokumen Publikasi — BARU
- **Upload dokumen** (drag & drop): pilih file (PDF/JPG/PNG), isi judul, kategori, nomor surat, tanggal dokumen, deskripsi.
- Simpan file ke storage (Vercel Blob / S3 / folder lokal sesuai lingkungan) dan simpan metadata ke `DokumenPublikasi`.
- Tabel daftar dokumen: judul, kategori, tanggal, jumlah unduhan, status publish, status kanal sanggahan.
- Aksi: edit metadata, ganti file, **toggle published** (tampil/sembunyi di publik), **toggle sanggahanDibuka** (buka/tutup kanal sanggahan per dokumen), hapus.
- Lihat daftar sanggahan yang terhubung ke tiap dokumen langsung dari detail dokumen.

### 6.4 Kelola Data Nominatif
- CRUD Bidang (form lengkap sesuai schema) + CRUD BangunanItem & TanamanItem per bidang.
- **Import massal via CSV/Excel** (penting, karena 81 bidang) dengan preview & validasi sebelum commit.
- Export data.

### 6.5 Kelola SOP
- CRUD SOPDoc dengan editor markdown, atur urutan, upload lampiran.

### 6.6 Kelola Sanggahan (inti)
- Tabel semua sanggahan: nomor tiket, nama, **bidang/dokumen terkait**, status, tanggal, filter & search.
- Detail sanggahan: lihat isi, lampiran, data pengaju, bidang terkait, **dokumen publikasi terkait** (dengan link ke dokumennya).
- Aksi: ubah status (dengan dropdown enum), tulis catatan/tanggapan admin → setiap perubahan tercatat di `SanggahanLog` (audit trail: siapa, kapan, dari status apa ke apa).
- (Opsional) tandai sebuah sanggahan+tanggapan sebagai **publik** agar tampil di detail dokumen (transparansi), dengan data pribadi disamarkan.
- (Opsional) kirim email notifikasi ke pengaju saat status berubah.
- Export rekap sanggahan (CSV/PDF) untuk laporan panitia.

### 6.7 Kelola User (Super Admin)
- CRUD akun admin, reset password, atur role.

---

## 7. Non-Fungsional
- **Responsif** (mobile-first) — mayoritas warga akses via HP.
- **Aksesibilitas** WCAG dasar, kontras baik, label form jelas, Bahasa Indonesia.
- **Keamanan**: password di-hash (bcrypt), proteksi route admin via middleware, rate-limit endpoint submit sanggahan, sanitasi input, validasi ukuran/tipe file upload, CSRF/lewat Auth.js.
- **Privasi**: NIK jangan ditampilkan penuh di area publik (mask jadi `3276●●●●●●●●0003`). Hanya admin yang lihat penuh.
- **SEO & aksesibilitas dokumen**: metadata OpenGraph, sitemap.
- **Audit trail** untuk sanggahan wajib.
- **i18n** minimal: seluruh UI Bahasa Indonesia.

---

## 8. Seed Data (wajib disiapkan)
Buat script seed Prisma yang mengisi:
1. Satu `Project` sesuai dokumen resmi (Nomor 10/Peng-10.27/VII/2026, 31 Juli 2026, Rangkapan Jaya Baru, Pancoran Mas, Kota Depok, Jawa Barat).
2. Sampel beberapa `Bidang` dari daftar nominatif (mis. 10–15 baris pertama: Gang; Sudirman; Adi Supriyadi; Syafrizal; Thomas Hosean Ciovanlee; Budiman Sinaga; Ong Handi Irawan; PT Maira Graha Sarana; Hidayat; dll — lengkap dengan luas & alas hak yang ada di dokumen).
3. Beberapa `SOPDoc` tahapan proses pengadaan.
4. Satu-dua `DokumenPublikasi` contoh (kategori DAFTAR_NOMINATIF & PENGUMUMAN) memakai file PDF placeholder di folder `public/dokumen-contoh/`, `sanggahanDibuka = true`.
5. Satu akun admin default (email/password dari env) untuk login pertama.

Sertakan file `data/nominatif.csv` berisi seluruh 81 bidang (template kolom) agar admin bisa import; isi contoh minimal 15 baris dari dokumen, sisanya template kosong dengan header benar.

---

## 9. Struktur Halaman (routing)

```
/                         Beranda
/dokumen                  Daftar dokumen publikasi + filter kategori
/dokumen/[id]             Detail/preview dokumen + tombol sanggah
/data-nominatif           Tabel + filter
/data-nominatif/[noUrut]  Detail bidang
/sop                      Daftar SOP
/sop/[slug]               Detail SOP
/pengumuman               Daftar pengumuman
/sanggahan/baru           Form sanggahan (bisa prefill bidang/dokumen)
/sanggahan/sukses         Konfirmasi + nomor tiket
/sanggahan/lacak          Lacak status
/api/formulir-pdf         Generate PDF formulir
/api/dokumen/[id]/unduh   Unduh file + increment counter
/admin/login              Login admin
/admin                    Dashboard
/admin/proyek
/admin/dokumen            List + upload dokumen publikasi
/admin/dokumen/[id]       Edit metadata + lihat sanggahan terkait
/admin/nominatif          List + import
/admin/nominatif/[id]     Edit bidang
/admin/sop
/admin/pengumuman
/admin/sanggahan          List
/admin/sanggahan/[id]     Detail + ubah status
/admin/users              (super admin)
```

---

## 10. Deployment (wajib jalan di dua lingkungan)

> **Catatan storage:** karena ada fitur upload dokumen publikasi & lampiran sanggahan, buat lapisan storage yang bisa dikonfigurasi via env (`STORAGE_DRIVER=blob|s3|local`). Di Vercel gunakan Vercel Blob/S3 (filesystem Vercel bersifat read-only/ephemeral, jangan simpan ke disk). Di VPS boleh pakai folder lokal.

**A. Vercel**
- Postgres: Neon atau Supabase (set `DATABASE_URL`).
- Storage dokumen & lampiran: Vercel Blob atau S3-compatible (WAJIB, bukan disk lokal).
- `postinstall`: `prisma generate`; build: `prisma migrate deploy && next build`.
- Dokumentasikan env di README.

**B. Self-host / Hosting VPS (Node)**
- `docker-compose.yml` opsional (app + Postgres).
- Script: `npm run build && npm run start` (port dari env).
- Panduan Nginx reverse proxy + PM2 di README.
- Storage lampiran: folder lokal `/uploads` (path via env) sebagai fallback.

Sertakan **README.md** lengkap: setup lokal (SQLite cepat), migrasi, seed, buat admin, deploy Vercel, deploy VPS, dan variabel environment.

---

## 11. Kriteria Selesai (Definition of Done)
- [ ] **Admin bisa mengunggah dokumen resmi (PDF/gambar) dan mempublikasikannya.**
- [ ] **Publik bisa melihat, preview, dan mengunduh dokumen publikasi (dengan hitung unduhan).**
- [ ] **Publik bisa mengajukan sanggahan/komentar yang terhubung ke dokumen publikasi maupun ke bidang data nominatif.**
- [ ] **Admin bisa buka/tutup kanal sanggahan per dokumen.**
- [ ] Publik bisa lihat data nominatif (search/filter/detail) dengan NIK termask.
- [ ] Publik bisa baca SOP & pengumuman.
- [ ] Publik bisa unduh formulir PDF sanggahan.
- [ ] Publik bisa ajukan sanggahan online + dapat nomor tiket + lacak status.
- [ ] Pembatasan masa sanggah berfungsi.
- [ ] Admin bisa login, CRUD nominatif (termasuk import CSV), SOP, pengumuman.
- [ ] Admin bisa proses sanggahan (bidang & dokumen) dengan audit trail + ubah status.
- [ ] Seed data terisi & app jalan `npm run dev` tanpa error.
- [ ] Berhasil build untuk Vercel dan self-host; README jelas.
- [ ] Responsif di mobile & desktop.

---

## 12. Urutan Pengerjaan yang Diminta ke Claude Code
1. Scaffold Next.js + Tailwind + shadcn + Prisma + Auth.js; buat `.env.example` & README awal.
2. Definisikan Prisma schema (bagian 4) + migrasi + seed (bagian 8).
3. Layout publik + Beranda + navigasi.
4. **Dokumen Publikasi** (upload di admin + halaman publik list/preview/unduh).
5. Data Nominatif (list, filter, detail, export, mask NIK).
6. SOP & Pengumuman (publik).
7. Form Sanggahan + nomor tiket + lacak + generate PDF formulir (bisa terhubung ke bidang & dokumen).
8. Auth admin + middleware proteksi.
9. Admin: dashboard, kelola dokumen, kelola nominatif (+import CSV), SOP, pengumuman.
10. Admin: kelola sanggahan + audit trail + ubah status (+email opsional).
11. Kelola user (super admin).
12. Finalisasi: dokumentasi deploy Vercel & VPS, cek DoD.

Konfirmasikan rencana teknis singkat sebelum menulis kode dalam jumlah besar, lalu kerjakan bertahap dengan commit yang jelas per fitur.

---

## 13. Prompt Ringkas (alternatif, untuk langsung tempel ke Claude Code)

> Bangun website end-to-end untuk publikasi pengadaan tanah kepentingan umum (Pelebaran Simpang Parung Bingung, Kota Depok) dengan **Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui + Prisma + PostgreSQL + Auth.js**. Tiga peran: publik, admin, super admin.
>
> Sisi publik: beranda dengan info proyek & countdown masa sanggah; halaman **dokumen publikasi** tempat masyarakat melihat, preview, dan mengunduh dokumen resmi yang diunggah admin (PDF daftar nominatif, pengumuman, peta bidang, SK, dll) — di tiap dokumen ada tombol "Ajukan Sanggahan atas dokumen ini"; halaman **data nominatif** (tabel 81 bidang: nama pemilik, NIB, RT/RW, luas alas hak, luas hasil ukur, **luas terkena**, luas sisa, surat tanda bukti, keterangan) dengan search/filter/sort/pagination/export CSV dan halaman detail per bidang (termasuk rincian bangunan & tanaman); halaman **SOP** proses pengadaan; **form sanggahan online** (field: Nama, NIK, Alas Hak, No. Danom, No. Peta Bidang, No. NIS, isi sanggahan, lampiran, dan pilihan **bidang atau dokumen** yang disanggah) yang menghasilkan **nomor tiket** dan bisa **dilacak**; serta endpoint **generate PDF formulir sanggahan** resmi. NIK dimask di area publik. Submit sanggahan diblokir jika masa sanggah lewat atau kanal sanggahan dokumen ditutup.
>
> Sisi admin (login wajib): dashboard statistik; **upload & kelola dokumen publikasi** (judul, kategori, nomor surat, tanggal, toggle publish, toggle buka/tutup kanal sanggahan per dokumen); CRUD data nominatif dengan **import CSV massal**; CRUD SOP & pengumuman; **kelola sanggahan** (terhubung ke bidang maupun dokumen) dengan ubah status (DITERIMA/DIVERIFIKASI/DITINDAKLANJUTI/DITERIMA_SAH/DITOLAK/SELESAI), catatan admin, dan **audit trail** (SanggahanLog); kelola user untuk super admin.
>
> Sediakan Prisma schema, migrasi, **seed** (proyek Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026 + ~15 bidang contoh dari dokumen + SOP + admin default), template `data/nominatif.csv`, `.env.example`, dan **README** cara deploy ke **Vercel** (Neon/Supabase + Vercel Blob) dan ke **self-host VPS** (Postgres lokal + Nginx + PM2, opsional Docker). Semua UI Bahasa Indonesia, responsif mobile-first, dengan validasi Zod dan keamanan dasar (hash password, proteksi route, rate-limit, validasi upload). Konfirmasikan rencana lalu kerjakan bertahap per fitur dengan commit jelas.
