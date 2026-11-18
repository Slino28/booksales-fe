import { useState } from "react";
import { request } from "../../../api";
import { useAuth } from "../../context/AuthContext";
import { ErrorNote, SuccessNote } from "../../components/ui/Feedback";

export default function Contact() {
  const { user } = useAuth();
  // pengguna yang sudah login tidak perlu mengetik nama dan email lagi
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
      await request("/contact", { method: "POST", body: form });
      setSent(true);
      setForm((f) => ({ ...f, subject: "", message: "" }));
    } catch (err) {
      setErrors(err.errors ?? {});
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Nama", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "subject", label: "Subjek" },
  ];

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-kobalt">Kontak</p>
        <h1 className="mt-2 font-judul text-4xl font-bold leading-tight text-slate-900">
          Ada pertanyaan? Kirim pesan ke admin.
        </h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Tanyakan soal stok, pesanan, atau saran buku. Pesanmu masuk ke kotak pesan admin dan akan
          dibaca secepatnya.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8">
        {sent && <SuccessNote>Pesan terkirim. Terima kasih sudah menghubungi kami.</SuccessNote>}
        <ErrorNote>{Object.keys(errors).length === 0 ? formError : ""}</ErrorNote>

        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="label">{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              value={form[f.name]}
              onChange={change}
              aria-invalid={errors[f.name] ? "true" : "false"}
              className={`field ${errors[f.name] ? "field-error" : ""}`}
            />
            {errors[f.name] && <p className="mt-1.5 text-sm text-red-600">{errors[f.name][0]}</p>}
          </div>
        ))}

        <div>
          <label htmlFor="message" className="label">Pesan</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={change}
            aria-invalid={errors.message ? "true" : "false"}
            className={`field ${errors.message ? "field-error" : ""}`}
          />
          {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message[0]}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
          {loading ? "Mengirim..." : "Kirim pesan"}
        </button>
      </form>
    </div>
  );
}
