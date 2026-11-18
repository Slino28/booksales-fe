import { useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../api";
import { EmptyState, ErrorNote, Spinner, StatusBadge } from "../../components/ui/Feedback";
import useFetch from "../../utils/useFetch";
import { formatRupiah, formatTanggal, kodePesanan } from "../../utils/format";

export default function Orders() {
  const { data, loading, error, reload } = useFetch("/my-orders");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const cancel = async (order) => {
    if (!window.confirm(`Batalkan pesanan "${order.book?.title}"?`)) return;
    setBusyId(order.id);
    setActionError("");
    try {
      await request(`/my-orders/${order.id}/cancel`, { method: "PATCH" });
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // kelompokkan baris transaksi berdasarkan kode pesanan (satu checkout = satu kelompok)
  const groups = [];
  (data ?? []).forEach((row) => {
    const kode = kodePesanan(row.order_number);
    const found = groups.find((g) => g.kode === kode);
    if (found) found.rows.push(row);
    else groups.push({ kode, created_at: row.created_at, rows: [row] });
  });

  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="font-judul text-4xl font-bold text-slate-900">Pesanan saya</h1>

      <div className="mt-8 space-y-5">
        {loading && <Spinner />}
        <ErrorNote onRetry={reload}>{error}</ErrorNote>
        <ErrorNote>{actionError}</ErrorNote>

        {data && groups.length === 0 && (
          <div className="card">
            <EmptyState
              icon="receipt"
              title="Belum ada pesanan"
              action={<Link to="/books" className="btn btn-primary">Mulai belanja</Link>}
            >
              Pesanan yang kamu buat akan muncul di sini.
            </EmptyState>
          </div>
        )}

        {groups.map((g) => (
          <section key={g.kode} className="card overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm">
              <span className="font-mono font-semibold text-slate-900">{g.kode}</span>
              <span className="text-slate-500">{formatTanggal(g.created_at)}</span>
            </header>
            <ul className="divide-y divide-slate-100">
              {g.rows.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-judul font-bold text-slate-900">{row.book?.title ?? "Buku dihapus"}</p>
                    <p className="text-sm text-slate-500">
                      {row.quantity} &times; {formatRupiah(row.book?.price ?? 0)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-tinta">{formatRupiah(row.total_amount)}</p>
                    <StatusBadge status={row.status} />
                    {row.status === "menunggu" && (
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => cancel(row)}
                        className="btn btn-danger btn-sm"
                      >
                        {busyId === row.id ? "..." : "Batalkan"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              <span>Kirim ke: {g.rows[0].shipping_address ?? "-"}</span>
              <span>Bayar di tempat (COD)</span>
            </footer>
          </section>
        ))}
      </div>
    </div>
  );
}
