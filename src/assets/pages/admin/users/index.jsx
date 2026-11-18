import { useMemo, useState } from "react";
import PageHead from "../../../components/admin/PageHead";
import Icon from "../../../components/ui/Icon";
import { EmptyState, ErrorNote, Spinner } from "../../../components/ui/Feedback";
import useFetch from "../../../utils/useFetch";
import { formatTanggal } from "../../../utils/format";

export default function AdminUsers() {
  const { data, loading, error, reload } = useFetch("/users");
  const [keyword, setKeyword] = useState("");

  const shown = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return (data ?? []).filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [data, keyword]);

  return (
    <>
      <PageHead title="Pengguna" subtitle={data ? `${data.length} akun terdaftar` : undefined} />

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <label htmlFor="cari-user" className="sr-only">Cari pengguna</label>
          <div className="relative max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="cari-user"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari nama atau email..."
              className="field h-10 py-0 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="px-4 pt-4 empty:hidden">
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
        </div>
        {loading && <Spinner />}

        {data && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {["Nama", "Email", "Peran", "Pesanan", "Bergabung"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta text-sm font-bold text-white">
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.role === "admin" ? "bg-kobalt/10 text-kobalt" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{u.transactions_count}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTanggal(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && <EmptyState icon="users" title="Pengguna tidak ditemukan" />}
          </div>
        )}
      </div>
    </>
  );
}
