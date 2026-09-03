export interface Dictionary {
  common: {
    save: string;
    cancel: string;
    loading: string;
    optional: string;
    back: string;
    semuaProyek: string;
  };
  nav: {
    beranda: string;
    dokumen: string;
    nominatif: string;
    sop: string;
    pengumuman: string;
    lacak: string;
    faq: string;
    kontak: string;
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
    masukUntukSanggahan: string;
    daftarTitle: string;
    daftarDesc: string;
    namaLengkap: string;
    email: string;
    password: string;
    konfirmasiPassword: string;
    nik: string;
    noHp: string;
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
    kontakTitle: string;
    bantuanTitle: string;
    sopPengadaan: string;
    lacakStatus: string;
    unduhFormulir: string;
    faqLink: string;
    hakCipta: string;
  };
  kontak: {
    title: string;
    desc: string;
    alamatLabel: string;
    emailLabel: string;
    teleponLabel: string;
    jamLabel: string;
  };
  faq: {
    title: string;
    desc: string;
    items: { q: string; a: string }[];
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
    unduhFormulirPilihProyekDesc: string;
    lacakStatusTitle: string;
    lacakStatusDesc: string;
    bacaSelengkapnya: string;
    tentangKegiatan: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    kanalSanggahanTitle: string;
    kanalSanggahanDesc: string;
    kanalSanggahanNominatif: string;
    kanalSanggahanPengumuman: string;
    pengumumanTerbaruTitle: string;
    pengumumanTerbaruLihatSemua: string;
    pengumumanTerbaruKosong: string;
    dataTerkiniBadge: string;
    dataTerkiniBidang: string;
    dataTerkiniDokumen: string;
    dataTerkiniPengumuman: string;
    dataTerkiniSanggahan: string;
    pembaruanTerakhir: string;
    faqTeaserLink: string;
    kontakTeaserLink: string;
    instansiPelayananLabel: string;
    instansiIndukTitle: string;
    instansiIndukKota: string;
    instansiBidang: string;
    instansiDesc: string;
    unitLainTitle: string;
    unitLainAndaDiSini: string;
    unitLainSegeraHadir: string;
    unitLainKunjungiWebsite: string;
    unitPerumahan: string;
    unitPermukiman: string;
    unitPertanahan: string;
    unitTataBangunan: string;
    unitUptdPemakaman: string;
    unitUptdRusunawa: string;
    galeriTitle: string;
    galeriDesc: string;
    galeriSoon: string;
    galeriKlikPerbesar: string;
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
    unduhBukti: string;
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
    unduhBukti: string;
    bidangTerkait: string;
    dokumenTerkait: string;
    pengumumanTerkait: string;
    catatanAdmin: string;
    perkiraanTanggapan: string;
    riwayat: string;
    lampiranBukti: string;
    tabelBuktiTambahan: string;
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
    proyekTerkait: string;
    pilihProyek: string;
    pilihProyekDulu: string;
    bidangTerkaitOpsional: string;
    pilihBidang: string;
    dokumenTerkaitOpsional: string;
    pilihDokumen: string;
    pengumumanTerkaitOpsional: string;
    pilihPengumuman: string;
    email: string;
    nomorHp: string;
    isiSalahSatu: string;
    isiSanggahan: string;
    isiSanggahanPlaceholder: string;
    lampiran: string;
    pernyataanBenar: string;
    kirim: string;
    sectionIdentitas: string;
    sectionPernyataan: string;
    sectionBukti: string;
    lampiranDesc: string;
    hapus: string;
    tabelBuktiTitle: string;
    tabelBuktiDesc: string;
    tabelBuktiJenis: string;
    tabelBuktiJenisPlaceholder: string;
    tabelBuktiKeterangan: string;
    tabelBuktiKeteranganPlaceholder: string;
    tambahBarisBukti: string;
  };
  nominatif: {
    pageTitle: string;
    pageDesc: string;
    totalBidang: string;
    totalLuasTerkena: string;
    dataTidakSesuai: string;
    dataTidakSesuaiDesc: string;
    ajukanUntukBidang: string;
    kembaliKeDaftar: string;
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
    lihatDokumenTerkait: string;
    lihatDataNominatif: string;
    belumAda: string;
    baruBadge: string;
    kanalDibuka: string;
    cariPlaceholder: string;
    semuaStatus: string;
    filterDibuka: string;
    filterTutup: string;
    terapkan: string;
    tidakAda: string;
    urutkanLabel: string;
    urutkanTerbaru: string;
    urutkanTerlama: string;
  };
}

