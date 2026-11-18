import { useState } from "react";
import { request } from "../../../../api";
import PageHead from "../../../components/admin/PageHead";
import { EmptyState, ErrorNote, Spinner } from "../../../components/ui/Feedback";
import useFetch from "../../../utils/useFetch";
import { formatRupiah, formatTanggal, STATUS_PESANAN } from "../../../utils/format";

const tabs = ["semua", ...Object.keys(STATUS_PESANAN)];

export default function AdminTransactions() {
  const { data, loading, error, reload } = useFetch("/transactions");
  const [tab, setTab] = useState("semua");
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [changes, setChanges] = useState({}); // id -> status baru, supaya tabel langsung berubah

  const rows = (data ?? []).map((r) => ({ ...r, status: changes[r.id] ?? r.status }));
  const shown = tab === "semua" ? rows : rows.filter((r) => r.status === tab);

  const changeStatus = async (row, status) => {
    setBusyId(row.id);
    setActionError("");
    try {
      await request(`/transactions/${row.id}/status`, { method: "PATCH", body: { status } });
      setChanges((c) => ({ ...c, [row.id]: status }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const count = (t) => (t === "semua" ? rows.length : rows.filter((r) => r.status === t).length);

  return (
    <>
      <PageHead title="Pesanan" subtitle="Pesanan dari semua pembeli. Ubah statusnya sesuai perkembangan pengiriman." />

      <div className="card overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-3" role="tablist">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${
                tab === t ? "bg-kobalt text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t === "semua" ? "Semua" : STATUS_PESANAN[t].label} <span className="opacity-70">({count(t)})</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 px-4 pt-4 empty:hidden">
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
          <ErrorNote>{actionError}</ErrorNote>
        </div>

        {loading && <Spinner />}

        {data && shown.length === 0 && <EmptyState icon="receipt" title="Tidak ada pesanan">Belum ada pesanan dengan status ini.</EmptyState>}

        {shown.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {["Kode", "Pembeli", "Buku", "Total", "Pengiriman", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((o) => (
                  <tr key={o.id} className="align-top hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-slate-900">{o.order_number}</p>
                      <p className="text-xs text-slate-500">{formatTanggal(o.created_at)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{o.customer?.name ?? "-"}</p>
                      <p className="text-xs text-slate-500">{o.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{o.book?.title ?? "Buku dihapus"}</p>
                      <p className="text-xs text-slate-500">&times; {o.quantity}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatRupiah(o.total_amount)}</td>
                    <td className="max-w-xs px-4 py-3 text-xs text-slate-600">
                      <p className="line-clamp-2">{o.shipping_address ?? "-"}</p>
                      <p className="mt-0.5 text-slate-500">{o.phone ?? ""}</p>
                    </td>
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`status-${o.id}`}>Status pesanan {o.order_number}</label>
                      <select
                        id={`status-${o.id}`}
                        value={o.status}
                        disabled={busyId === o.id || o.status === "dibatalkan"}
                        onChange={(e) => changeStatus(o, e.target.value)}
                        className="field h-9 w-36 py-0 text-sm"
                      >
                        {Object.entries(STATUS_PESANAN).map(([value, meta]) => (
                          <option key={value} value={value}>{meta.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
