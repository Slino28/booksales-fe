import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/format";
import BookCover from "./BookCover";
import Icon from "./Icon";

/** Tombol "Tambah ke keranjang" dengan umpan balik singkat. Admin tidak membelinya. */
export function AddToCartButton({ book, quantity = 1, className = "btn btn-primary" }) {
  const { isAdmin } = useAuth();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  if (isAdmin) return null;

  const habis = Number(book.stock) < 1;

  return (
    <button
      type="button"
      disabled={habis}
      onClick={() => {
        add(book, quantity);
        setAdded(true);
      }}
      className={className}
    >
      <Icon name={added ? "check" : "cart"} className="h-4 w-4" />
      {habis ? "Stok habis" : added ? "Ditambahkan" : "Tambah ke keranjang"}
    </button>
  );
}

export default function BookCard({ book }) {
  const habis = Number(book.stock) < 1;

  return (
    <article className="group card flex flex-col p-4 transition-shadow hover:shadow-md">
      <Link to={`/books/${book.id}`} className="block rounded-lg bg-krem p-5">
        <BookCover
          book={book}
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        {book.genre?.name && (
          <p className="text-xs font-semibold uppercase tracking-wider text-kobalt">
            {book.genre.name}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 font-judul text-lg font-bold leading-snug text-slate-900">
          <Link to={`/books/${book.id}`} className="hover:text-kobalt">
            {book.title}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">{book.author?.name ?? "Penulis tidak diketahui"}</p>

        <div className="mt-auto pt-4">
          <p className="text-lg font-bold text-tinta">{formatRupiah(book.price)}</p>
          <p className={`text-xs ${habis ? "text-red-600" : "text-slate-500"}`}>
            {habis ? "Stok habis" : `Stok ${book.stock}`}
          </p>
          <AddToCartButton book={book} className="btn btn-outline mt-3 w-full" />
        </div>
      </div>
    </article>
  );
}
