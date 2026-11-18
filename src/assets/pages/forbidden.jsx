import { Link } from "react-router-dom";
import { homeFor, useAuth } from "../context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <section className="flex min-h-screen items-center justify-center bg-krem px-6">
      <div className="max-w-md text-center">
        <p className="font-judul text-8xl font-bold text-kobalt">403</p>
        <h1 className="mt-4 font-judul text-2xl font-bold text-slate-900">
          Kamu tidak punya akses ke halaman ini
        </h1>
        <p className="mt-3 text-slate-600">
          Halaman tersebut hanya untuk peran tertentu{user ? ` (kamu masuk sebagai ${user.role}).` : "."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={user ? homeFor(user.role) : "/login"} className="btn btn-primary">
            {user ? "Kembali ke beranda" : "Masuk"}
          </Link>
          <Link to="/" className="btn btn-outline">Beranda</Link>
        </div>
      </div>
    </section>
  );
}
