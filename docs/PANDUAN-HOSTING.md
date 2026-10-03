# Panduan Hosting SIPATAN ke Production (VPS)

Panduan ini untuk deploy SIPATAN dari laptop ke **VPS** (server sungguhan yang disewa dari penyedia hosting), sampai bisa diakses publik lewat domain dengan HTTPS.

## Kenapa VPS, bukan shared hosting biasa?

Aplikasi ini **Next.js (Node.js) + PostgreSQL** — bukan PHP. Shared hosting murah yang biasa dipakai untuk WordPress **tidak bisa** menjalankan ini (tidak ada Node.js, tidak ada akses jalankan proses server terus-menerus). Yang dibutuhkan adalah VPS/Cloud Server: server Linux pribadi dengan akses penuh (SSH), di mana kita install sendiri Node.js dan database-nya.

**Rekomendasi penyedia VPS** (pilih salah satu, harga mirip-mirip, ±Rp70rb–150rb/bulan untuk spek kecil):
- **Niagahoster Cloud VPS** / **IDCloudHost** — penyedia lokal, support Bahasa Indonesia, cocok untuk pemula.
- **DigitalOcean** / **Vultr** / **Contabo** — internasional, lebih murah untuk spek sama, dokumentasi lengkap.

**Spek minimum yang disarankan:** 1 vCPU, 2 GB RAM, 25 GB SSD, OS **Ubuntu 22.04 LTS** (atau 24.04). Untuk instansi dengan trafik rendah–menengah, ini sudah cukup.

Anda juga butuh **domain** (misalnya dari Niagahoster, Rumahweb, atau — karena ini situs resmi pemerintah — ajukan subdomain `.go.id` yang **gratis** lewat PANDI/Kominfo).

---

## Ringkasan Alur

1. Beli VPS & domain
2. Arahkan domain ke VPS (DNS)
3. Login ke server via SSH
4. Install Node.js, Git, Docker (untuk database)
5. Clone project & install dependencies
6. Konfigurasi `.env` production
7. Migrasi database & build aplikasi
8. Jalankan aplikasi dengan PM2 (biar tetap hidup)
9. Pasang Nginx sebagai reverse proxy
10. Pasang SSL (HTTPS) gratis dengan Certbot
11. Tes & checklist setelah live

---

## 1. Beli VPS & Domain

1. Daftar di penyedia VPS pilihan Anda, pilih paket sesuai spek minimum di atas, OS **Ubuntu 22.04 LTS**.
2. Setelah VPS aktif, Anda akan mendapat:
   - **Alamat IP** (contoh: `103.150.xx.xx`)
   - **Password root** (atau kunci SSH, tergantung penyedia)
3. Beli domain (atau siapkan subdomain `.go.id` yang sudah ada).

## 2. Arahkan Domain ke VPS (DNS)

Di panel domain Anda (tempat beli domain), buka pengaturan **DNS/DNS Management**, tambahkan:

| Tipe | Host/Nama | Value/Isi | TTL |
|---|---|---|---|
| A | `@` (atau kosong) | IP VPS Anda, mis. `103.150.xx.xx` | 3600 |
| A | `www` | IP VPS Anda (sama) | 3600 |

> Propagasi DNS bisa butuh 5 menit – 24 jam. Cek sudah aktif dengan `ping namadomain.go.id` dari komputer Anda.

## 3. Login ke Server via SSH

Dari komputer Anda (Windows: pakai PowerShell atau Terminal Git Bash):

```bash
ssh root@103.150.xx.xx
```

Masukkan password yang diberikan penyedia VPS. Setelah masuk, Anda berada "di dalam" server.

**Keamanan dasar — lakukan di awal:**

```bash
# Update semua paket
apt update && apt upgrade -y

# Aktifkan firewall, izinkan SSH, HTTP, HTTPS saja
apt install -y ufw
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

## 4. Install Node.js, Git, dan Docker

```bash
# Git
apt install -y git

# Node.js 20 LTS (lewat NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # pastikan versi 20.x

