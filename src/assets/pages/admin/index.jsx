import { Link } from "react-router-dom";
import PageHead from "../../components/admin/PageHead";
import Icon from "../../components/ui/Icon";
import { ErrorNote, Spinner, StatusBadge } from "../../components/ui/Feedback";
import useFetch from "../../utils/useFetch";
import { formatRupiah, formatTanggal } from "../../utils/format";

function Stat({ icon, label, value, note, to, tone }) {
  return (
    <Link to={to} className="card flex items-start gap-4 p-5 transition-shadow hover:shadow-md">
      <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${tone}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-judul text-2xl font-bold text-slate-900">{value}</p>
        {note && <p className="text-xs text-slate-500">{note}</p>}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const books = useFetch("/books");
  const orders = useFetch("/transactions");
  const users = useFetch("/users");
  const messages = useFetch("/messages");

  const loading = [books, orders, users, messages].some((r) => r.loading);
  const error = [books, orders, users, messages].find((r) => r.error)?.error;

  const orderList = orders.data ?? [];
  const aktif = orderList.filter((o) => o.status !== "dibatalkan");
  const pendapatan = aktif.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const menunggu = orderList.filter((o) => o.status === "menunggu").length;
  const belumDibaca = (messages.data ?? []).filter((m) => !m.is_read).length;
  const stokTipis = (books.data ?? []).filter((b) => Number(b.stock) <= 5);

  return (
    <>
      <PageHead title="Dashboard" subtitle="Ringkasan toko hari ini." />
      <ErrorNote>{error}</ErrorNote>
      {loading && <Spinner />}

      {!loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat to="/admin/transactions" icon="chart" label="Pendapatan" value={formatRupiah(pendapatan)} note="Tidak termasuk yang dibatalkan" tone="bg-green-100 text-green-700" />
            <Stat to="/admin/transactions" icon="receipt" label="Pesanan" value={orderList.length} note={`${menunggu} menunggu diproses`} tone="bg-amber-100 text-amber-700" />
            <Stat to="/admin/users" icon="users" label="Pengguna" value={users.data?.length ?? 0} tone="bg-blue-100 text-blue-700" />
            <Stat to="/admin/messages" icon="mail" label="Pesan masuk" value={messages.data?.length ?? 0} note={`${belumDibaca} belum dibaca`} tone="bg-rose-100 text-rose-700" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="card overflow-hidden">
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-judul text-lg font-bold">Pesanan terbaru</h2>
                <Link to="/admin/transactions" className="text-sm font-semibold text-kobalt hover:underline">Semua</Link>
              </header>
              <ul className="divide-y divide-slate-100">
                {orderList.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{o.book?.title ?? "Buku dihapus"}</p>
                      <p className="text-xs text-slate-500">{o.customer?.name ?? "-"} &middot; {formatTanggal(o.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatRupiah(o.total_amount)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </li>
                ))}
                {orderList.length === 0 && <li className="px-5 py-8 text-center text-sm text-slate-500">Belum ada pesanan.</li>}
              </ul>
            </section>

            <section className="card overflow-hidden">
              <header className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-judul text-lg font-bold">Stok menipis</h2>
              </header>
              <ul className="divide-y divide-slate-100">
                {stokTipis.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <Link to={`/admin/books/${b.id}/edit`} className="truncate font-semibold hover:text-kobalt">{b.title}</Link>
                    <span className="flex-none rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      sisa {b.stock}
                    </span>
                  </li>
                ))}
                {stokTipis.length === 0 && <li className="px-5 py-8 text-center text-sm text-slate-500">Semua stok aman.</li>}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}
