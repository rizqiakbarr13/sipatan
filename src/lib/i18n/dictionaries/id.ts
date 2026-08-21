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
};

export default id;
