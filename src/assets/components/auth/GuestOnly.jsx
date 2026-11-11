import { Navigate, Outlet, useLocation } from "react-router-dom";
import { homeFor, ROLES, useAuth } from "../../context/AuthContext";

/**
 * Kebalikan RequireRole: halaman login & register hanya untuk tamu.
 * Kalau sudah login, pengguna dikirim ke:
 *  - halaman yang tadi ingin dibuka (state.from), jika role-nya boleh, atau
 *  - beranda sesuai role (admin -> /admin, customer -> /).
 */
export default function GuestOnly() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Outlet />;

  const from = location.state?.from;
  const allowed = from && (!from.startsWith("/admin") || user.role === ROLES.ADMIN);

  return <Navigate to={allowed ? from : homeFor(user.role)} replace />;
}
