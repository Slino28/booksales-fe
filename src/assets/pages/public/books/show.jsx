import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddToCartButton } from "../../../components/ui/BookCard";
import BookCover from "../../../components/ui/BookCover";
import { ErrorNote, QuantityStepper, Spinner } from "../../../components/ui/Feedback";
import useFetch from "../../../utils/useFetch";
import { formatRupiah } from "../../../utils/format";
import { useAuth } from "../../../context/AuthContext";

export default function ShowBook() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data: book, loading, error, status, reload } = useFetch(`/books/${id}`);
  const [qty, setQty] = useState(1);

  if (loading) return <Spinner label="Memuat buku..." />;

  if (error) {
    return (
      <div className="container-page py-12">
        <ErrorNote onRetry={status === 404 ? undefined : reload}>
          {status === 404 ? "Buku tidak ditemukan." : error}
        </ErrorNote>
        <Link to="/books" className="mt-4 inline-block font-semibold text-kobalt hover:underline">
          &larr; Kembali ke katalog
        </Link>
      </div>
    );
  }

  const habis = Number(book.stock) < 1;

  return (
    <div className="container-page py-10">
      <nav aria-label="Jejak halaman" className="text-sm text-slate-500">
        <Link to="/books" className="hover:text-kobalt">Katalog</Link> / <span className="text-slate-800">{book.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-xs rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <BookCover book={book} />
        </div>

        <div>
          {book.genre?.name && (
            <Link
              to={`/books?genre_id=${book.genre.id}`}
              className="text-xs font-semibold uppercase tracking-wider text-kobalt hover:underline"
            >
              {book.genre.name}
            </Link>
          )}
          <h1 className="mt-1 font-judul text-4xl font-bold leading-tight text-slate-900">{book.title}</h1>
          <p className="mt-2 text-slate-600">
            oleh <span className="font-semibold text-slate-800">{book.author?.name ?? "-"}</span>
          </p>

          <p className="mt-6 text-3xl font-bold text-tinta">{formatRupiah(book.price)}</p>
          <p className={`mt-1 text-sm ${habis ? "font-semibold text-red-600" : "text-slate-500"}`}>
            {habis ? "Stok habis" : `Stok tersedia: ${book.stock}`}
          </p>

          {!isAdmin && !habis && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} max={Number(book.stock)} onChange={setQty} />
              <AddToCartButton book={book} quantity={qty} className="btn btn-primary btn-lg" />
            </div>
          )}

          <h2 className="mt-10 font-judul text-xl font-bold text-slate-900">Deskripsi</h2>
          <p className="mt-2 max-w-2xl whitespace-pre-line leading-relaxed text-slate-700">
            {book.description || "Belum ada deskripsi untuk buku ini."}
          </p>

          {book.author?.bio && (
            <>
              <h2 className="mt-8 font-judul text-xl font-bold text-slate-900">Tentang penulis</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-slate-700">{book.author.bio}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
