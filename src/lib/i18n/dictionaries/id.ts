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
};

export default id;
