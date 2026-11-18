import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Icon from "./ui/Icon";

const links = [
  { to: "/", label: "Beranda", end: true },
  { to: "/books", label: "Buku" },
  { to: "/about", label: "Tentang" },
  { to: "/contact", label: "Kontak" },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-kobalt/10 text-kobalt" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const userRef = useRef(null);

  // tutup menu setiap pindah halaman
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // klik di luar menu pengguna menutupnya
  useEffect(() => {
    const close = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/books?search=${encodeURIComponent(q)}` : "/books");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-judul text-xl font-bold text-tinta">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kobalt text-white">
            <Icon name="book" className="h-4 w-4" />
          </span>
          BookSales
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Menu utama">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSearch} role="search" className="ml-auto hidden max-w-xs flex-1 md:block">
          <label htmlFor="nav-search" className="sr-only">
            Cari buku
          </label>
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="nav-search"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari judul, penulis, genre"
              className="field h-10 rounded-full bg-slate-50 py-0 pl-9 text-sm"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {!isAdmin && (
            <Link
              to="/cart"
              aria-label={`Keranjang, ${count} barang`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Icon name="cart" className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-jingga px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setUserOpen((o) => !o)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta text-sm font-bold text-white">
                  {user.name?.trim()?.[0]?.toUpperCase() ?? "?"}
                </span>
                <span className="hidden max-w-[7rem] truncate text-sm font-semibold sm:block">
                  {user.name}
                </span>
              </button>

              {userOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link role="menuitem" to="/admin" className="block px-4 py-2 text-sm hover:bg-slate-50">
                      Dashboard admin
                    </Link>
                  )}
                  <Link role="menuitem" to="/profile" className="block px-4 py-2 text-sm hover:bg-slate-50">
                    Profil
                  </Link>
                  {!isAdmin && (
                    <Link role="menuitem" to="/orders" className="block px-4 py-2 text-sm hover:bg-slate-50">
                      Pesanan saya
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-outline">
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary">
                Daftar
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Buka menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page space-y-1 py-3">
            <form onSubmit={handleSearch} role="search" className="mb-2 md:hidden">
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari buku..."
                aria-label="Cari buku"
                className="field"
              />
            </form>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={(s) => `block ${linkClass(s)}`}>
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2 sm:hidden">
                <Link to="/login" className="btn btn-outline flex-1">
                  Masuk
                </Link>
                <Link to="/register" className="btn btn-primary flex-1">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
