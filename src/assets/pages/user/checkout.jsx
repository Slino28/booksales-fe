import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { request } from "../../../api";
import { useCart } from "../../context/CartContext";
import { ErrorNote } from "../../components/ui/Feedback";
import Icon from "../../components/ui/Icon";
import { formatRupiah } from "../../utils/format";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({ shipping_address: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // hasil pesanan yang berhasil dibuat

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setErrors({});

    try {
      const res = await request("/checkout", {
        method: "POST",
        body: {
          ...form,
          payment_method: "cod",
          items: items.map((i) => ({ book_id: i.id, quantity: i.quantity })),
        },
      });
      setDone(res.data);
      clear();
    } catch (err) {
      setErrors(err.errors ?? {});
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="container-page max-w-xl py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white motion-safe:animate-pop">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-judul text-3xl font-bold text-slate-900">Pesanan diterima</h1>
        <p className="mt-2 text-slate-600">
          Kode pesananmu <span className="font-mono font-semibold text-slate-900">{done.order_code}</span>.
          Siapkan uang tunai {formatRupiah(done.grand_total)} saat kurir tiba.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/orders" className="btn btn-primary btn-lg">Lihat pesanan saya</Link>
          <Link to="/books" className="btn btn-outline btn-lg">Belanja lagi</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" replace />;

  // error stok dari server berbentuk items.0.quantity; tampilkan semuanya di satu tempat
  const itemErrors = Object.entries(errors)
    .filter(([key]) => key.startsWith("items"))
    .map(([, msg]) => msg[0]);

  return (
    <div className="container-page py-10">
      <h1 className="font-judul text-4xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8">
          <h2 className="font-judul text-xl font-bold text-slate-900">Alamat pengiriman</h2>
          {/* pesan umum disembunyikan kalau sudah ada pesan per kolom */}
          <ErrorNote>{Object.keys(errors).length === 0 ? formError : ""}</ErrorNote>
          {itemErrors.length > 0 && (
            <ul role="alert" className="list-disc rounded-xl border border-red-200 bg-red-50 py-3 pl-8 pr-4 text-sm text-red-800">
              {itemErrors.map((m) => <li key={m}>{m}</li>)}
            </ul>
          )}

          <div>
            <label htmlFor="shipping_address" className="label">Alamat lengkap</label>
            <textarea
              id="shipping_address"
              name="shipping_address"
              rows="4"
              value={form.shipping_address}
              onChange={change}
              placeholder="Jalan, nomor rumah, kecamatan, kota, kode pos"
              aria-invalid={errors.shipping_address ? "true" : "false"}
              className={`field ${errors.shipping_address ? "field-error" : ""}`}
            />
            {errors.shipping_address && <p className="mt-1.5 text-sm text-red-600">{errors.shipping_address[0]}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="label">Nomor telepon</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={change}
              placeholder="081234567890"
              autoComplete="tel"
              aria-invalid={errors.phone ? "true" : "false"}
              className={`field ${errors.phone ? "field-error" : ""}`}
            />
            {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone[0]}</p>}
          </div>

          <fieldset>
            <legend className="label">Metode pembayaran</legend>
            <label className="flex items-start gap-3 rounded-xl border-2 border-kobalt bg-kobalt/5 p-4">
              <input type="radio" name="payment" checked readOnly className="mt-1 accent-kobalt" />
              <span>
                <span className="block font-semibold text-slate-900">Bayar di tempat (COD)</span>
                <span className="text-sm text-slate-600">Bayar tunai ke kurir saat buku sampai.</span>
              </span>
            </label>
          </fieldset>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full sm:w-auto">
            {loading ? "Memproses..." : "Buat pesanan"}
          </button>
        </form>

        <aside className="card p-6">
          <h2 className="font-judul text-xl font-bold text-slate-900">Pesananmu</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-slate-700">{i.title} <span className="text-slate-500">&times; {i.quantity}</span></span>
                <span className="font-semibold">{formatRupiah(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold text-tinta">
            <span>Total</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <Link to="/cart" className="mt-4 inline-block text-sm font-semibold text-kobalt hover:underline">
            &larr; Ubah keranjang
          </Link>
        </aside>
      </div>
    </div>
  );
}
