import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../api";
import useFetch from "../../utils/useFetch";
import { EmptyState, ErrorNote, Spinner } from "../ui/Feedback";
import Icon from "../ui/Icon";
import PageHead from "./PageHead";

/**
 * Halaman daftar admin yang dipakai bersama oleh buku, genre, dan penulis.
 *
 *  - endpoint : alamat API, mis. "/genres"
 *  - basePath : alamat halaman admin, mis. "/admin/genres" (create = /create, edit = /:id/edit)
 *  - columns  : [{ label, render: (row) => JSX, className? }]
 *  - nameOf   : (row) => teks untuk konfirmasi hapus
 */
export default function ResourceList({ title, noun, endpoint, basePath, columns, nameOf, searchText }) {
  const { data, loading, error, reload } = useFetch(endpoint);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(null); // salinan lokal setelah ada yang dihapus
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const list = rows ?? data ?? [];

  const shown = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return q ? list.filter((r) => searchText(r).toLowerCase().includes(q)) : list;
  }, [list, keyword, searchText]);

  const remove = async (row) => {
    if (!window.confirm(`Hapus ${noun} "${nameOf(row)}"?`)) return;
    setBusyId(row.id);
    setActionError("");
    try {
      await request(`${endpoint}/${row.id}`, { method: "DELETE" });
      setRows(list.filter((r) => r.id !== row.id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHead
        title={title}
        subtitle={data ? `${list.length} ${noun} tersimpan` : undefined}
        action={
          <Link to={`${basePath}/create`} className="btn btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Tambah {noun}
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <label htmlFor="filter" className="sr-only">Cari {noun}</label>
          <div className="relative max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="filter"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={`Cari ${noun}...`}
              className="field h-10 py-0 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 px-4 pt-4 empty:hidden">
          <ErrorNote onRetry={reload}>{error}</ErrorNote>
          <ErrorNote>{actionError}</ErrorNote>
        </div>

        {loading && <Spinner />}

        {data && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {columns.map((c) => (
                    <th key={c.label} scope="col" className={`px-4 py-3 font-semibold ${c.className ?? ""}`}>
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    {columns.map((c) => (
                      <td key={c.label} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`${basePath}/${row.id}/edit`} className="btn btn-outline btn-sm">
                          <Icon name="edit" className="h-3.5 w-3.5" /> Ubah
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(row)}
                          disabled={busyId === row.id}
                          className="btn btn-danger btn-sm"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          {busyId === row.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && (
              <EmptyState title={keyword ? "Tidak ada hasil" : `Belum ada ${noun}`}>
                {keyword ? "Coba kata kunci lain." : `Tambahkan ${noun} pertama lewat tombol di kanan atas.`}
              </EmptyState>
            )}
          </div>
        )}
      </div>
    </>
  );
}