# Docker + Docker Compose (dipakai untuk menjalankan PostgreSQL)
curl -fsSL https://get.docker.com | sh
systemctl enable docker --now
```

> Kita pakai Docker **hanya untuk database PostgreSQL** — aplikasinya sendiri jalan langsung di server (bukan di container), supaya lebih mudah dikelola dengan PM2.

## 5. Clone Project & Install Dependencies

```bash
cd /var/www
git clone <URL-REPO-GIT-ANDA> dinas-pertanahan
cd dinas-pertanahan
npm install
```

> Jika repo ini belum ada di GitHub/GitLab, upload dulu lewat `git push` dari laptop Anda ke repo remote, lalu `git clone` di atas memakai URL repo tersebut. Alternatif: upload via `scp`/SFTP jika tidak memakai Git — tapi Git jauh lebih mudah untuk update selanjutnya.

## 6. Jalankan Database (PostgreSQL)

Repo ini sudah menyediakan `docker-compose.yml`. Sebelum menjalankannya, **ganti password default**:

```bash
nano docker-compose.yml
```

Ubah `POSTGRES_PASSWORD: pertanahan` menjadi password yang kuat, misalnya `POSTGRES_PASSWORD: Prod#Pertanahan2026!`. Simpan (`Ctrl+O`, Enter, `Ctrl+X`).

Jalankan database:

```bash
docker compose up -d db
docker compose ps   # pastikan status "healthy"
```

## 7. Konfigurasi `.env` Production

```bash
cp .env.example .env
nano .env
```

Isi sesuai production — ini bagian **paling penting**, jangan sampai salah:

| Variabel | Isi untuk Production |
|---|---|
| `DATABASE_URL` | `postgresql://pertanahan:<PASSWORD_BARU_ANDA>@localhost:5432/pertanahan?schema=public` |
| `AUTH_SECRET` | Generate dengan `npx auth secret` — **wajib string acak baru**, jangan pakai contoh |
| `AUTH_URL` | `https://namadomain-anda.go.id` (domain asli Anda, pakai `https`) |
| `NEXT_PUBLIC_APP_URL` | Sama seperti `AUTH_URL` |
| `WARGA_SESSION_SECRET` | Generate string acak lain (boleh pakai `openssl rand -base64 32`) |
| `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Nama, email, dan **password kuat** untuk akun Super Admin pertama — ganti setelah login pertama kali |
| `STORAGE_DRIVER` | `local` |
| `STORAGE_LOCAL_DIR` | `/var/www/dinas-pertanahan-uploads` (folder **di luar** folder project, lihat langkah berikut) |
| `MAX_UPLOAD_SIZE_MB` | `10` (atau sesuaikan) |
| `RESEND_API_KEY` / `EMAIL_FROM` | Opsional — isi jika ingin notifikasi email aktif (daftar gratis di [resend.com](https://resend.com)) |

Buat folder upload di luar project (supaya aman saat `git pull`/redeploy):

```bash
mkdir -p /var/www/dinas-pertanahan-uploads
```

Generate `AUTH_SECRET` dengan mudah:

```bash
npx auth secret
```

(Perintah ini otomatis menuliskannya ke `.env` — cek hasilnya dengan `cat .env`.)

## 8. Migrasi Database & Build

```bash
# Migrasi skema database (PENTING: pakai "deploy", bukan "dev", di production)
npx prisma migrate deploy

# Isi data awal (1 akun admin, contoh proyek, dll — sesuai SEED_ADMIN_* di .env)
npm run db:seed

# Build aplikasi untuk production
npm run build
```

Jika ketiga perintah di atas berjalan tanpa error, aplikasi sudah siap dijalankan.

## 9. Jalankan Aplikasi dengan PM2

PM2 menjaga aplikasi Anda tetap hidup (otomatis restart jika crash, otomatis jalan lagi setelah server reboot).

```bash
npm install -g pm2

pm2 start npm --name sipatan -- start
pm2 save
pm2 startup   # jalankan perintah yang ditampilkan (biasanya diawali "sudo env PATH=...")
```

Cek statusnya:

```bash
pm2 status
pm2 logs sipatan   # lihat log, Ctrl+C untuk keluar
```

Aplikasi sekarang jalan di `http://localhost:3000` **di dalam server** — belum bisa diakses dari luar. Lanjut ke langkah berikutnya.

## 10. Pasang Nginx (Reverse Proxy)

Nginx akan menerima trafik dari internet di port 80/443 dan meneruskannya ke aplikasi di port 3000.

```bash
apt install -y nginx
nano /etc/nginx/sites-available/sipatan
```

Isi file dengan (**ganti `namadomain-anda.go.id` dengan domain asli Anda**):

```nginx
server {
    listen 80;
    server_name namadomain-anda.go.id www.namadomain-anda.go.id;

    client_max_body_size 10M;

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

Aktifkan dan restart Nginx:

```bash
ln -s /etc/nginx/sites-available/sipatan /etc/nginx/sites-enabled/
nginx -t                 # tes konfigurasi, pastikan "syntax is ok"
systemctl restart nginx
```

Sekarang coba buka `http://namadomain-anda.go.id` dari browser — aplikasi seharusnya sudah muncul (belum HTTPS).

