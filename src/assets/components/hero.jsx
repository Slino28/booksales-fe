import { Link } from "react-router-dom";
import Icon from "./ui/Icon";

// Tumpukan buku dekoratif di sisi kanan hero.
const spines = [
  { w: "w-56", h: "h-12", c: "bg-kuning text-tinta", t: "Laskar Pelangi" },
  { w: "w-64", h: "h-14", c: "bg-jingga text-white", t: "Bumi" },
  { w: "w-52", h: "h-11", c: "bg-hijau text-white", t: "Perahu Kertas" },
  { w: "w-60", h: "h-14", c: "bg-kobalt text-white", t: "Harry Potter" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-tinta text-white">
      <div className="container-page grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
            <Icon name="truck" className="h-4 w-4" /> Bayar di tempat saat buku sampai
          </p>
          <h1 className="mt-5 font-judul text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Temukan buku berikutnya yang tak ingin kamu tutup.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            Novel, fantasi, hingga misteri. Cari lewat judul atau penulis, masukkan ke keranjang, dan
            pesanan diantar ke rumah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/books" className="btn btn-lg bg-white text-tinta hover:bg-krem">
              Jelajahi buku <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="btn btn-lg border border-white/30 text-white hover:bg-white/10"
            >
              Tentang kami
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="hidden flex-col items-center gap-1.5 lg:flex">
          {spines.map((s, i) => (
            <div
              key={s.t}
              style={{ marginLeft: `${(i % 2 === 0 ? 1 : -1) * 18}px`, animationDelay: `${i * 120}ms` }}
              className={`${s.w} ${s.h} ${s.c} flex items-center rounded-md px-5 font-judul text-base font-bold shadow-lg motion-safe:animate-rise`}
            >
              {s.t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
