import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/ui/Icon";

const menu = [
  { to: "/admin", label: "Dashboard", icon: "home", end: true },
  { to: "/admin/books", label: "Buku", icon: "book" },
  { to: "/admin/genres", label: "Genre", icon: "tag" },
  { to: "/admin/authors", label: "Penulis", icon: "user" },
  { to: "/admin/transactions", label: "Pesanan", icon: "receipt" },
  { to: "/admin/users", label: "Pengguna", icon: "users" },
  { to: "/admin/messages", label: "Pesan masuk", icon: "mail" },
];

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // laci menu di layar kecil

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-tinta px-4 py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu admin"
      >
        <Link to="/admin" className="flex items-center gap-2 px-2 font-judul text-xl font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kobalt">
            <Icon name="book" className="h-4 w-4" />
          </span>
          BookSales
          <span className="rounded bg-white/15 px-1.5 py-0.5 font-isi text-[10px] font-semibold uppercase tracking-wider">Admin</span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={itemClass}>
              <Icon name={m.icon} className="h-5 w-5" />
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white">
            <Icon name="arrow" className="h-5 w-5" /> Lihat situs
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Icon name="logout" className="h-5 w-5" /> Keluar
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* konten */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <p className="hidden text-sm text-slate-500 lg:block">Panel admin</p>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