const id: Dictionary = {
  common: {
    save: "Simpan",
    cancel: "Batal",
    loading: "Memuat...",
    optional: "opsional",
    back: "Kembali",
    semuaProyek: "Semua Proyek",
  },
  nav: {
    beranda: "Beranda",
    dokumen: "Dokumen Publikasi",
    nominatif: "Data Nominatif",
    sop: "SOP",
    pengumuman: "Pengumuman",
    lacak: "Lacak Sanggahan",
    faq: "FAQ",
    kontak: "Kontak",
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
    masukUntukSanggahan:
      "Masuk terlebih dahulu untuk mengajukan sanggahan. Setelah masuk, Anda tetap bisa memilih mengajukan dengan nama sendiri atau secara anonim.",
    daftarTitle: "Daftar Akun Warga",
    daftarDesc: "Ajukan sanggahan lebih cepat dan pantau riwayatnya di satu tempat.",
    namaLengkap: "Nama Lengkap",
    email: "Email",
    password: "Kata Sandi",
    konfirmasiPassword: "Konfirmasi Kata Sandi",
    nik: "NIK *",
    noHp: "No. HP *",
    catatanNikHp: "Pastikan NIK dan No. HP sudah benar — data ini akan tersimpan di akun Anda dan dipakai untuk mengisi otomatis form sanggahan Anda nanti.",
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
      "SIPATAN — Sistem Informasi Pengadaan Tanah adalah portal resmi untuk publikasi dokumen, data nominatif, SOP, dan kanal sanggahan masyarakat terkait kegiatan pengadaan tanah untuk kepentingan umum.",
    tautanTitle: "Tautan",
    sanggahanTitle: "Sanggahan",
    kontakTitle: "Hubungi Kami",
    bantuanTitle: "Bantuan",
    sopPengadaan: "SOP Pengadaan",
    lacakStatus: "Lacak Status Sanggahan",
    unduhFormulir: "Unduh Formulir PDF",
    faqLink: "Pertanyaan Umum (FAQ)",
    hakCipta: "SIPATAN — Sistem Informasi Pengadaan Tanah. Seluruh dokumen bersifat resmi.",
  },
  kontak: {
    title: "Hubungi Kami",
    desc: "Ada pertanyaan seputar pengadaan tanah atau proses sanggahan? Hubungi kami melalui kanal berikut.",
    alamatLabel: "Alamat Kantor",
    emailLabel: "Email",
    teleponLabel: "Telepon / WhatsApp",
    jamLabel: "Jam Layanan",
  },
  faq: {
    title: "Pertanyaan yang Sering Diajukan",
    desc: "Jawaban singkat untuk pertanyaan umum seputar sanggahan dan data nominatif.",
    items: [
      {
        q: "Bagaimana cara mengajukan sanggahan?",
        a: "Buka halaman \"Ajukan Sanggahan\", pilih data bidang atau pengumuman yang ingin disanggah, lalu isi form. Anda bisa mengajukan secara anonim atau login sebagai warga agar tersimpan di riwayat akun.",
      },
      {
        q: "Apakah pengajuan sanggahan memiliki batas waktu?",
        a: "Ya. Masa sanggah berlangsung 14 hari kalender sejak tanggal pengumuman data nominatif suatu proyek. Setelah sanggahan diajukan, petugas akan menanggapi dalam waktu 3-4 hari kerja.",
      },
      {
        q: "Bagaimana cara melacak status sanggahan saya?",
        a: "Gunakan nomor tiket dan NIK Anda di halaman \"Lacak Status Sanggahan\", atau login ke akun warga untuk melihat seluruh riwayat sanggahan Anda.",
      },
      {
        q: "Apakah data pribadi saya aman dipublikasikan?",
        a: "NIK, tempat/tanggal lahir, pekerjaan, dan alamat pada Data Nominatif publik ditutup sebagian (dimasking) untuk melindungi privasi Anda.",
      },
      {
        q: "Ke mana saya bisa bertanya lebih lanjut?",
        a: "Silakan hubungi kami melalui kanal pada bagian \"Hubungi Kami\" di halaman ini.",
      },
    ],
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
    unduhFormulirPilihProyekDesc: "Pilih proyek untuk mengunduh formulir sanggahan yang sudah berisi identitas proyek terkait.",
    lacakStatusTitle: "Lacak Status Sanggahan",
    lacakStatusDesc: "Pantau perkembangan sanggahan yang sudah Anda ajukan dengan nomor tiket.",
    bacaSelengkapnya: "Baca Selengkapnya",
    tentangKegiatan: "Tentang Kegiatan",
    ctaTitle: "Data Anda tidak sesuai dengan pengumuman?",
    ctaDesc: "Ajukan sanggahan secara online, dapatkan nomor tiket, dan pantau statusnya kapan saja.",
    ctaButton: "Ajukan Sanggahan Sekarang",
    kanalSanggahanTitle: "Sanggahan Memiliki Tenggat Waktu 14 Hari",
    kanalSanggahanDesc:
      "Sanggahan dapat diajukan dalam 14 hari kalender sejak tanggal pengumuman data nominatif, dan akan ditanggapi petugas dalam 3-4 hari kerja. Ajukan langsung dari data bidang yang ingin disanggah atau dari pengumuman terkait.",
    kanalSanggahanNominatif: "Pilih bidang di Data Nominatif",
    kanalSanggahanPengumuman: "Pilih pengumuman yang kanalnya dibuka",
    pengumumanTerbaruTitle: "Pengumuman Terbaru",
    pengumumanTerbaruLihatSemua: "Lihat Semua Pengumuman",
    pengumumanTerbaruKosong: "Belum ada pengumuman yang diterbitkan.",
    dataTerkiniBadge: "Data diperbarui otomatis",
    dataTerkiniBidang: "Bidang Terdaftar",
    dataTerkiniDokumen: "Dokumen Dipublikasikan",
    dataTerkiniPengumuman: "Pengumuman Terbit",
    dataTerkiniSanggahan: "Sanggahan Diproses",
    pembaruanTerakhir: "Pembaruan terakhir",
    faqTeaserLink: "Lihat semua pertanyaan",
    kontakTeaserLink: "Lihat halaman Hubungi Kami",
    instansiPelayananLabel: "Pelayanan Online Pengadaan Tanah",
    instansiIndukTitle: "Dinas Perumahan & Permukiman",
    instansiIndukKota: "Kota Depok",
    instansiBidang: "Bidang Pertanahan",
    instansiDesc:
      "SIPATAN hadir untuk menjawab kebutuhan masyarakat Kota Depok yang ingin mendapatkan informasi dan pelayanan pengadaan tanah dengan cepat, transparan, dan mudah.",
    unitLainTitle: "Bagian dari Dinas Perumahan & Permukiman Kota Depok",
    unitLainAndaDiSini: "Anda di sini",
    unitLainSegeraHadir: "Website segera hadir",
    unitLainKunjungiWebsite: "Kunjungi website",
    unitPerumahan: "Bidang Perumahan",
    unitPermukiman: "Bidang Permukiman",
    unitPertanahan: "Bidang Pertanahan (SIPATAN)",
    unitTataBangunan: "Bidang Tata Bangunan",
    unitUptdPemakaman: "UPTD Pemakaman",
    unitUptdRusunawa: "UPTD Rusunawa",
    galeriTitle: "Galeri Kegiatan",
    galeriDesc: "Contoh dokumentasi kegiatan pengadaan tanah di lapangan, dari pengukuran hingga penyerahan dokumen.",
    galeriSoon: "Foto akan diperbarui berkala",
    galeriKlikPerbesar: "Klik untuk memperbesar",
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
    unduhBukti: "Cetak / Unduh Bukti Sanggahan (PDF)",
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
    unduhBukti: "Cetak / Unduh Bukti (PDF)",
    bidangTerkait: "Bidang Terkait",
    dokumenTerkait: "Dokumen Terkait",
    pengumumanTerkait: "Pengumuman Terkait",
    catatanAdmin: "Catatan / Tanggapan Admin",
    perkiraanTanggapan: "Perkiraan tanggapan: 3–4 hari kerja sejak pengajuan",
    riwayat: "Riwayat",
    lampiranBukti: "Lampiran Bukti",
    tabelBuktiTambahan: "Tabel Bukti Tambahan",
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
    proyekTerkait: "Proyek Terkait *",
    pilihProyek: "— Pilih proyek —",
    pilihProyekDulu: "Pilih proyek terlebih dahulu",
    bidangTerkaitOpsional: "Bidang Terkait (opsional)",
    pilihBidang: "— Pilih bidang —",
    dokumenTerkaitOpsional: "Dokumen Publikasi Terkait (opsional)",
    pilihDokumen: "— Pilih dokumen —",
    pengumumanTerkaitOpsional: "Pengumuman Terkait (opsional)",
    pilihPengumuman: "— Pilih pengumuman —",
    email: "Email",
    nomorHp: "Nomor HP",
    isiSalahSatu: "Isi salah satu: email atau nomor HP.",
    isiSanggahan: "Isi Sanggahan *",
    isiSanggahanPlaceholder: "Jelaskan secara rinci ketidaksesuaian data yang Anda temukan...",
    lampiran: "Unggah File Bukti (opsional)",
    pernyataanBenar: "Saya menyatakan bahwa data yang saya isikan di atas adalah benar.",
    kirim: "Kirim Sanggahan",
    sectionIdentitas: "Yang Bertanda Tangan Di Bawah Ini",
    sectionPernyataan: "Menyatakan Bahwa",
    sectionBukti: "Bukti Pendukung",
    lampiranDesc: "Bisa lebih dari satu file: foto atau dokumen (PDF/JPG/PNG/WEBP), masing-masing maks. 10MB.",
    hapus: "Hapus",
    tabelBuktiTitle: "Tabel Bukti Tambahan (opsional)",
    tabelBuktiDesc: "Tambahkan baris untuk mencatat bukti lain yang Anda miliki, mis. jenis surat/sertifikat beserta keterangannya.",
    tabelBuktiJenis: "Jenis Bukti",
    tabelBuktiJenisPlaceholder: "mis. Sertifikat Tanah",
    tabelBuktiKeterangan: "Keterangan",
    tabelBuktiKeteranganPlaceholder: "mis. No. SHM 02412/Rangkapan Jaya Baru",
    tambahBarisBukti: "+ Tambah Baris",
  },
  nominatif: {
    pageTitle: "Data Nominatif",
    pageDesc: "Daftar bidang tanah, bangunan, dan tanaman yang terkena dampak pengadaan tanah.",
    totalBidang: "Total Bidang",
    totalLuasTerkena: "Total Luas Terkena",
    dataTidakSesuai: "Data tidak sesuai?",
    dataTidakSesuaiDesc: "Jika ada data pada bidang ini yang menurut Anda tidak sesuai, silakan ajukan sanggahan.",
    ajukanUntukBidang: "Ajukan Sanggahan untuk Bidang Ini",
    kembaliKeDaftar: "Kembali ke Data Nominatif",
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
    lihatDokumenTerkait: "Lihat Dokumen Terkait",
    lihatDataNominatif: "Lihat Data Nominatif",
    belumAda: "Belum ada pengumuman.",
    baruBadge: "Baru",
    kanalDibuka: "Kanal sanggahan dibuka",
    cariPlaceholder: "Cari judul atau isi pengumuman...",
    semuaStatus: "Semua Status",
    filterDibuka: "Kanal Sanggahan Dibuka",
    filterTutup: "Kanal Sanggahan Tertutup",
    terapkan: "Terapkan",
    tidakAda: "Tidak ada pengumuman yang sesuai dengan pencarian Anda.",
    urutkanLabel: "Urutkan",
    urutkanTerbaru: "Terbaru",
    urutkanTerlama: "Terlama",
  },
};

export default id;
