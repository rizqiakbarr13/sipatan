# Panduan Penggunaan SIPATAN

**SIPATAN — Sistem Informasi Pengadaan Tanah** adalah portal resmi untuk publikasi dokumen, data nominatif, SOP, dan kanal sanggahan masyarakat terkait pengadaan tanah untuk kepentingan umum.

Panduan ini dibagi dua:

- [Bagian A — Panduan Warga / Masyarakat](#bagian-a--panduan-warga--masyarakat) (halaman publik)
- [Bagian B — Panduan Admin / Petugas](#bagian-b--panduan-admin--petugas) (panel `/admin`)

---

# Bagian A — Panduan Warga / Masyarakat

## A1. Mengenal Halaman Utama

Menu di bagian atas (header) tersedia di semua halaman:

| Menu | Fungsi |
|---|---|
| **Beranda** | Ringkasan proyek, pintasan layanan, pengumuman terbaru, galeri kegiatan |
| **Dokumen Publikasi** | Daftar dokumen resmi yang bisa dilihat/diunduh |
| **Data Nominatif** | Daftar bidang tanah yang terkena dampak |
| **SOP** | Tahapan proses pengadaan tanah |
| **Pengumuman** | Pengumuman resmi dari petugas |
| **Lacak Sanggahan** | Memantau status sanggahan yang sudah diajukan |
| **FAQ / Kontak** | Pertanyaan umum dan cara menghubungi petugas |

Di header juga ada:

- **Tombol matahari/bulan** — ganti tema terang/gelap (tersimpan di browser Anda).
- **Tombol bahasa** — ganti antara Bahasa Indonesia dan English. Yang diterjemahkan hanya tampilan menu/tombol/form; isi pengumuman, SOP, dan data nominatif tetap bahasa aslinya karena merupakan konten resmi.
- **Masuk / Daftar** — untuk akun warga (lihat A2).

Jika ada lebih dari satu proyek, banyak halaman menyediakan **tab filter proyek** (mis. "Semua Proyek") agar Anda bisa menyaring data.

## A2. Membuat Akun Warga dan Masuk

> **Akun warga wajib** untuk mengajukan sanggahan. Anda tetap bisa memilih mengajukan secara *anonim* setelah masuk (lihat A7).

**Mendaftar**

1. Klik **Daftar** di header (atau buka `/akun/daftar`).
2. Isi **Nama Lengkap, Email, Kata Sandi, Konfirmasi Kata Sandi, NIK (16 digit), dan No. HP**.
3. Periksa NIK dan No. HP dengan teliti — data ini tersimpan di akun dan dipakai untuk mengisi otomatis formulir sanggahan.
4. Klik **Daftar**.

**Masuk**

1. Klik **Masuk** (atau buka `/akun/masuk`).
2. Masukkan email dan kata sandi, lalu klik **Masuk**.

Jika Anda mencoba mengajukan sanggahan saat belum masuk, Anda otomatis diarahkan ke halaman masuk, lalu dikembalikan ke formulir setelah berhasil login.

**Lupa kata sandi?** Hubungi petugas lewat halaman Kontak. Admin dapat mereset kata sandi Anda dan memberikan kata sandi sementara.

## A3. Melihat Dokumen Publikasi

Menu **Dokumen Publikasi**:

1. Gunakan kolom pencarian untuk mencari berdasarkan judul/nomor surat.
2. Filter berdasarkan **kategori** (Daftar Nominatif, Pengumuman, Peta Bidang, SK Penetapan Lokasi, SOP, Berita Acara, Lainnya), lalu klik **Terapkan**.
3. Klik **Lihat** untuk membuka detail dokumen (nomor surat, tanggal, ukuran file, jumlah unduhan), atau **Unduh** untuk mengunduh file.
4. Di halaman detail, jika kanal sanggahan dokumen tersebut dibuka, tombol **Ajukan Sanggahan atas Dokumen Ini** akan muncul. Sanggahan yang sudah ditanggapi dan dibuka petugas untuk publik juga ditampilkan di sana.

## A4. Melihat Data Nominatif

Menu **Data Nominatif** menampilkan tabel bidang tanah yang terkena dampak, beserta total bidang dan total luas terkena.

- **Cari** berdasarkan nama/nomor, **filter** berdasarkan alas hak, dan **urutkan** dengan klik judul kolom. Navigasi antar-halaman ada di bawah tabel.
- **Export CSV** — mengunduh data tabel dalam format CSV.
- Klik sebuah bidang untuk melihat **halaman detail**: data pemilik, luas, letak, rincian bangunan, tanaman, dan benda lain.
- Untuk melindungi privasi, **NIK, tanggal lahir, pekerjaan, dan alamat ditampilkan sebagian (disamarkan)**.
- Jika data bidang Anda tidak sesuai, klik **Ajukan Sanggahan untuk Bidang Ini** di halaman detail — formulir akan otomatis terisi bidang tersebut.

## A5. Membaca SOP

Menu **SOP** menampilkan tahapan pengadaan tanah berurutan. Klik salah satu tahap untuk membaca isinya. Jika ada lampiran, tombol **Unduh Lampiran** tersedia.

## A6. Membaca Pengumuman

Menu **Pengumuman**:

- Cari berdasarkan kata kunci, filter status kanal sanggahan (**Dibuka / Ditutup**), dan urutkan **Terbaru / Terlama**.
- Beberapa pengumuman punya tautan ke **dokumen terkait** atau **data nominatif**.
- Pengumuman yang kanal sanggahannya dibuka menampilkan tombol untuk mengajukan sanggahan.
- Beranda juga menampilkan carousel pengumuman terbaru.

## A7. Mengajukan Sanggahan

Sanggahan bisa diajukan dari tiga tempat: halaman **Dokumen** (detail dokumen), **Pengumuman**, atau **Data Nominatif** (detail bidang). Atau lewat tombol **Ajukan Sanggahan** di header/beranda.

**Langkah-langkah:**

1. Pastikan sudah **masuk** ke akun warga.
2. Buka formulir **Ajukan Sanggahan** (`/sanggahan/baru`).
3. *(Opsional)* Centang **"Ajukan sebagai anonim"** bila sanggahan tidak ingin dikaitkan ke akun Anda. Jika tidak dicentang, data Anda terisi otomatis dan sanggahan tersimpan di riwayat akun.
4. **Bagian Identitas**
   - Pilih **Proyek terkait** (wajib).
   - Nama dan NIK (terisi otomatis dari akun).
   - Isi **Alas Hak, No. Danom, No. Peta Bidang, No. NIS** bila relevan.
   - Pilih **Bidang terkait**, **Dokumen terkait**, atau **Pengumuman terkait** (semuanya opsional; pilih proyek dulu agar daftar muncul).
   - Isi **Email** dan/atau **No. HP** (minimal salah satu — email diperlukan bila ingin menerima notifikasi status). No. HP berformat diawali `0`, mis. `081234567890`.
5. **Bagian Pernyataan**
   - Tulis **Isi Sanggahan** dengan jelas dan rinci (**minimal 20 karakter**).
6. **Bagian Bukti**
   - **Lampiran** — unggah satu atau beberapa berkas bukti (PDF/JPG/PNG/WEBP; ukuran maksimal sesuai batas server, default 10 MB per file). Berkas yang salah bisa dihapus sebelum dikirim.
   - **Tabel Bukti Tambahan** — klik **Tambah Baris Bukti** untuk mendaftar bukti (mis. "Sertifikat", "PBB") beserta keterangannya. Maksimal 10 baris.
7. Centang **pernyataan bahwa data yang disampaikan benar**, lalu klik **Kirim**.

**Setelah terkirim**, Anda melihat halaman sukses berisi **Nomor Tiket** (format `SGH-2026-0001`).

- **Salin dan simpan nomor tiket** — dipakai untuk melacak status.
- Klik **Unduh Bukti** untuk mengunduh bukti pengajuan dalam format PDF.
- Jika mengisi email, Anda menerima email konfirmasi.

**Catatan penting**

- **Masa sanggah 14 hari kalender** sejak tanggal pengumuman proyek. Setelah lewat, pengajuan ditolak sistem.
- **Kanal ditutup per item.** Jika petugas menutup kanal sanggahan pada suatu dokumen/pengumuman, Anda akan melihat pesan "Kanal sanggahan ditutup" dan tidak bisa mengajukan lewat item itu.
- Ada pembatasan **5 pengajuan per jam per alamat IP**.
- Petugas menargetkan tanggapan dalam **3–4 hari kerja**.

## A8. Mengunduh Formulir Sanggahan (PDF)

Jika Anda lebih nyaman mengisi manual, di beranda atau footer pilih **Unduh Formulir Sanggahan / Unduh Formulir PDF**. Bila ada beberapa proyek, pilih proyek dulu agar formulir sudah memuat identitas proyek terkait. Formulir dapat dicetak dan diserahkan ke kantor.

## A9. Melacak Status Sanggahan

Ada dua cara:

**Dengan nomor tiket**

1. Buka menu **Lacak Sanggahan**.
2. Masukkan **Nomor Tiket** dan **NIK (16 digit)**, klik tombol cari.
3. Halaman detail menampilkan status, bidang/dokumen/pengumuman terkait, lampiran dan bukti, **catatan/tanggapan petugas**, perkiraan tanggapan, serta **riwayat perubahan status**. Anda dapat mengunduh bukti pengajuan PDF dari sini.

**Lewat akun warga**

1. Masuk, lalu buka **Akun Saya → Sanggahan Saya** (`/akun`).
2. Seluruh sanggahan yang diajukan lewat akun (tidak anonim) tercantum di riwayat. Klik salah satu untuk melihat detail.

**Arti status**

| Status | Arti |
|---|---|
| Diterima | Sanggahan sudah masuk ke sistem |
| Diverifikasi | Petugas sedang memeriksa kelengkapan/kebenaran |
| Ditindaklanjuti | Sedang diproses lebih lanjut (mis. cek lapangan) |
| Diterima / Sah | Sanggahan dinyatakan sah |
| Ditolak | Sanggahan tidak dapat diterima (lihat catatan petugas) |
| Selesai | Proses sanggahan tuntas |

Setiap kali status berubah, Anda menerima email pemberitahuan (jika email diisi).

## A10. Menghubungi Petugas

Menu **Kontak** menampilkan alamat kantor, email, telepon/WhatsApp, dan jam layanan. Menu **FAQ** menjawab pertanyaan umum.

---

# Bagian B — Panduan Admin / Petugas

## B1. Masuk ke Panel Admin

1. Buka `/admin/login`.
2. Masukkan email dan kata sandi akun admin, lalu masuk.
3. Untuk keluar, klik **Keluar** di bagian bawah sidebar.

Sidebar kiri berisi seluruh menu admin. Tombol matahari/bulan di kepala sidebar mengganti tema. Panel admin selalu berbahasa Indonesia.

**Dua peran akun:**

| Peran | Hak akses |
|---|---|
| **Super Admin** | Semua menu, termasuk **Kelola User** |
| **Admin** | Semua menu kecuali Kelola User |

Konvensi yang berlaku di semua halaman admin:

- Tombol **Simpan** menampilkan dialog konfirmasi sebelum menyimpan; hapus juga meminta konfirmasi.
- Hasil aksi muncul sebagai notifikasi (toast) di layar.
- **Toggle "Publikasi"** menentukan apakah item tampil di situs publik.
- **Toggle "Sanggahan dibuka"** menentukan apakah warga boleh mengajukan sanggahan lewat item tersebut.

## B2. Dashboard

Menu **Dashboard** memberi ringkasan:

- Kartu: **Total Bidang, Total Dokumen Publikasi, Sanggahan Baru Hari Ini, Warga Terdaftar**.
- Grafik: **Sanggahan per Status**, **Sanggahan Masuk** per hari, **Pendaftaran Warga Baru**, dan tren dokumen.
- **Aktivitas terbaru** (mis. perubahan status sanggahan beserta nama petugas).
- **Filter periode** untuk mengubah rentang hari pada grafik.

## B3. Proyek

Menu **Proyek** — setiap proyek pengadaan tanah dibuat di sini lebih dulu, karena dokumen, bidang, pengumuman, dan sanggahan dikaitkan ke proyek. Sistem mendukung **banyak proyek sekaligus**.

**Tambah proyek:** klik **Tambah**, isi Nama Proyek, Nomor Pengumuman, Tanggal Pengumuman, Kelurahan, Kecamatan, Kota, Provinsi, dan Deskripsi, lalu simpan.

**Edit / hapus:** lewat menu aksi di baris proyek.

Tips:
- Proyek terbaru dipakai sebagai sorotan di beranda dan dashboard.
- Masa sanggah dihitung **14 hari kalender sejak tanggal pengumuman**; pastikan tanggal pengumuman benar.
- Hapus proyek hanya bila belum ada data yang terkait.

## B4. Dokumen Publikasi

Menu **Dokumen Publikasi** — mengelola file resmi (PDF/gambar).

**Unggah dokumen baru:**

1. Klik **Tambah** → isi **Judul**, **Kategori**, **Proyek Terkait**, Nomor Surat, Tanggal Dokumen, Deskripsi.
2. Pilih file, lalu simpan.

**Mengelola:**

- **Edit metadata** — ubah judul/kategori/nomor surat dll. (file tetap).
- **Toggle Publikasi** — sembunyikan/tampilkan di situs publik.
- **Toggle Sanggahan Dibuka** — buka/tutup kanal sanggahan khusus dokumen ini (default: terbuka).
- **Hapus** — menghapus dokumen.
- Kolom jumlah unduhan menunjukkan berapa kali file diunduh warga.

## B5. Data Nominatif

Menu **Data Nominatif** — data bidang tanah yang terkena dampak.

**Tambah satu bidang secara manual:**

1. Klik **Tambah** → isi No. Urut, No. Peta Bidang, Nama Pemilik, Tanggal Lahir, Pekerjaan, Alamat, NIK, NIB, RT/RW, letak kelurahan/kecamatan, No. Danom, luas (sesuai alas hak, hasil ukur, terkena, sisa), NIS, surat tanda bukti, keterangan, serta proyek.
2. Simpan. Di halaman edit bidang, kelola **rincian item**:
   - **Bangunan**, **Tanaman**, dan **Benda Lain** — tambah/hapus baris item terstruktur.

**Impor massal** — klik **Impor** (`/admin/nominatif/impor`), pilih tab:

*Import CSV*
1. Pilih **proyek tujuan**.
2. Unggah CSV. Template ada di `data/nominatif.csv` (kolom: noUrut, noPetaBidang, namaPemilik, tanggalLahir, pekerjaan, alamat, nik, nib, rtRw, letakKelurahan, letakKecamatan, danomNo, luasSesuaiAlasHak, luasHasilUkur, nisTerkena, luasKena, nisSisa, luasSisa, suratTandaBukti, bangunanRingkas, tanamanRingkas, keterangan).
3. Periksa **preview**: baris valid dan baris error (beserta alasannya) ditampilkan.
4. Simpan. Impor bersifat *upsert*: **No. Urut yang sudah ada diperbarui, yang belum ada dibuat baru** — aman diulang.

*Import PDF*
1. Pilih proyek tujuan, unggah PDF Daftar Nominatif berbentuk tabel.
2. Sistem membaca header kolom secara otomatis dan menampilkan preview serta peringatan.
3. Koreksi hasil bila perlu (cek baris error), lalu simpan. Hasil ekstraksi PDF bisa tidak sempurna untuk PDF hasil scan atau tata letak tak lazim — **selalu periksa preview** sebelum menyimpan.

**Catatan:** admin melihat data lengkap tanpa masking; halaman publik menyamarkan NIK, tanggal lahir, pekerjaan, dan alamat.

## B6. SOP

Menu **SOP** — tahapan prosedur pengadaan tanah.

1. **Tambah**: isi **Judul**, **Slug** (bagian URL, mis. `penetapan-lokasi`), **Urutan** (angka kecil tampil lebih dulu), **Konten** dalam format **Markdown**, dan (opsional) **URL Lampiran PDF**.
2. Centang **Publikasikan** agar tampil publik. Simpan.
3. Edit, hapus, atau ubah status publikasi lewat baris daftar.

## B7. Pengumuman

Menu **Pengumuman**.

1. **Tambah**: isi **Judul**, **Konten**, Tanggal Terbit, **Proyek Terkait**, URL Lampiran (opsional), dan **Dokumen Terkait** (opsional).
2. Opsi **Tautkan Data Nominatif** — menampilkan tautan ke data nominatif di pengumuman.
3. Centang **Publikasikan** agar terlihat publik.
4. Dari daftar, gunakan **toggle Publikasi** dan **toggle Sanggahan Dibuka** (default: tertutup — buka bila pengumuman ini memang menerima sanggahan).

## B8. Sanggahan (Inti Pekerjaan Petugas)

Menu **Sanggahan** — semua sanggahan masuk.

**Menyaring daftar:** cari kata kunci, filter **status**, dan rentang tanggal **dari–sampai**. Klik **Export CSV** untuk mengunduh daftar sesuai filter yang sedang aktif.

**Menanggapi satu sanggahan:**

1. Klik sanggahan untuk membuka detail: identitas pengaju (NIK penuh terlihat oleh admin), bidang/dokumen/pengumuman terkait, isi sanggahan, lampiran dan tabel bukti, serta riwayat status.
2. Di panel **Ubah Status**, pilih status baru (Diterima → Diverifikasi → Ditindaklanjuti → Diterima/Sah atau Ditolak → Selesai).
3. Isi **Catatan / Tanggapan Admin** — ini dibaca pengaju di halaman lacak.
4. Klik **Simpan Perubahan** dan konfirmasi.
5. Sistem mencatat perubahan ke riwayat (beserta nama Anda) dan **mengirim email** ke pengaju bila email diisi.

**Tampil Publik:** toggle ini menampilkan sanggahan (dan tanggapannya) di halaman dokumen/bidang terkait sebagai bentuk transparansi. Pastikan isi tidak memuat data pribadi sebelum mengaktifkannya.

## B9. Akun Warga

Menu **Akun Warga** — daftar warga yang mendaftar.

- **Reset kata sandi:** menghasilkan kata sandi sementara yang tampil sekali; sampaikan ke warga yang bersangkutan dan minta segera diganti/dijaga.
- **Hapus akun:** menghapus akun warga.

## B10. Galeri Kegiatan

Menu **Galeri Kegiatan** — foto kegiatan yang tampil di beranda.

1. **Tambah**: isi **Caption / Judul Foto**, pilih foto (JPG/PNG/WEBP, maks. 10 MB).
2. Edit caption/ganti foto, hapus, atau **toggle Publikasi** dari daftar.
3. Di beranda, warga bisa klik foto untuk memperbesar.

## B11. Kelola User (khusus Super Admin)

Menu **Kelola User**:

1. **Tambah**: isi nama, email, kata sandi, dan pilih peran (**Admin** atau **Super Admin**).
2. **Edit** data/peran, atau **hapus** akun petugas yang sudah tidak bertugas.
3. Berikan peran Super Admin seperlunya saja.

---

# Bagian C — Alur Kerja yang Disarankan (Admin)

Urutan persiapan proyek baru:

1. **Proyek** → buat proyek (tanggal pengumuman menentukan masa sanggah 14 hari).
2. **Data Nominatif** → impor CSV/PDF, lalu periksa dan lengkapi rincian bangunan/tanaman.
3. **Dokumen Publikasi** → unggah Daftar Nominatif, Pengumuman, Peta Bidang, SK, dll.
4. **SOP** → pastikan tahapan sudah tayang.
5. **Pengumuman** → terbitkan dan buka kanal sanggahan.
6. Selama masa sanggah, pantau **Dashboard** dan tangani antrean di **Sanggahan** (target tanggapan 3–4 hari kerja).
7. Setelah masa sanggah selesai, tutup toggle sanggahan pada dokumen/pengumuman terkait dan ekspor rekap lewat **Export CSV**.

---

# Bagian D — Pertanyaan Umum & Pemecahan Masalah

| Masalah | Penyebab / Solusi |
|---|---|
| Tidak bisa membuka formulir sanggahan | Anda belum masuk — daftar/masuk dulu di `/akun/masuk` |
| Pesan "Masa sanggah telah berakhir" | Sudah lewat 14 hari dari tanggal pengumuman proyek; hubungi petugas |
| Pesan "Kanal sanggahan ditutup" | Petugas menutup kanal pada dokumen/pengumuman itu; coba lewat item lain atau hubungi petugas |
| Gagal mengirim sanggahan | Cek isi ≥ 20 karakter, NIK 16 digit, No. HP diawali `0`, email valid, ukuran lampiran tidak melebihi batas, dan belum melewati 5 pengajuan/jam |
| Lupa nomor tiket | Masuk ke akun warga → **Sanggahan Saya** (hanya untuk sanggahan non-anonim) |
| Tidak menerima email | Pastikan email diisi saat mengajukan, cek folder spam; notifikasi email hanya aktif jika layanan email (Resend) dikonfigurasi di server |
| Hasil impor PDF berantakan | Gunakan PDF berbasis teks (bukan scan) atau pakai impor CSV; periksa preview sebelum simpan |
| Impor CSV menampilkan baris error | Perbaiki baris yang ditandai sesuai pesan error di preview, lalu unggah ulang |

Untuk instalasi, konfigurasi server, dan deployment, lihat [README.md](../README.md).
