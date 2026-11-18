import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BookCard from "../../../components/ui/BookCard";
import Icon from "../../../components/ui/Icon";
import { EmptyState, ErrorNote, Spinner } from "../../../components/ui/Feedback";
import useFetch from "../../../utils/useFetch";

export default function Books() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const genreId = params.get("genre_id") ?? "";

  // kolom pencarian dipegang sendiri supaya pengetikan tidak memanggil API di setiap huruf
  const [keyword, setKeyword] = useState(search);
  useEffect(() => setKeyword(search), [search]);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (genreId) query.set("genre_id", genreId);
  const qs = query.toString();

  const books = useFetch(`/books${qs ? `?${qs}` : ""}`);
  const genres = useFetch("/genres");

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p);
  };

  const filtered = Boolean(search || genreId);

  return (
    <div className="container-page py-10">
      <h1 className="font-judul text-4xl font-bold text-slate-900">Katalog buku</h1>
      <p className="mt-1 text-slate-600">Temukan buku berdasarkan judul, penulis, atau genre.</p>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ search: keyword.trim() });
        }}
        className="mt-6 flex gap-2"
      >
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="cari" className="sr-only">Cari buku</label>
          <input
            id="cari"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Contoh: Laskar Pelangi, Tere Liye, Fantasi"
            className="field pl-10"
          />
        </div>
        <button type="submit" className="btn btn-primary h-auto px-6">
          Cari
        </button>
      </form>

      {genres.data?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Saring genre">
          <button
            type="button"
            onClick={() => update({ genre_id: "" })}
            aria-pressed={!genreId}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              !genreId ? "border-kobalt bg-kobalt text-white" : "border-slate-300 bg-white text-slate-700 hover:border-kobalt"
            }`}
          >
            Semua
          </button>
          {genres.data.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => update({ genre_id: String(g.id) })}
              aria-pressed={genreId === String(g.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                genreId === String(g.id)
                  ? "border-kobalt bg-kobalt text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-kobalt"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {books.loading && <Spinner label="Memuat buku..." />}
        <ErrorNote onRetry={books.reload}>{books.error}</ErrorNote>

        {books.data && (
          <>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              {books.data.length} buku{search && <> untuk &ldquo;{search}&rdquo;</>}
            </p>

            {books.data.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon="search"
                  title="Buku tidak ditemukan"
                  action={
                    filtered && (
                      <Link to="/books" className="btn btn-primary">
                        Hapus pencarian
                      </Link>
                    )
                  }
                >
                  Coba kata kunci lain atau pilih genre yang berbeda.
                </EmptyState>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.data.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
