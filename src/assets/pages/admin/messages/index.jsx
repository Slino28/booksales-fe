import { useState } from "react";
import { request } from "../../../../api";
import PageHead from "../../../components/admin/PageHead";
import Icon from "../../../components/ui/Icon";
import { EmptyState, ErrorNote, Spinner } from "../../../components/ui/Feedback";
import useFetch from "../../../utils/useFetch";
import { formatTanggal } from "../../../utils/format";

export default function AdminMessages() {
  const { data, loading, error, reload } = useFetch("/messages");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const act = async (id, run) => {
    setBusyId(id);
    setActionError("");
    try {
      await run();
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const markRead = (m) => act(m.id, () => request(`/messages/${m.id}/read`, { method: "PATCH" }));
  const remove = (m) => {
    if (!window.confirm(`Hapus pesan dari ${m.name}?`)) return;
    act(m.id, () => request(`/messages/${m.id}`, { method: "DELETE" }));
  };

  const unread = (data ?? []).filter((m) => !m.is_read).length;

  return (
    <>
      <PageHead title="Pesan masuk" subtitle={data ? `${data.length} pesan, ${unread} belum dibaca` : undefined} />

      <div className="space-y-4">
        <ErrorNote onRetry={reload}>{error}</ErrorNote>
        <ErrorNote>{actionError}</ErrorNote>
        {loading && <Spinner />}

        {data?.length === 0 && (
          <div className="card"><EmptyState icon="mail" title="Belum ada pesan">Pesan dari halaman Kontak akan tampil di sini.</EmptyState></div>
        )}

        {data?.map((m) => (
          <article key={m.id} className={`card p-5 ${m.is_read ? "" : "border-l-4 border-l-kobalt"}`}>
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-judul text-lg font-bold text-slate-900">
                  {m.subject}
                  {!m.is_read && <span className="ml-2 rounded-full bg-kobalt px-2 py-0.5 align-middle text-[11px] font-semibold text-white">Baru</span>}
                </h2>
                <p className="text-sm text-slate-500">
                  {m.name} &middot; <a href={`mailto:${m.email}`} className="text-kobalt hover:underline">{m.email}</a> &middot; {formatTanggal(m.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                {!m.is_read && (
                  <button type="button" disabled={busyId === m.id} onClick={() => markRead(m)} className="btn btn-outline btn-sm">
                    <Icon name="check" className="h-3.5 w-3.5" /> Tandai dibaca
                  </button>
                )}
                <button type="button" disabled={busyId === m.id} onClick={() => remove(m)} className="btn btn-danger btn-sm">
                  <Icon name="trash" className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </header>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{m.message}</p>
          </article>
        ))}
      </div>
    </>
  );
}
