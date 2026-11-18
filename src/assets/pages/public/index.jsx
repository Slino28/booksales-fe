import { Link } from "react-router-dom";
import Hero from "../../components/hero";
import BookCard from "../../components/ui/BookCard";
import Icon from "../../components/ui/Icon";
import { ErrorNote, Spinner } from "../../components/ui/Feedback";
import useFetch from "../../utils/useFetch";

const keunggulan = [
  { icon: "truck", title: "Bayar di tempat", text: "Tidak perlu transfer dulu. Bayar tunai ketika buku sudah sampai di tanganmu." },
  { icon: "search", title: "Pencarian cepat", text: "Cari berdasarkan judul, nama penulis, atau genre dalam satu kolom." },
  { icon: "shield", title: "Stok selalu akurat", text: "Jumlah stok diperbarui saat pesanan dibuat, jadi tidak ada pesanan kosong." },
];

export default function Home() {
  const books = useFetch("/books");
  const genres = useFetch("/genres");

  const terbaru = (books.data ?? []).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-judul text-3xl font-bold text-slate-900">Pilihan untukmu</h2>
            <p className="mt-1 text-slate-600">Beberapa buku dari koleksi kami.</p>
          </div>
          <Link to="/books" className="hidden items-center gap-1 text-sm font-semibold text-kobalt hover:underline sm:flex">
            Lihat semua <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8">
          {books.loading && <Spinner />}
          <ErrorNote onRetry={books.reload}>{books.error}</ErrorNote>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {terbaru.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      </section>

      {genres.data?.length > 0 && (
        <section className="container-page pb-6">
          <h2 className="font-judul text-2xl font-bold text-slate-900">Jelajahi per genre</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.data.map((g) => (
              <Link
                key={g.id}
                to={`/books?genre_id=${g.id}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-kobalt hover:text-kobalt"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page pt-14">
        <div className="grid gap-5 md:grid-cols-3">
          {keunggulan.map((k) => (
            <div key={k.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-kobalt/10 text-kobalt">
                <Icon name={k.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-judul text-lg font-bold text-slate-900">{k.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{k.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
