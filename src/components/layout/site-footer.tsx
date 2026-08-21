import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-emerald-800">Pengadaan Tanah Kota Depok</p>
          <p className="mt-2 text-sm text-zinc-600">
            Pelebaran Simpang Parung Bingung, Jalan Raya Sawangan, Jalan Raya
            Muchtar, dan Jalan Meruyung Raya, Kecamatan Pancoran Mas &amp;
            Sawangan, Kota Depok, Jawa Barat.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">Tautan</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
            <li><Link className="hover:text-emerald-700 hover:underline" href="/dokumen">Dokumen Publikasi</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline" href="/data-nominatif">Data Nominatif</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline" href="/sop">SOP Pengadaan</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline" href="/pengumuman">Pengumuman</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">Sanggahan</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
            <li><Link className="hover:text-emerald-700 hover:underline" href="/sanggahan/baru">Ajukan Sanggahan</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline" href="/sanggahan/lacak">Lacak Status Sanggahan</Link></li>
            <li><Link className="hover:text-emerald-700 hover:underline" href="/api/formulir-pdf">Unduh Formulir PDF</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">Admin</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
            <li><Link className="hover:text-emerald-700 hover:underline" href="/admin/login">Login Admin</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Panitia Pengadaan Tanah Kota Depok. Seluruh dokumen bersifat resmi.
      </div>
    </footer>
  );
}
