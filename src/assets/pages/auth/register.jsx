import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../api";
import AuthShowcase from "../../components/auth/AuthShowcase";
import TextField from "../../components/form/TextField";
import PasswordField from "../../components/form/PasswordField";
import { validateRegister } from "../../utils/validators";

const emptyForm = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

// Daftar kolom. Menambah kolom baru cukup menambah satu baris di sini.
const fields = [
  {
    name: "fullName",
    label: "Nama lengkap",
    placeholder: "Nama sesuai identitas",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "nama@email.com",
    autoComplete: "email",
  },
  {
    name: "username",
    label: "Username",
    placeholder: "Huruf, angka, atau garis bawah",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    isPassword: true,
    showStrength: true,
    placeholder: "Minimal 8 karakter",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Konfirmasi password",
    isPassword: true,
    placeholder: "Ketik ulang password",
    autoComplete: "new-password",
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // hasil validasi dihitung ulang otomatis setiap isi form berubah
  const errors = useMemo(() => validateRegister(values), [values]);

  // error baru ditampilkan setelah kolomnya disentuh, atau setelah tombol ditekan
  const errorOf = (field) => {
    if (serverErrors[field]) return serverErrors[field];
    return touched[field] || submitted ? errors[field] : "";
  };

  const isValid = (field) =>
    Boolean(touched[field]) &&
    values[field] !== "" &&
    !errors[field] &&
    !serverErrors[field];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // pesan dari server dihapus begitu pengguna memperbaiki kolom itu
    if (serverErrors[name]) setServerErrors({ ...serverErrors, [name]: "" });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      // backend Laravel menerima name, email, password
      await request("/register", {
        method: "POST",
        body: {
          name: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
        },
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      // petakan nama field milik server ke nama field di form ini
      const fromServer = err.errors ?? {};
      setServerErrors({
        fullName: fromServer.name?.[0] ?? "",
        email: fromServer.email?.[0] ?? "",
        password: fromServer.password?.[0] ?? "",
      });
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen font-isi lg:grid-cols-[5fr_6fr]">
      <AuthShowcase />

      <main className="flex items-center bg-white px-6 py-10 dark:bg-malam sm:px-12">
        <div className="mx-auto w-full max-w-[26rem]">
          <Link
            to="/"
            className="mb-8 block font-judul text-xl font-bold text-tinta dark:text-white lg:hidden"
          >
            BookSales
          </Link>

          {success ? (
            <div role="status">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-kobalt text-white motion-safe:animate-pop">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7"
                >
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <h1 className="mt-6 font-judul text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Akun dibuat
              </h1>
              <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400">
                Mengalihkan ke halaman masuk...
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-[#25324F] dark:text-white dark:hover:bg-[#121B33]"
              >
                Masuk sekarang
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-judul text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Buat akun
              </h1>
              <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-kobalt hover:underline dark:text-[#7C93FF]"
                >
                  Masuk
                </Link>
              </p>

              {formError && (
                <p
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                  {formError}
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {fields.map(({ isPassword, ...field }) => {
                  const Field = isPassword ? PasswordField : TextField;

                  return (
                    <Field
                      key={field.name}
                      {...field}
                      value={values[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errorOf(field.name)}
                      valid={isValid(field.name)}
                    />
                  );
                })}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-kobalt text-[15px] font-semibold text-white transition-colors hover:bg-kobalt-gelap focus:outline-none focus-visible:ring-4 focus-visible:ring-kobalt/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 animate-spin"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="4"
                      />
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {loading ? "Membuat akun..." : "Buat akun"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
