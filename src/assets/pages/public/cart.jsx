import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import BookCover from "../../components/ui/BookCover";
import Icon from "../../components/ui/Icon";
import { EmptyState, QuantityStepper } from "../../components/ui/Feedback";
import { formatRupiah } from "../../utils/format";

export default function Cart() {
  const { items, subtotal, setQuantity, remove } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <div className="card">
          <EmptyState
            icon="cart"
            title="Keranjangmu masih kosong"
            action={<Link to="/books" className="btn btn-primary">Cari buku</Link>}
          >
            Tambahkan buku dari katalog, lalu kembali ke sini untuk checkout.
          </EmptyState>
        </div>
      </div>
    );
  }

  // tamu diarahkan ke login; setelah masuk mereka kembali ke halaman checkout
  const goCheckout = () => navigate(user ? "/checkout" : "/login", { state: { from: "/checkout" } });

  return (
    <div className="container-page py-10">
      <h1 className="font-judul text-4xl font-bold text-slate-900">Keranjang</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="card divide-y divide-slate-100">
          {items.map((it) => (
            <li key={it.id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/books/${it.id}`} className="w-20 flex-none sm:w-24">
                <BookCover book={{ id: it.id, title: it.title, cover_photo: it.cover_photo, author: it.author }} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/books/${it.id}`} className="font-judul text-lg font-bold leading-snug text-slate-900 hover:text-kobalt">
                  {it.title}
                </Link>
                <p className="text-sm text-slate-500">{it.author}</p>
                <p className="mt-1 text-sm font-semibold text-tinta">{formatRupiah(it.price)}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <QuantityStepper size="sm" value={it.quantity} max={it.stock} onChange={(q) => setQuantity(it.id, q)} />
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-900">{formatRupiah(it.price * it.quantity)}</p>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      aria-label={`Hapus ${it.title} dari keranjang`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card sticky top-24 p-6">
          <h2 className="font-judul text-xl font-bold text-slate-900">Ringkasan</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Pembayaran</dt>
              <dd className="font-semibold">Bayar di tempat</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold text-tinta">
            <span>Total</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          {isAdmin ? (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              Akun admin tidak bisa memesan. Masuk sebagai customer untuk checkout.
            </p>
          ) : (
            <button type="button" onClick={goCheckout} className="btn btn-primary btn-lg mt-5 w-full">
              {user ? "Lanjut ke checkout" : "Masuk untuk checkout"}
            </button>
          )}
          <p className="mt-3 text-xs text-slate-500">Total akhir dihitung ulang oleh server saat pesanan dibuat.</p>
        </aside>
      </div>
    </div>
  );
}
