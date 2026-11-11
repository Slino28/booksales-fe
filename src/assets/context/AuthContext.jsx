import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearToken, getToken, saveToken, UNAUTHORIZED_EVENT } from "../../api";

/**
 * Menyimpan siapa yang sedang login (nama, email, role) dan menyediakannya
 * ke seluruh aplikasi lewat Context API.
 *
 * Data disimpan di localStorage supaya tidak hilang saat halaman di-refresh.
 */
const USER_KEY = "booksales_user";

export const ROLES = { ADMIN: "admin", CUSTOMER: "customer" };

const AuthContext = createContext(null);

// Baca pengguna dari localStorage. Data rusak / token hilang dianggap belum login.
function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || !getToken()) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.role ? parsed : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // dipanggil setelah API /login berhasil
  const signIn = useCallback((token, profile) => {
    const { name, email, role } = profile;
    saveToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify({ name, email, role }));
    setUser({ name, email, role });
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Server menjawab 401 padahal kita punya token -> sesi sudah tidak berlaku.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, signOut);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, signOut);
  }, [signOut]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      isAdmin: user?.role === ROLES.ADMIN,
      hasRole: (...roles) => user !== null && roles.includes(user.role),
      signIn,
      signOut,
    }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}

// Tujuan setelah login berdasarkan role.
export const homeFor = (role) => (role === ROLES.ADMIN ? "/admin" : "/");
