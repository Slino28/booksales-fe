// Alamat backend Laravel. Bisa diganti lewat file .env (VITE_API_URL=...) tanpa mengubah kode.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const TOKEN_KEY = "booksales_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Error khusus supaya halaman bisa membaca status (401/403/422) dan daftar error validasi.
export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Pembungkus fetch untuk memanggil API.
 * - otomatis menyertakan token (kalau sudah login)
 * - mengembalikan JSON { success, message, data } dari Laravel
 * - melempar ApiError kalau gagal
 */
export async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Tidak bisa menghubungi server. Pastikan backend sudah dijalankan (php artisan serve)."
    );
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(json.message ?? "Terjadi kesalahan.", res.status, json.errors);
  }

  return json;
}