## 11. Pasang SSL (HTTPS) Gratis dengan Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d namadomain-anda.go.id -d www.namadomain-anda.go.id
```

Ikuti instruksi di layar (isi email, setuju ToS). Certbot otomatis mengubah konfigurasi Nginx untuk HTTPS dan mengatur perpanjangan otomatis sertifikat (berlaku 90 hari, auto-renew).

Tes perpanjangan otomatis berjalan baik:

```bash
certbot renew --dry-run
```

Sekarang `https://namadomain-anda.go.id` sudah aktif dengan gembok hijau. 🎉

---

## 12. Checklist Setelah Live

- [ ] Buka `https://namadomain-anda.go.id/admin/login`, login pakai `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` dari `.env`, **langsung ganti password** lewat menu Kelola User.
- [ ] Cek `https://namadomain-anda.go.id/api/health` — harus muncul `{"status":"ok","database":"up",...}`.
- [ ] Coba ajukan satu sanggahan dummy dari halaman publik untuk memastikan upload file & email (jika diaktifkan) berjalan.
- [ ] Cek halaman error: buka URL acak seperti `/halaman-tidak-ada` — harus muncul halaman 404 SIPATAN, bukan error default.
- [ ] Setel **backup database otomatis** (lihat bagian di bawah).
- [ ] Simpan baik-baik: password VPS, password database, isi `.env` lengkap (jangan sampai hilang).

### Backup Database Otomatis (penting!)

Buat cron job harian yang men-dump database ke file, lalu pertimbangkan sinkron ke penyimpanan lain (Google Drive/S3) secara manual atau berkala:

```bash
mkdir -p /var/backups/sipatan
crontab -e
```

Tambahkan baris ini (backup setiap hari jam 2 malam):

```
0 2 * * * docker exec $(docker ps -qf "name=db") pg_dump -U pertanahan pertanahan | gzip > /var/backups/sipatan/backup-$(date +\%Y\%m\%d).sql.gz
```

### Memantau Aplikasi

- `pm2 status` — cek aplikasi masih hidup.
- `pm2 logs sipatan --lines 100` — lihat log terakhir jika ada masalah.
- Daftarkan `https://namadomain-anda.go.id/api/health` ke layanan uptime monitor gratis seperti [UptimeRobot](https://uptimerobot.com) agar Anda dikirim notifikasi (email/WhatsApp) jika situs down.

### Update Aplikasi di Kemudian Hari

Setiap kali ada perubahan kode baru yang ingin di-deploy:

```bash
cd /var/www/dinas-pertanahan
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart sipatan
```

---

## Troubleshooting

| Masalah | Kemungkinan Sebab / Solusi |
|---|---|
| Domain tidak terbuka sama sekali | DNS belum propagasi (tunggu), atau firewall `ufw` belum izinkan port 80/443 |
| Nginx error "502 Bad Gateway" | Aplikasi Next.js belum jalan — cek `pm2 status` dan `pm2 logs sipatan` |
| `certbot` gagal | Pastikan domain **sudah** mengarah ke IP VPS ini sebelum menjalankan certbot (DNS harus aktif dulu) |
| Upload dokumen gagal di production | Pastikan `STORAGE_LOCAL_DIR` ada dan writable: `mkdir -p` sudah dijalankan, dan `STORAGE_DRIVER=local` benar di `.env` |
| Setelah `pm2 restart`, env baru tidak terbaca | Jalankan `pm2 restart sipatan --update-env`, atau pastikan edit `.env` sebelum `npm run build` |
| Server reboot, aplikasi tidak jalan lagi | Pastikan sudah menjalankan `pm2 save` dan perintah dari `pm2 startup` |
| Lupa password Super Admin | Buka `/admin/lupa-password` (butuh `RESEND_API_KEY` aktif agar email terkirim), atau reset manual lewat `npx prisma studio` di server |

---

## Alternatif: Deploy ke Vercel (tanpa VPS)

Jika di kemudian hari ingin coba jalur yang lebih "tanpa server" (tidak perlu SSH/Nginx/PM2 sama sekali), lihat bagian **Deployment → A. Vercel** di [README.md](../README.md) — di sana aplikasi di-deploy lewat dashboard Vercel, database pakai Neon/Supabase, dan storage file wajib `STORAGE_DRIVER=blob`. Cocok jika tim Anda lebih nyaman tanpa mengurus server sendiri, dengan trade-off sedikit lebih mahal untuk database terpisah.
