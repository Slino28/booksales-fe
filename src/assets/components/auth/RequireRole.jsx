import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Penjaga rute. Dipakai sebagai "layout route" yang membungkus halaman lain:
 *
 *   { element: <RequireRole roles={["admin"]} />, children: [ ... ] }
 *
 * - belum login            -> diarahkan ke /login (alamat asal disimpan di state)
 * - login tapi role salah  -> diarahkan ke /forbidden
 * - lolos                  -> halaman anak ditampilkan lewat <Outlet />
 *
 * Tanpa prop `roles`, cukup login saja yang diwajibkan.
 */
export default function RequireRole({ roles }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
