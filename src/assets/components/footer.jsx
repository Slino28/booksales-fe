import { Link } from "react-router-dom";
import Icon from "./ui/Icon";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-judul text-xl font-bold text-tinta">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kobalt text-white">
              <Icon name="book" className="h-4 w-4" />
            </span>
            BookSales
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
            Toko buku daring untuk pembaca Indonesia. Pilih buku, pesan, dan bayar di tempat saat
            pesanan sampai.
          </p>
        </div>

        <nav aria-label="Jelajahi">
          <p className="text-sm font-semibold text-slate-900">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/books" className="hover:text-kobalt">Semua buku</Link></li>
            <li><Link to="/about" className="hover:text-kobalt">Tentang kami</Link></li>
            <li><Link to="/contact" className="hover:text-kobalt">Hubungi admin</Link></li>
          </ul>
        </nav>

        <nav aria-label="Akun">
          <p className="text-sm font-semibold text-slate-900">Akun</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/login" className="hover:text-kobalt">Masuk</Link></li>
            <li><Link to="/register" className="hover:text-kobalt">Daftar</Link></li>
            <li><Link to="/orders" className="hover:text-kobalt">Pesanan saya</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} BookSales. Dibuat untuk tugas BNSP.
      </div>
    </footer>
  );
}
