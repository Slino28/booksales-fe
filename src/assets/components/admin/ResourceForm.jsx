import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "../../../api";
import useFetch from "../../utils/useFetch";
import { ErrorNote, Spinner } from "../ui/Feedback";
import PageHead from "./PageHead";

/**
 * Form tambah / ubah yang dipakai bersama oleh buku, genre, dan penulis.
 * Kalau URL punya :id, formnya mode ubah (data lama diisi dari API).
 *
 * fields: [{ name, label, type?: "text"|"number"|"textarea"|"select", required?,
 *            placeholder?, hint?, optionsFrom?: "/genres" }]
 */
export default function ResourceForm({ noun, endpoint, basePath, fields }) {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const blank = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // data lama (mode ubah)
  const old = useFetch(editing ? `${endpoint}/${id}` : null);
  useEffect(() => {
    if (!old.data) return;
    setForm(Object.fromEntries(fields.map((f) => [f.name, old.data[f.name] ?? ""])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [old.data]);

  // pilihan untuk kolom select, mis. daftar genre di form buku
  const selectSources = fields.filter((f) => f.optionsFrom);
  const options = {
    a: useFetch(selectSources[0]?.optionsFrom ?? null),
    b: useFetch(selectSources[1]?.optionsFrom ?? null),
  };
  const optionsOf = (field) => {
    const i = selectSources.indexOf(field);
    return (i === 0 ? options.a.data : i === 1 ? options.b.data : null) ?? [];
  };

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");
    try {
      await request(editing ? `${endpoint}/${id}` : endpoint, {
        method: editing ? "PUT" : "POST",
        body: form,
      });
      navigate(basePath);
    } catch (err) {
      setErrors(err.errors ?? {});
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (editing && old.loading) return <Spinner />;
  if (editing && old.error) {
    return (
      <>
        <ErrorNote onRetry={old.reload}>{old.error}</ErrorNote>
        <Link to={basePath} className="mt-4 inline-block font-semibold text-kobalt hover:underline">
          &larr; Kembali
        </Link>
      </>
    );
  }

  return (
    <>
      <PageHead title={`${editing ? "Ubah" : "Tambah"} ${noun}`} />

      <form onSubmit={submit} noValidate className="card max-w-2xl space-y-5 p-6 sm:p-8">
        <ErrorNote>{Object.keys(errors).length === 0 ? formError : ""}</ErrorNote>

        {fields.map((f) => {
          const cls = `field ${errors[f.name] ? "field-error" : ""}`;
          const common = {
            id: f.name,
            name: f.name,
            value: form[f.name],
            onChange: change,
            required: f.required,
            placeholder: f.placeholder,
            "aria-invalid": errors[f.name] ? "true" : "false",
            className: cls,
          };

          return (
            <div key={f.name}>
              <label htmlFor={f.name} className="label">
                {f.label}
                {f.required && <span className="text-red-600"> *</span>}
              </label>

              {f.type === "textarea" ? (
                <textarea rows="5" {...common} />
              ) : f.type === "select" ? (
                <select {...common}>
                  <option value="">Pilih {f.label.toLowerCase()}</option>
                  {optionsOf(f).map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              ) : (
                <input type={f.type ?? "text"} min={f.type === "number" ? 0 : undefined} {...common} />
              )}

              {f.hint && !errors[f.name] && <p className="mt-1.5 text-xs text-slate-500">{f.hint}</p>}
              {errors[f.name] && <p className="mt-1.5 text-sm text-red-600">{errors[f.name][0]}</p>}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Menyimpan..." : editing ? "Simpan perubahan" : `Tambah ${noun}`}
          </button>
          <Link to={basePath} className="btn btn-outline">Batal</Link>
        </div>
      </form>
    </>
  );
}
