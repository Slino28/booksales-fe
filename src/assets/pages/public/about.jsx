import { Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";

const nilai = [
  { icon: "book", title: "Koleksi pilihan", text: "Novel, fantasi, dan misteri dari penulis yang dicintai pembaca Indonesia." },
  { icon: "truck", title: "Bayar saat tiba", text: "Pembayaran dilakukan di tempat, jadi kamu baru membayar setelah bukunya sampai." },
  { icon: "mail", title: "Admin yang bisa dihubungi", text: "Ada pertanyaan soal pesanan? Kirim pesan dan admin akan membalasnya." },
];

const langkah = [
  "Cari buku lewat judul, penulis, atau genre.",
  "Masukkan ke keranjang dan atur jumlahnya.",
  "Isi alamat dan nomor telepon saat checkout.",
  "Bayar tunai ke kurir ketika pesanan tiba.",
];

export default function About() {
  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-kobalt">Tentang kami</p>
      <h1 className="mt-2 max-w-3xl font-judul text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
        BookSales adalah toko buku daring yang dibuat agar belanja buku terasa sederhana.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
        Kami memulai BookSales sebagai proyek belajar pengembangan web dengan Laravel dan React.
        Tujuannya satu: pembaca bisa menemukan buku, memesannya, dan melacak pesanan tanpa
        kerumitan.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {nilai.map((n) => (
          <div key={n.title} className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-kobalt/10 text-kobalt">
              <Icon name={n.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-judul text-lg font-bold text-slate-900">{n.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{n.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-tinta p-8 text-white sm:p-10">
        <h2 className="font-judul text-2xl font-bold">Cara memesan</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {langkah.map((l, i) => (
            <li key={l} className="flex gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-sm font-bold text-tinta">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-slate-200">{l}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/books" className="btn bg-white text-tinta hover:bg-krem">Mulai belanja</Link>
          <Link to="/contact" className="btn border border-white/30 text-white hover:bg-white/10">Hubungi admin</Link>
        </div>
      </div>
    </div>
  );
}
