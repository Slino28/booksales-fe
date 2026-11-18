import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roleLabel = { admin: "Administrator", customer: "Pelanggan" };

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <section className="container-page max-w-xl py-12">
      <div className="card p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-tinta text-2xl font-bold text-white">
            {user.name?.trim()?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-judul text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-slate-500">Peran</dt>
            <dd>
              <span className="rounded-full bg-kobalt/10 px-2.5 py-0.5 text-xs font-semibold text-kobalt">
                {roleLabel[user.role] ?? user.role}
              </span>
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-slate-500">Akses dashboard admin</dt>
            <dd className="font-semibold text-slate-900">{isAdmin ? "Ya" : "Tidak"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          {isAdmin ? (
            <Link to="/admin" className="btn btn-primary">Buka dashboard admin</Link>
          ) : (
            <Link to="/orders" className="btn btn-primary">Pesanan saya</Link>
          )}
          <button type="button" onClick={handleLogout} className="btn btn-danger">Keluar</button>
        </div>
      </div>
    </section>
  );
}
