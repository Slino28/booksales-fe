// Aturan validasi form registrasi. Setiap fungsi mengembalikan pesan error,
// atau string kosong ("") kalau isinya sudah benar.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

const rules = {
  fullName(value) {
    const text = value.trim();
    if (!text) return "Nama lengkap wajib diisi.";
    if (text.length < 3) return "Nama lengkap minimal 3 karakter.";
    return "";
  },

  email(value) {
    const text = value.trim();
    if (!text) return "Email wajib diisi.";
    if (!EMAIL_PATTERN.test(text)) return "Format email tidak valid.";
    return "";
  },

  username(value) {
    const text = value.trim();
    if (!text) return "Username wajib diisi.";
    if (text.length < 4) return "Username minimal 4 karakter.";
    if (text.length > 20) return "Username maksimal 20 karakter.";
    if (!USERNAME_PATTERN.test(text))
      return "Username hanya boleh huruf, angka, dan garis bawah (_).";
    return "";
  },

  password(value) {
    if (!value) return "Password wajib diisi.";
    if (value.length < 8) return "Password minimal 8 karakter.";
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value))
      return "Password harus mengandung huruf dan angka.";
    return "";
  },

  // butuh dua nilai, jadi menerima seluruh isi form sebagai argumen kedua
  confirmPassword(value, values) {
    if (!value) return "Konfirmasi password wajib diisi.";
    if (value !== values.password) return "Konfirmasi password tidak sama.";
    return "";
  },
};

/** Periksa seluruh form. Hasilnya hanya berisi field yang bermasalah. */
export function validateRegister(values) {
  const errors = {};

  for (const field of Object.keys(rules)) {
    const message = rules[field](values[field] ?? "", values);
    if (message) errors[field] = message;
  }

  return errors;
}

/** Nilai kekuatan password 0-4 beserta label dan warna batangnya. */
export function passwordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-gray-200" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // nama kelas ditulis utuh supaya terbaca oleh Tailwind
  const levels = [
    { label: "Lemah", color: "bg-red-500" },
    { label: "Lemah", color: "bg-red-500" },
    { label: "Sedang", color: "bg-yellow-500" },
    { label: "Kuat", color: "bg-green-500" },
    { label: "Sangat kuat", color: "bg-green-600" },
  ];

  return { score, ...levels[score] };
}
