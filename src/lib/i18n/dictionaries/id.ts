export interface Dictionary {
  common: {
    save: string;
    cancel: string;
    loading: string;
    optional: string;
    back: string;
  };
  nav: {
    beranda: string;
    dokumen: string;
    nominatif: string;
    sop: string;
    pengumuman: string;
    lacak: string;
    ajukanSanggahan: string;
    masuk: string;
    daftar: string;
    akunSaya: string;
    sanggahanSaya: string;
    keluar: string;
    tutupMenu: string;
    bukaMenu: string;
  };
  auth: {
    masukTitle: string;
    masukDesc: string;
    daftarTitle: string;
    daftarDesc: string;
    namaLengkap: string;
    email: string;
    password: string;
    konfirmasiPassword: string;
    nikOpsional: string;
    noHpOpsional: string;
    catatanNikHp: string;
    tombolMasuk: string;
    tombolDaftar: string;
    belumPunyaAkun: string;
    daftarDiSini: string;
    sudahPunyaAkun: string;
    masukDiSini: string;
  };
  account: {
    ajukanBaru: string;
    riwayatTitle: string;
    riwayatKosong: string;
    masukSebagai: string;
    ajukanAnonim: string;
    dataOtomatisTerisi: string;
  };
  footer: {
    alamat: string;
    tautanTitle: string;
    sanggahanTitle: string;
    adminTitle: string;
    sopPengadaan: string;
    lacakStatus: string;
    unduhFormulir: string;
    loginAdmin: string;
    hakCipta: string;
  };
  home: {
    eyebrow: string;
    namaProyekFallback: string;
    nomorPengumuman: string;
    tanggal: string;
    lokasi: string;
    layananUtama: string;
    lihatNominatifTitle: string;
    lihatNominatifDesc: string;
    ajukanSanggahanTitle: string;
    ajukanSanggahanDesc: string;
    sopTitle: string;
    sopDesc: string;
    unduhFormulirTitle: string;
    unduhFormulirDesc: string;
    tentangKegiatan: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  banner: {
    belumDiatur: string;
    berakhirPrefix: string;
    berakhirSuffix: string;
    sisaPrefix: string;
    sisaHari: string;
    sisaSuffix: string;
  };
  dokumen: {
    pageTitle: string;
    pageDesc: string;
    cariPlaceholder: string;
    semuaKategori: string;
    terapkan: string;
    lihat: string;
    unduh: string;
    diunduh: string;
    tidakAda: string;
    nomorSurat: string;
    tanggalDokumen: string;
    ukuranFile: string;
    jumlahUnduhan: string;
    unduhDokumen: string;
    dataTidakSesuai: string;
    dataTidakSesuaiDesc: string;
    ajukanAtasDokumen: string;
    kanalTertutup: string;
    sanggahanDitanggapi: string;
    transparansiDesc: string;
    tanggapanAdmin: string;
  };
  sanggahanSukses: {
    title: string;
    desc: string;
    lacakStatus: string;
    kembaliBeranda: string;
  };
  lacak: {
    title: string;
    desc: string;
    nomorTiket: string;
    nik: string;
    tombol: string;
    tidakDitemukan: string;
  };
  detailSanggahan: {
    diajukan: string;
    bidangTerkait: string;
    dokumenTerkait: string;
    catatanAdmin: string;
    riwayat: string;
  };
  sanggahanForm: {
    pageTitle: string;
    pageDesc: string;
    kanalTertutup: string;
    nama: string;
    nik: string;
    alasHak: string;
    noDanom: string;
    noPetaBidang: string;
    noNis: string;
    bidangTerkaitOpsional: string;
    pilihBidang: string;
    dokumenTerkaitOpsional: string;
    pilihDokumen: string;
    email: string;
    nomorHp: string;
    isiSalahSatu: string;
    isiSanggahan: string;
    isiSanggahanPlaceholder: string;
    lampiran: string;
    pernyataanBenar: string;
    kirim: string;
  };
  nominatif: {
    pageTitle: string;
    pageDesc: string;
    totalBidang: string;
    totalLuasTerkena: string;
    dataTidakSesuai: string;
    dataTidakSesuaiDesc: string;
    ajukanUntukBidang: string;
    masaSanggahBerakhir: string;
  };
  nominatifTable: {
    cariPlaceholder: string;
    semuaAlasHak: string;
    exportCsv: string;
    tidakAdaData: string;
    menampilkan: string;
    dari: string;
    bidang: string;
    halaman: string;
  };
  sop: {
    pageTitle: string;
    pageDesc: string;
    adaLampiran: string;
    belumAda: string;
    tahap: string;
    unduhLampiran: string;
  };
  pengumuman: {
    pageTitle: string;
    pageDesc: string;
    lihatLampiran: string;
    belumAda: string;
  };
}

const id: Dictionary = {
  common: {
    save: "Simpan",
    cancel: "Batal",
    loading: "Memuat...",
    optional: "opsional",
    back: "Kembali",
  },
  nav: {
    beranda: "Beranda",
    dokumen: "Dokumen Publikasi",
    nominatif: "Data Nominatif",
    sop: "SOP",
    pengumuman: "Pengumuman",
    lacak: "Lacak Sanggahan",
    ajukanSanggahan: "Ajukan Sanggahan",
    masuk: "Masuk",
    daftar: "Daftar",
    akunSaya: "Akun Saya",
    sanggahanSaya: "Sanggahan Saya",
    keluar: "Keluar",
    tutupMenu: "Tutup menu",
    bukaMenu: "Buka menu",
  },
  auth: {
    masukTitle: "Masuk Akun Warga",
    masukDesc: "Untuk mengajukan sanggahan dengan data otomatis terisi dan melihat riwayat.",
    daftarTitle: "Daftar Akun Warga",
    daftarDesc: "Ajukan sanggahan lebih cepat dan pantau riwayatnya di satu tempat.",
    namaLengkap: "Nama Lengkap",
    email: "Email",
    password: "Kata Sandi",
    konfirmasiPassword: "Konfirmasi Kata Sandi",
    nikOpsional: "NIK (opsional)",
    noHpOpsional: "No. HP (opsional)",
    catatanNikHp: "NIK/No. HP hanya dipakai untuk mengisi otomatis form sanggahan Anda nanti.",
    tombolMasuk: "Masuk",
    tombolDaftar: "Daftar",
    belumPunyaAkun: "Belum punya akun?",
    daftarDiSini: "Daftar di sini",
    sudahPunyaAkun: "Sudah punya akun?",
    masukDiSini: "Masuk di sini",
  },
  account: {
    ajukanBaru: "Ajukan Sanggahan Baru",
    riwayatTitle: "Sanggahan Saya",
    riwayatKosong: "Anda belum pernah mengajukan sanggahan lewat akun ini.",
    masukSebagai: "Masuk sebagai",
    ajukanAnonim: "Ajukan sebagai anonim (jangan kaitkan dengan akun saya)",
    dataOtomatisTerisi:
      "Data di bawah sudah terisi otomatis dan sanggahan ini akan tersimpan di riwayat akun Anda.",
  },
  footer: {
    alamat:
      "Pelebaran Simpang Parung Bingung, Jalan Raya Sawangan, Jalan Raya Muchtar, dan Jalan Meruyung Raya, Kecamatan Pancoran Mas & Sawangan, Kota Depok, Jawa Barat.",
    tautanTitle: "Tautan",
    sanggahanTitle: "Sanggahan",
    adminTitle: "Admin",
    sopPengadaan: "SOP Pengadaan",
    lacakStatus: "Lacak Status Sanggahan",
    unduhFormulir: "Unduh Formulir PDF",
    loginAdmin: "Login Admin",
    hakCipta: "Panitia Pengadaan Tanah Kota Depok. Seluruh dokumen bersifat resmi.",
  },
  home: {
    eyebrow: "Pengadaan Tanah untuk Kepentingan Umum",
    namaProyekFallback: "Pelebaran Simpang Parung Bingung, Kota Depok",
    nomorPengumuman: "Nomor Pengumuman:",
    tanggal: "Tanggal:",
    lokasi: "Lokasi:",
    layananUtama: "Layanan Utama",
    lihatNominatifTitle: "Lihat Data Nominatif",
    lihatNominatifDesc: "Periksa data bidang, luas tanah, bangunan, dan tanaman yang terkena dampak.",
    ajukanSanggahanTitle: "Ajukan Sanggahan",
    ajukanSanggahanDesc: "Sampaikan sanggahan bila data yang diumumkan tidak sesuai.",
    sopTitle: "SOP Pengadaan",
    sopDesc: "Pelajari tahapan proses pengadaan tanah dari awal hingga akhir.",
    unduhFormulirTitle: "Unduh Formulir Sanggahan",
    unduhFormulirDesc: "Unduh formulir sanggahan resmi dalam format PDF.",
    tentangKegiatan: "Tentang Kegiatan",
    ctaTitle: "Data Anda tidak sesuai dengan pengumuman?",
    ctaDesc: "Ajukan sanggahan secara online, dapatkan nomor tiket, dan pantau statusnya kapan saja.",
    ctaButton: "Ajukan Sanggahan Sekarang",
  },
  banner: {
    belumDiatur: "Jadwal masa sanggah belum diumumkan.",
    berakhirPrefix: "Masa sanggah telah berakhir pada",
    berakhirSuffix: "Pengajuan sanggahan baru untuk data ini tidak lagi diterima.",
    sisaPrefix: "Masa sanggah berakhir dalam",
    sisaHari: "hari",
    sisaSuffix: "sampai dengan",
  },
  dokumen: {
    pageTitle: "Dokumen Publikasi",
    pageDesc:
      "Dokumen resmi pengadaan tanah: daftar nominatif, pengumuman, peta bidang, SK penetapan lokasi, dan berita acara.",
    cariPlaceholder: "Cari judul dokumen...",
    semuaKategori: "Semua Kategori",
    terapkan: "Terapkan",
    lihat: "Lihat",
    unduh: "Unduh",
    diunduh: "x diunduh",
    tidakAda: "Tidak ada dokumen yang sesuai dengan pencarian Anda.",
    nomorSurat: "Nomor Surat",
    tanggalDokumen: "Tanggal Dokumen",
    ukuranFile: "Ukuran File",
    jumlahUnduhan: "Jumlah Unduhan",
    unduhDokumen: "Unduh Dokumen",
    dataTidakSesuai: "Data tidak sesuai?",
    dataTidakSesuaiDesc: "Jika data Anda pada dokumen ini tidak sesuai, silakan ajukan sanggahan.",
    ajukanAtasDokumen: "Ajukan Sanggahan atas Dokumen Ini",
    kanalTertutup:
      "Kanal sanggahan untuk dokumen ini sedang tidak tersedia (masa sanggah berakhir atau kanal ditutup admin).",
    sanggahanDitanggapi: "Sanggahan yang Sudah Ditanggapi",
    transparansiDesc: "Ditampilkan sebagai bentuk transparansi. Identitas penyanggah disamarkan.",
    tanggapanAdmin: "Tanggapan Admin:",
  },
  sanggahanSukses: {
    title: "Sanggahan Berhasil Dikirim",
    desc: "Sanggahan Anda telah kami terima dan akan diproses oleh panitia. Simpan nomor tiket berikut untuk melacak status sanggahan Anda.",
    lacakStatus: "Lacak Status Sanggahan",
    kembaliBeranda: "Kembali ke Beranda",
  },
  lacak: {
    title: "Lacak Status Sanggahan",
    desc: "Masukkan nomor tiket dan NIK yang digunakan saat mengajukan sanggahan.",
    nomorTiket: "Nomor Tiket",
    nik: "NIK",
    tombol: "Lacak",
    tidakDitemukan: "Data tidak ditemukan. Pastikan nomor tiket dan NIK yang Anda masukkan sudah benar.",
  },
  detailSanggahan: {
    diajukan: "Diajukan",
    bidangTerkait: "Bidang Terkait",
    dokumenTerkait: "Dokumen Terkait",
    catatanAdmin: "Catatan / Tanggapan Admin",
    riwayat: "Riwayat",
  },
  sanggahanForm: {
    pageTitle: "Ajukan Sanggahan",
    pageDesc: "Sampaikan sanggahan atas data nominatif atau dokumen publikasi yang menurut Anda tidak sesuai.",
    kanalTertutup:
      "Masa sanggah telah berakhir atau kanal sanggahan untuk dokumen terkait sedang ditutup, sehingga pengajuan sanggahan baru tidak dapat diproses saat ini.",
    nama: "Nama *",
    nik: "NIK *",
    alasHak: "Alas Hak",
    noDanom: "No. Danom",
    noPetaBidang: "No. Peta Bidang",
    noNis: "No. NIS",
    bidangTerkaitOpsional: "Bidang Terkait (opsional)",
    pilihBidang: "— Pilih bidang —",
    dokumenTerkaitOpsional: "Dokumen Publikasi Terkait (opsional)",
    pilihDokumen: "— Pilih dokumen —",
    email: "Email",
    nomorHp: "Nomor HP",
    isiSalahSatu: "Isi salah satu: email atau nomor HP.",
    isiSanggahan: "Isi Sanggahan *",
    isiSanggahanPlaceholder: "Jelaskan secara rinci ketidaksesuaian data yang Anda temukan...",
    lampiran: "Lampiran Bukti (opsional, PDF/JPG/PNG, maks. 5MB)",
    pernyataanBenar: "Saya menyatakan bahwa data yang saya isikan di atas adalah benar.",
    kirim: "Kirim Sanggahan",
  },
  nominatif: {
    pageTitle: "Data Nominatif",
    pageDesc: "Daftar bidang tanah, bangunan, dan tanaman yang terkena dampak pengadaan tanah.",
    totalBidang: "Total Bidang",
    totalLuasTerkena: "Total Luas Terkena",
    dataTidakSesuai: "Data tidak sesuai?",
    dataTidakSesuaiDesc: "Jika ada data pada bidang ini yang menurut Anda tidak sesuai, silakan ajukan sanggahan.",
    ajukanUntukBidang: "Ajukan Sanggahan untuk Bidang Ini",
    masaSanggahBerakhir: "Masa sanggah telah berakhir, pengajuan sanggahan baru tidak dapat diproses.",
  },
  nominatifTable: {
    cariPlaceholder: "Cari nama, NIB, atau no. urut...",
    semuaAlasHak: "Semua Alas Hak",
    exportCsv: "Export CSV",
    tidakAdaData: "Tidak ada data yang sesuai.",
    menampilkan: "Menampilkan",
    dari: "dari",
    bidang: "bidang",
    halaman: "Halaman",
  },
  sop: {
    pageTitle: "SOP Pengadaan Tanah",
    pageDesc: "Tahapan proses pengadaan tanah untuk kepentingan umum, dari perencanaan hingga pelepasan hak.",
    adaLampiran: "Ada lampiran PDF",
    belumAda: "Belum ada tahapan SOP yang dipublikasikan.",
    tahap: "Tahap",
    unduhLampiran: "Unduh Lampiran PDF",
  },
  pengumuman: {
    pageTitle: "Pengumuman",
    pageDesc: "Pengumuman resmi terkait kegiatan pengadaan tanah untuk kepentingan umum.",
    lihatLampiran: "Lihat lampiran",
    belumAda: "Belum ada pengumuman.",
  },
};

export default id;
