import { useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../api";
import { useAuth } from "../../context/AuthContext";
import AuthShowcase from "../../components/auth/AuthShowcase";
import TextField from "../../components/form/TextField";
import PasswordField from "../../components/form/PasswordField";

export default function Login() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await request("/login", { method: "POST", body: form });
      const { token, user } = res.data;
      // Setelah signIn, <GuestOnly> otomatis memindahkan pengguna ke halaman tujuan.
      signIn(token, user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen font-isi lg:grid-cols-[5fr_6fr]">
      <AuthShowcase />

      <main className="flex items-center bg-white px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-[26rem]">
          <Link to="/" className="mb-8 block font-judul text-xl font-bold text-tinta lg:hidden">
            BookSales
          </Link>

          <h1 className="font-judul text-3xl font-bold tracking-tight text-slate-900">Selamat datang kembali</h1>
          <p className="mt-2 text-[15px] text-slate-600">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-kobalt hover:underline">
              Daftar
            </Link>
          </p>

          {error && (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              autoComplete="email"
            />
            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password kamu"
              autoComplete="current-password"
            />
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
